// src/hooks/useModels.js
import { useState, useEffect } from "react";
// import the main TF.js runtime, not from coco-ssd
import * as tf from "@tensorflow/tfjs";
// load the WebGL backend (must come _after_ tf import)
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

export function useModels() {
  const [cocoModel, setCocoModel] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadCoco() {
      try {
        // 1) wait for TF to initialize
        await tf.ready();
        // 2) optionally set the backend (defaults to webgl if available)
        await tf.setBackend("webgl");
        // 3) load the coco-ssd wrapper
        const model = await cocoSsd.load({ base: "lite_mobilenet_v2" });
        if (!isCancelled) setCocoModel(model);
      } catch (err) {
        if (!isCancelled) setError(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadCoco();
    return () => {
      isCancelled = true;
    };
  }, []);

  return { cocoModel, loading, error };
}
