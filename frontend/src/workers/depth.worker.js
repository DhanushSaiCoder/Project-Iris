/* eslint-env worker */

import * as tf from "@tensorflow/tfjs-core";
import * as depthEstimation from "@tensorflow-models/depth-estimation";
import "@tensorflow/tfjs-backend-webgl";

console.log("depth.worker: Worker script loaded.");

let model;

async function loadModel() {
    try {
        console.log("depth.worker: Starting model load...");
        await tf.ready();
        console.log("depth.worker: TensorFlow.js backend ready.");
        await tf.setBackend("webgl");
        console.log("depth.worker: WebGL backend set.");
        model = await depthEstimation.createEstimator(depthEstimation.SupportedModels.ARPortraitDepth);
        console.log("depth.worker: Model loaded successfully.");
        // eslint-disable-next-line no-restricted-globals
        self.postMessage({ type: "model_loaded" });
    } catch (e) {
        console.error("depth.worker: Error loading model:", e);
        // eslint-disable-next-line no-restricted-globals
        self.postMessage({ type: "error", error: e.message || "Unknown error during model loading." });
    }
}

async function predictDepth(imageData) {
    if (!model) {
        console.warn("depth.worker: predictDepth called but model is not loaded.");
        return;
    }

    try {
        console.log("depth.worker: Starting depth estimation...");
        console.log("depth.worker: Received imageData:", imageData);
        const estimationConfig = {
            minDepth: 0,
            maxDepth: 1
        };
        const rawDepthMap = await model.estimateDepth(imageData, estimationConfig);
        const depthTensor = rawDepthMap.depthTensor;
        console.log("depth.worker: Raw depthMap from model.estimateDepth:", rawDepthMap);
        if (!depthTensor || !depthTensor.shape || depthTensor.shape.length < 2) {
            console.error("depth.worker: Invalid depth map received from model.estimateDepth.");
            self.postMessage({ type: "error", error: "Invalid depth map." });
            return;
        }
        const depthWidth = depthTensor.shape[1];
        const depthHeight = depthTensor.shape[0];
        console.log("depth.worker: Sending depth map with dimensions:", depthWidth, depthHeight);
        // eslint-disable-next-line no-restricted-globals
        self.postMessage({ type: "depth_map", data: await depthTensor.array(), width: depthWidth, height: depthHeight });
    } catch (e) {
        console.error("depth.worker: Error during depth prediction:", e);
        // eslint-disable-next-line no-restricted-globals
        self.postMessage({ type: "error", error: e.message || "Unknown error during depth prediction." });
    } finally {
        // eslint-disable-next-line no-restricted-globals
        self.postMessage({ type: "prediction_complete" });
    }
}

// eslint-disable-next-line no-restricted-globals
self.onmessage = function (e) {
    if (e.data.type === "load") {
        loadModel();
    } else if (e.data.type === "predict") {
        predictDepth(e.data.imageData);
    }
};