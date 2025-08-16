/* eslint-env worker */

import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

let model;
let emaDepth = null; // Global for EMA smoothing

// Configuration for CPZ and depth processing
const CPZ_WIDTH_RATIO = 0.3; // 30% of frame width
const CPZ_HEIGHT_RATIO = 0.3; // 30% of frame height
const QUANTILE_PERCENTILE = 0.05; // 5th percentile for robustness against noise
const EMA_ALPHA = 0.3; // Smoothing factor for EMA (0.3-0.5 recommended)
const MIN_DEPTH_VALID = 0.01; // Minimum valid depth (closer to 0 for far objects)
const MAX_DEPTH_VALID = 1.0; // Maximum valid depth (assuming normalized 0-1 output)
const MIN_VALID_PIXEL_RATIO = 0.01; // Minimum ratio of valid pixels in CPZ for depth to be reliable

// Warms up the model by running a dummy prediction
async function warmUpModel() {
    if (!model) {
        return;
    }
    try {
        const dummyInput = tf.zeros([1, 3, 224, 224]);
        const dummyOutput = await model.executeAsync(dummyInput);
        dummyInput.dispose();
        if (Array.isArray(dummyOutput)) {
            dummyOutput.forEach(t => t.dispose());
        } else {
            dummyOutput.dispose();
        }
        console.log("Depth model warmed up.");
    } catch (e) {
        console.error("Error during model warm-up:", e);
    }
}

async function loadModel() {
    try {
        await tf.ready();
        await tf.setBackend("webgl");
        const modelPath = `${self.location.origin}/tfjs_models/fastdepth/model.json`;
        model = await tf.loadGraphModel(modelPath);
        await warmUpModel();
        self.postMessage({ type: "model_loaded" });
    } catch (e) {
        self.postMessage({ type: "error", error: e.message || "Unknown error during model loading." });
    }
}

async function predictDepth(imageData) {
    console.log('Worker: predictDepth entered (Phase 1: Visualize raw depth)');
    if (!model) {
        return;
    }

    let cpzSliceSize = 0;
    let cpzSliceShape = null;
    let resizedDepthShape = null;
    let debugInfo = {}; // Object to collect debug info

    try {
        const { width, height } = imageData;
        const inputTensor = tf.browser.fromPixels(imageData).toFloat().div(255);
        const reshapedInput = tf.image.resizeBilinear(inputTensor, [224, 224]).expandDims(0).transpose([0, 3, 1, 2]);

        const outputTensor = model.execute(reshapedInput);
        let depthTensor;
        if (Array.isArray(outputTensor)) {
            depthTensor = outputTensor[0];
        } else {
            depthTensor = outputTensor;
        }

        if (!depthTensor || !depthTensor.shape || depthTensor.shape.length < 2) {
            throw new Error("Invalid depth map from model output.");
        }

        // Ensure depthTensor is 3D (HWC) or 4D (NHWC)
        if (depthTensor.shape.length === 4) { // NHWC or NCHW
            if (depthTensor.shape[1] === 1 || depthTensor.shape[1] === 3) {
                depthTensor = depthTensor.transpose([0, 2, 3, 1]);
            }
            depthTensor = depthTensor.squeeze([0]);
        }
        if (depthTensor.shape.length === 3 && depthTensor.shape[2] === 1) {
            depthTensor = depthTensor.squeeze([2]);
        }

        const resizedDepthTensor = tf.image.resizeBilinear(
            depthTensor.expandDims(0).expandDims(-1), // Add batch and channel dimensions
            [height, width]
        ).squeeze();
        resizedDepthShape = resizedDepthTensor.shape;
        
        // Send the full resized depth map for visualization
        self.postMessage({ type: "depth_map", data: await resizedDepthTensor.array(), width: resizedDepthTensor.shape[1], height: resizedDepthTensor.shape[0] });

        const cpzX = Math.floor(width * (1 - CPZ_WIDTH_RATIO) / 2);
        const cpzY = Math.floor(height * (1 - CPZ_HEIGHT_RATIO) / 2);
        const cpzWidth = Math.floor(width * CPZ_WIDTH_RATIO);
        const cpzHeight = Math.floor(height * CPZ_HEIGHT_RATIO);

        const cpzSlice = resizedDepthTensor.slice([cpzY, cpzX], [cpzHeight, cpzWidth]);
        cpzSliceSize = cpzSlice.size;
        cpzSliceShape = cpzSlice.shape;
        debugInfo.cpzSliceShape = cpzSlice.shape;
        debugInfo.cpzSliceSize = cpzSlice.size;
        debugInfo.cpzSliceData = await cpzSlice.array(); // Get the actual data

        // Dispose tensors manually
        inputTensor.dispose();
        reshapedInput.dispose();
        if (Array.isArray(outputTensor)) {
            outputTensor.forEach(t => t.dispose());
        } else {
            outputTensor.dispose();
        }
        depthTensor.dispose();
        resizedDepthTensor.dispose();
        cpzSlice.dispose();

    } catch (e) {
        console.error("Worker: CRITICAL ERROR (Phase 1):", e);
        self.postMessage({ type: "error", error: e.message || "Unknown error during depth prediction (Phase 1)." });
        return;
    } finally {
        self.postMessage({
            type: "depth_analysis",
            emaDepth: null, // Temporarily set to null
            depthReliable: false, // Temporarily set to false
            debugInfo: {
                ...debugInfo,
                cpzSize: cpzSliceSize,
                cpzShape: cpzSliceShape,
                resizedDepthShape: resizedDepthShape,
                // No validCount, totalCPZPixels, currentQuantileDepth yet
                MIN_DEPTH_VALID, MAX_DEPTH_VALID, MIN_VALID_PIXEL_RATIO
            }
        });
        self.postMessage({ type: "prediction_complete" });
    }
}

self.onmessage = function (e) {
    if (e.data.type === "load") {
        loadModel();
    } else if (e.data.type === "predict") {
        console.log('Worker: onmessage received predict, calling predictDepth'); // Added for debugging
        predictDepth(e.data.imageData);
    }
};