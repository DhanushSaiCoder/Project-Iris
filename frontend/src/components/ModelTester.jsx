// src/components/ModelTester.jsx
import React, { useEffect, useState, useRef } from "react";
import { useModels } from "../hooks/useModels";
import { useDepthModel } from "../hooks/useDepthModel"; // Import useDepthModel
import * as tf from "@tensorflow/tfjs";

export default function ModelTester({ videoRef, ready }) {
    const { cocoModel, loading: cocoLoading, error: cocoError } = useModels();
    const { predictDepth, loading: depthLoading, error: depthError } = useDepthModel(); // Use useDepthModel
    const [predictions, setPredictions] = useState([]);
    const depthCanvasRef = useRef(null); // Ref for the depth map canvas

    useEffect(() => {
        if (ready && cocoModel && videoRef.current) {
            cocoModel
                .detect(videoRef.current)
                .then((preds) => {
                    console.log("COCO-SSD predictions:", preds);
                    setPredictions(preds);
                })
                .catch(console.error);
        }
    }, [ready, cocoModel, videoRef]);

    useEffect(() => {
        const drawDepthMap = async () => {
            if (ready && !depthLoading && !depthError && videoRef.current && depthCanvasRef.current) {
                const depthMap = await predictDepth(videoRef.current, 256);
                const ctx = depthCanvasRef.current.getContext("2d");
                const imageData = ctx.createImageData(depthMap.shape[0], depthMap.shape[1]);
                const data = await depthMap.data();

                for (let i = 0; i < data.length; i++) {
                    const pixelValue = Math.floor(data[i] * 255); // Normalize to 0-255
                    imageData.data[i * 4] = pixelValue;     // Red
                    imageData.data[i * 4 + 1] = pixelValue; // Green
                    imageData.data[i * 4 + 2] = pixelValue; // Blue
                    imageData.data[i * 4 + 3] = 255;        // Alpha
                }
                ctx.putImageData(imageData, 0, 0);
                tf.dispose(depthMap);
            }
        };

        const interval = setInterval(drawDepthMap, 100); // Draw depth map every 100ms
        return () => clearInterval(interval);
    }, [ready, depthLoading, depthError, videoRef, predictDepth]);


    return (
        <div>
            {!ready && <p>Starting camera…</p>}
            {(cocoLoading || depthLoading) && <p>Loading models…</p>}
            {(cocoError || depthError) && (
                <p style={{ color: "red" }}>Model error: {cocoError?.message || depthError?.message}</p>
            )}
            {ready && !cocoLoading && !depthLoading && !cocoError && !depthError && (
                <>
                    <p>Camera & models ready.</p>
                    {predictions.length > 0 && (
                        <div>
                            <h3>COCO-SSD Predictions:</h3>
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
                    <h3>Depth Map:</h3>
                    <canvas ref={depthCanvasRef} width="256" height="256" style={{ border: "1px solid white" }}></canvas>
                </>
            )}
            {/* Note: we do NOT render our own video here, since it's coming from CalibrationPage */}
        </div>
    );
}