// src/components/ModelTester.jsx
import React, { useEffect, useState } from "react";
import { useModels } from "../hooks/useModels";

export default function ModelTester({ videoRef, ready }) {
    const { cocoModel, loading, error } = useModels();
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {
        if (ready && cocoModel && videoRef.current) {
            cocoModel
                .detect(videoRef.current)
                .then((preds) => {
                    console.log("COCO‑SSD predictions:", preds);
                    setPredictions(preds);
                })
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
                <>
                    <p>Camera & model ready.</p>
                    {predictions.length > 0 && (
                        <div>
                            <h3>Predictions:</h3>
                            <ul>
                                {predictions.map((pred, index) => (
                                    <li key={index}>
                                        {pred.class} ({Math.round(pred.score * 100)}%)
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {predictions.length === 0 && <p>No objects detected yet.</p>}
                </>
            )}
            {/* Note: we do NOT render our own video here, since it's coming from CalibrationPage */}
        </div>
    );
}
