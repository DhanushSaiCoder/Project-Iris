/* eslint-env worker */

import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

let model;

async function loadModel() {
    try {
        await tf.ready();
        await tf.setBackend("webgl");
        const modelUrl = "/models/midas/depth_model.json";
        model = await tf.loadGraphModel(modelUrl);
        // eslint-disable-next-line no-restricted-globals
        self.postMessage({ type: "model_loaded" });
    } catch (e) {
        // eslint-disable-next-line no-restricted-globals
        self.postMessage({ type: "error", error: e.message });
    }
}

async function predictDepth(imageData) {
    if (!model) return;

    try {
        const { data, width, height } = imageData;
        const imageTensor = tf.tensor(data, [height, width, 4]).slice([0, 0, 0], [height, width, 3]);
        
        const resized = tf.image.resizeBilinear(imageTensor, [256, 256]).toFloat().div(127.5).sub(1);
        const batched = resized.expandDims(0).transpose([0, 3, 1, 2]);
        
        const output = await model.executeAsync(batched);
        let depth = Array.isArray(output) ? output[0] : output;
        depth = depth.squeeze();

        const min = depth.min();
        const max = depth.max();
        const normalized = depth.sub(min).div(max.sub(min));
        
        const depthData = await normalized.data();

        // eslint-disable-next-line no-restricted-globals
        self.postMessage({ type: "depth_map", data: depthData, width: 256, height: 256 });
        tf.dispose([imageTensor, resized, batched, output, depth, min, max, normalized]);

    } catch (e) {
        // eslint-disable-next-line no-restricted-globals
        self.postMessage({ type: "error", error: e.message });
    } finally {
        // Signal that the prediction is complete and the worker is ready for a new frame.
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
