// src/hooks/useDepthModel.js
import { useState, useEffect, useRef, useCallback } from "react";
import { useModelContext } from "../context/ModelContext";

export function useDepthModel() {
  const { models, status } = useModelContext();
  const workerRef = useRef(null);
  const isBusyRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [depthMap, setDepthMap] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (models.depthWorker) {
      workerRef.current = models.depthWorker;
    }

    const onMessage = (e) => {
      if (!mounted) return;
      const { type, data, width, height, error: workerError } = e.data;

      if (type === "model_loaded") {
        setLoading(false);
      } else if (type === "depth_map") {
        setDepthMap({ data, width, height });
      } else if (type === "prediction_complete") {
        isBusyRef.current = false;
      } else if (type === "error") {
        setError(workerError || new Error("Depth worker error"));
        setLoading(false);
        isBusyRef.current = false;
      }
    };

    if (workerRef.current) {
      workerRef.current.addEventListener("message", onMessage);

      // tell worker to load if it hasn't
      try {
        workerRef.current.postMessage({ type: "load" });
      } catch (e) {
        console.error("Failed to post load to depth worker", e);
        setError(e);
        setLoading(false);
      }
    }

    return () => {
      mounted = false;
      if (workerRef.current) {
        workerRef.current.removeEventListener("message", onMessage);
        // DO NOT terminate the worker here — it's shared and cached by the service
      }
    };
  }, [models.depthWorker]); // Depend on models.depthWorker to ensure workerRef is updated

  useEffect(() => {
    if (status.depth === 'ready') {
      setLoading(false);
      setError(null);
    } else if (status.depth === 'error') {
      setLoading(false);
      setError(status.error);
    } else {
      setLoading(true);
      setError(null);
    }
  }, [status.depth, status.error]);

  const predictDepth = useCallback((mediaEl) => {
    const worker = workerRef.current;
    if (!worker || !mediaEl || isBusyRef.current) {
      return;
    }

    const isVideo = mediaEl instanceof HTMLVideoElement;
    const sourceWidth = isVideo ? mediaEl.videoWidth : mediaEl.width;
    const sourceHeight = isVideo ? mediaEl.videoHeight : mediaEl.height;

    if (!sourceWidth || !sourceHeight) return;

    isBusyRef.current = true;

    const canvas = document.createElement("canvas");
    canvas.width = sourceWidth;
    canvas.height = sourceHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(mediaEl, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Transfer the underlying buffer for speed. The buffer will be neutered on the main thread.
    try {
      worker.postMessage({ type: "predict", imageData }, [imageData.data.buffer]);
    } catch (e) {
      console.error("Failed to post predict to depth worker", e);
      isBusyRef.current = false;
    }
  }, []);

  return { loading, error, depthMap, predictDepth };
}
