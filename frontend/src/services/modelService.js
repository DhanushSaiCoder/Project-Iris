// src/services/modelService.js
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

let cocoModel = null;
let cocoPromise = null;

/**
 * Returns a Promise that resolves to a loaded coco-ssd model.
 * Promise is cached to prevent double-loading; instance is cached.
 * options: { backend: 'webgl'|'cpu', base: 'lite_mobilenet_v2'|'mobilenet_v1' }
 */
export function getCocoModel(options = { backend: "webgl", base: "lite_mobilenet_v2" }) {
  if (cocoModel) {
    console.log("getCocoModel: Returning cached model.");
    return Promise.resolve(cocoModel);
  }
  if (cocoPromise) {
    console.log("getCocoModel: Returning existing load promise.");
    return cocoPromise;
  }

  console.log("getCocoModel: Starting new model load.");
  cocoPromise = (async () => {
    await tf.ready();
    try {
      // try to set backend; if it fails, tf will fall back
      await tf.setBackend(options.backend);
      await tf.ready();
    } catch (e) {
      console.warn("Failed to set TF backend:", e);
    }

    const model = await cocoSsd.load({ base: options.base });

    // Warm-up: do a tiny detect call to compile kernels (avoid runtime stall later)
    try {
      const warmupCanvas = document.createElement("canvas");
      warmupCanvas.width = 1;
      warmupCanvas.height = 1;
      await model.detect(warmupCanvas);
    } catch (err) {
      // non-fatal
      console.warn("Coco warmup failed:", err);
    }

    cocoModel = model;
    cocoPromise = null;
    return cocoModel;
  })();

  return cocoPromise;
}

export function isCocoLoaded() {
  return !!cocoModel;
}

export function disposeCocoModel() {
  if (cocoModel) {
    try {
      if (typeof cocoModel.dispose === "function") cocoModel.dispose();
    } catch (e) {
      console.warn("Error disposing coco model:", e);
    }
  }
  cocoModel = null;
  cocoPromise = null;
}
