// src/hooks/useDepthModel.js
import { useState, useEffect, useRef, useCallback } from "react";

export function useDepthModel() {
    const workerRef = useRef(null);
    const isBusyRef = useRef(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [depthMap, setDepthMap] = useState(null); // Keep if still needed for other purposes
    const [emaDepthValue, setEmaDepthValue] = useState(null); // New state for EMA depth
    const [isDepthReliable, setIsDepthReliable] = useState(false); // New state for depth reliability

    useEffect(() => {
        workerRef.current = new Worker(new URL("../workers/depth.worker.js", import.meta.url));

        const onMessage = (e) => {
            const { type, data, width, height, error: workerError, emaDepth, depthReliable } = e.data;

            if (type === "model_loaded") {
                setLoading(false);
            } else if (type === "depth_map") {
                // This might still be used if you need the full depth map for visualization or other features
                setDepthMap({ data, width, height });
            } else if (type === "depth_analysis") { // New message type
                setEmaDepthValue(emaDepth);
                setIsDepthReliable(depthReliable);
                console.log("Depth Analysis Debug Info:", e.data.debugInfo);
            } else if (type === "prediction_complete") {
                isBusyRef.current = false;
            } else if (type === "test_message") { // New test message type
                console.log("Worker Test Message:", e.data.message);
            } else if (type === "error") {
                setError(workerError);
                setLoading(false);
                isBusyRef.current = false;
            }
        };

        workerRef.current.addEventListener("message", onMessage);
        workerRef.current.postMessage({ type: "load" });

        return () => {
            workerRef.current.removeEventListener("message", onMessage);
            workerRef.current.terminate();
        };
    }, []);

    const predictDepth = useCallback((mediaEl) => {
        if (!workerRef.current || !mediaEl || isBusyRef.current) {
            return;
        }
        if (mediaEl.videoWidth === 0 || mediaEl.videoHeight === 0) {
            return;
        }

        isBusyRef.current = true;

        const canvas = document.createElement("canvas");
        canvas.width = mediaEl.videoWidth;
        canvas.height = mediaEl.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(mediaEl, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        workerRef.current.postMessage({ type: "predict", imageData }, [imageData.data.buffer]);
    }, []);

    return { loading, error, depthMap, predictDepth, emaDepthValue, isDepthReliable };
}