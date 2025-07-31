// src/hooks/useDepthModel.js
import { useState, useEffect, useRef, useCallback } from "react";

export function useDepthModel() {
    const workerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [depthMap, setDepthMap] = useState(null);

    useEffect(() => {
        // Initialize the worker
        workerRef.current = new Worker(new URL("../workers/depth.worker.js", import.meta.url));

        const onMessage = (e) => {
            const { type, data, error: workerError } = e.data;
            if (type === "model_loaded") {
                setLoading(false);
            } else if (type === "depth_map") {
                setDepthMap(data);
            } else if (type === "error") {
                setError(workerError);
                setLoading(false);
            }
        };

        workerRef.current.addEventListener("message", onMessage);

        // Load the model
        workerRef.current.postMessage({ type: "load" });

        // Cleanup
        return () => {
            workerRef.current.removeEventListener("message", onMessage);
            workerRef.current.terminate();
        };
    }, []);

    const predictDepth = useCallback((mediaEl) => {
        if (!workerRef.current || !mediaEl) return;

        const canvas = document.createElement("canvas");
        canvas.width = mediaEl.videoWidth;
        canvas.height = mediaEl.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(mediaEl, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        workerRef.current.postMessage({ type: "predict", imageData }, [imageData.data.buffer]);
    }, []);

    return { loading, error, depthMap, predictDepth };
}
