/* eslint-env worker */

import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

let model;

// Warms up the model by running a dummy prediction
async function warmUpModel() {
    if (!model) {
        return;
    }
    try {
        // Create a dummy tensor that matches the model's expected input shape
        const dummyInput = tf.zeros([1, 3, 224, 224]);
        
        // Run a dummy prediction
        const dummyOutput = await model.executeAsync(dummyInput);

        // Dispose tensors to free up memory
        dummyInput.dispose();
        if (Array.isArray(dummyOutput)) {
            dummyOutput.forEach(t => t.dispose());
        } else {
            dummyOutput.dispose();
        }
        console.log("Depth model warmed up.");
    } catch (e) {
        console.error("Error during model warm-up:", e);
        // Proceed even if warm-up fails; it will just be slow on the first real run.
    }
}

async function loadModel() {
    try {
        await tf.ready();
        await tf.setBackend("webgl");
        const modelPath = `${self.location.origin}/tfjs_models/fastdepth/model.json`;
        model = await tf.loadGraphModel(modelPath);
        
        // Warm up the model after loading it
        await warmUpModel();

        self.postMessage({ type: "model_loaded" });
    } catch (e) {
        self.postMessage({ type: "error", error: e.message || "Unknown error during model loading." });
    }
}

async function predictDepth(imageData) {
    if (!model) {
        return;
    }

    try {
        const { width, height, data } = imageData;
        // Create a tensor from the image data and normalize it
        const inputTensor = tf.browser.fromPixels(imageData).toFloat().div(255);
        // Reshape to [1, height, width, 3] if necessary (model expects batch dimension)
        const reshapedInput = tf.image.resizeBilinear(inputTensor, [224, 224]).expandDims(0).transpose([0, 3, 1, 2]);

        // Run the model
        const outputTensor = await model.executeAsync(reshapedInput);

        // The output tensor might be an array if the model has multiple outputs.
        // Based on model.json, it seems to have one output named "480".
        // If outputTensor is an array, find the one corresponding to depth.
        let depthTensor;
        if (Array.isArray(outputTensor)) {
            // Assuming the first output is the depth map, or we need to find by name
            // For now, let's assume it's the first one. If not, we'll need to inspect further.
            depthTensor = outputTensor[0];
        } else {
            depthTensor = outputTensor;
        }

        if (!depthTensor || !depthTensor.shape || depthTensor.shape.length < 2) {
            self.postMessage({ type: "error", error: "Invalid depth map from model output." });
            return;
        }

        // The output depth map might need to be squeezed if it has a batch dimension of 1
        if (depthTensor.shape[0] === 1 && depthTensor.shape.length === 4) {
            depthTensor = depthTensor.squeeze([0]); // Remove batch dimension
        }
        if (depthTensor.shape.length === 3 && depthTensor.shape[2] === 1) {
            depthTensor = depthTensor.squeeze([2]); // Remove channel dimension if it's 1
        }

        const depthHeight = depthTensor.shape[1];
        const depthWidth = depthTensor.shape[2];
        const depthData = await depthTensor.array();
        
        self.postMessage({ type: "depth_map", data: depthData, width: depthWidth, height: depthHeight });

        // Dispose tensors to free up memory
        try {
            inputTensor.dispose();
            reshapedInput.dispose();
            if (Array.isArray(outputTensor)) {
                outputTensor.forEach(t => t.dispose());
            } else {
                outputTensor.dispose();
            }
            depthTensor.dispose();
        } catch (disposeError) {
            console.error("Worker: Error during tensor disposal:", disposeError);
        }

    } catch (e) {
        self.postMessage({ type: "error", error: e.message || "Unknown error during depth prediction." });
    } finally {
        self.postMessage({ type: "prediction_complete" });
    }
}

self.onmessage = function (e) {
    if (e.data.type === "load") {
        loadModel();
    } else if (e.data.type === "predict") {
        predictDepth(e.data.imageData);
    }
};