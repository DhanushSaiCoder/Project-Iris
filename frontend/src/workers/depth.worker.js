/* eslint-env worker */

import * as tf from "@tensorflow/tfjs-core";
import * as depthEstimation from "@tensorflow-models/depth-estimation";
import "@tensorflow/tfjs-backend-webgl";

let model;

async function loadModel() {
    try {
        await tf.ready();
        await tf.setBackend("webgl");
        model = await depthEstimation.createEstimator(depthEstimation.SupportedModels.ARPortraitDepth);
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
        const estimationConfig = {
            minDepth: 0,
            maxDepth: 1
        };
        const rawDepthMap = await model.estimateDepth(imageData, estimationConfig);
        const depthTensor = rawDepthMap.depthTensor;
        
        if (!depthTensor || !depthTensor.shape || depthTensor.shape.length < 2) {
            self.postMessage({ type: "error", error: "Invalid depth map." });
            return;
        }
        const depthWidth = depthTensor.shape[1];
        const depthHeight = depthTensor.shape[0];
        const depthData = await depthTensor.array();
        
        self.postMessage({ type: "depth_map", data: depthData, width: depthWidth, height: depthHeight });
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