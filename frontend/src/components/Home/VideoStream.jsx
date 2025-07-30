import React, { useRef, useEffect, useState } from "react";
import { useCamera } from "../../hooks/useCamera";
import { useModels } from "../../hooks/useModels";
import { useDepthModel } from "../../hooks/useDepthModel";
import styles from "./VideoStream.module.css";

const VideoStream = () => {
    const { videoRef, ready: cameraReady } = useCamera();
    const { cocoModel, loading: cocoLoading } = useModels();
    const { depthMap, predictDepth, loading: depthLoading } = useDepthModel();
    const canvasRef = useRef(null);
    const [isDetecting, setIsDetecting] = useState(true);

    useEffect(() => {
        if (cameraReady && videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
                if (canvasRef.current) {
                    canvasRef.current.width = videoRef.current.videoWidth;
                    canvasRef.current.height = videoRef.current.videoHeight;
                }
            };
        }
    }, [cameraReady, videoRef]);

    useEffect(() => {
        let animationFrameId;

        const detect = async () => {
            if (isDetecting && cameraReady && !cocoLoading && !depthLoading && videoRef.current && canvasRef.current && cocoModel) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");

                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Object detection
                const predictions = await cocoModel.detect(video);
                drawBoundingBoxes(predictions, ctx);

                // Depth prediction (request)
                predictDepth(video);
            }
            animationFrameId = requestAnimationFrame(detect);
        };

        detect();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [cameraReady, cocoLoading, depthLoading, cocoModel, predictDepth, videoRef, isDetecting]);

    useEffect(() => {
        if (depthMap && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            drawDepthMap(depthMap, ctx, canvas.width, canvas.height);
        }
    }, [depthMap]);

    const drawBoundingBoxes = (predictions, ctx) => {
        ctx.globalAlpha = 0.8;
        predictions.forEach(prediction => {
            if (prediction.score > 0.6) { // Confidence threshold
                ctx.beginPath();
                ctx.rect(...prediction.bbox);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#00FFFF';
                ctx.fillStyle = '#00FFFF';
                ctx.stroke();
                ctx.fillText(
                    `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
                    prediction.bbox[0],
                    prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
                );
            }
        });
        ctx.globalAlpha = 1.0;
    };

    const drawDepthMap = (depthData, ctx, width, height) => {
        if (!depthData) return;
        const depthMapWidth = 256;
        const depthMapHeight = 256;

        const originalImageData = ctx.getImageData(0, 0, width, height);
        const newData = new Uint8ClampedArray(originalImageData.data);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const dx = Math.floor(x * (depthMapWidth / width));
                const dy = Math.floor(y * (depthMapHeight / height));
                const depthIndex = dy * depthMapWidth + dx;
                const depthValue = depthData[depthIndex];

                if (depthValue > 0.5) { // Example threshold: only show "close" objects
                    const i = (y * width + x) * 4;
                    // Mix with original pixel color to make it look like an overlay
                    newData[i] = newData[i] * (1 - depthValue) + (255 * depthValue); // R
                    newData[i + 1] = newData[i+1] * (1-depthValue) + (0 * depthValue); // G
                    newData[i + 2] = newData[i+2] * (1-depthValue) + (0 * depthValue); // B
                    newData[i + 3] = 200; // Alpha
                }
            }
        }
        const newImageData = new ImageData(newData, width, height);
        ctx.putImageData(newImageData, 0, 0);
    };

    const statusText = cocoLoading || depthLoading ? "Loading Models..." : "Detection active";

    return (
        <div className={styles.VideoStream}>
            <video
                ref={videoRef}
                className={styles.video}
                autoPlay
                playsInline
                muted
                style={{ display: "none" }}
            />
            <canvas ref={canvasRef} className={styles.canvas} />
            <div className={styles.statusOverlay}>{statusText}</div>
        </div>
    );
};

export default VideoStream;
