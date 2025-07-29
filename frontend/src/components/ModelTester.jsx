// src/components/ModelTester.jsx
import React, { useEffect } from "react";
import { useModels } from "../hooks/useModels";

export default function ModelTester({ videoRef, ready }) {
    const { cocoModel, loading, error } = useModels();

    useEffect(() => {
        if (ready && cocoModel && videoRef.current) {
            cocoModel
                .detect(videoRef.current)
                .then((preds) => console.log("COCO‑SSD predictions:", preds))
                .catch(console.error);
        }
    }, [ready, cocoModel, videoRef]);

    return (
        <div>
            {!ready && <p>Starting camera…</p>}
            {ready && loading && <p>Loading model…</p>}
            {ready && error && (
                <p style={{ color: "red" }}>Model error: {error.message}</p>
            )}
            {ready && !loading && !error && (
                <p>Camera & model ready—check console for predictions.</p>
            )}
            {/* Note: we do NOT render our own video here, since it's coming from CalibrationPage */}
        </div>
    );
}
