// src/hooks/useDepthModel.js
import { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

export function useDepthModel(modelUrl = "/models/midas/depth_model.json") {
    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                await tf.ready();
                await tf.setBackend("webgl");
                const g = await tf.loadGraphModel(modelUrl);
                if (!cancelled) setModel(g);
            } catch (e) {
                if (!cancelled) setError(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [modelUrl]);

    async function predictDepth(mediaEl, size = 256) {
        if (!model || !mediaEl) throw new Error("Model or media not ready");
        let img = tf.browser.fromPixels(mediaEl);
        img = tf.image
            .resizeBilinear(img, [size, size])
            .toFloat()
            .div(127.5)
            .sub(1);
        const batched = img.expandDims(0).transpose([0, 3, 1, 2]); // Transpose to NCHW
        const output = await model.executeAsync(batched);
        let depth = Array.isArray(output) ? output[0] : output;
        depth = depth.squeeze();
        // normalize to [0,1]
        const min = depth.min(),
            max = depth.max();
        const norm = depth.sub(min).div(max.sub(min));
        tf.dispose([img, batched, output, depth, min, max]);
        return norm;
    }

    return { model, loading, error, predictDepth };
}
