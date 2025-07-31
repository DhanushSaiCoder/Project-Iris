import React, { useRef, useEffect, useState, useContext } from "react";
import { useCamera } from "../../hooks/useCamera";
import { useModels } from "../../hooks/useModels";
import { useDepthModel } from "../../hooks/useDepthModel";
import { SettingsContext } from "../../context/SettingsContext";
import styles from "./VideoStream.module.css";

const VideoStream = ({ isDetecting, onLoadingChange, onObjectDetection }) => {
    const { videoRef, ready: cameraReady } = useCamera();
    const { cocoModel, loading: cocoLoading, error: cocoError } = useModels();
    const { depthMap, predictDepth, loading: depthLoading, error: depthError } = useDepthModel();
    const { alertDistance } = useContext(SettingsContext);
    const canvasRef = useRef(null);
    const lastDetected = useRef({});
    const lastAlerted = useRef({}); // To debounce alerts

    // Request notification permission on component mount
    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        onLoadingChange(cocoLoading || depthLoading);
    }, [cocoLoading, depthLoading, onLoadingChange]);

    // Function to show a notification
    const showProximityAlert = (objectClass) => {
        const currentTime = Date.now();
        // Debounce alerts per object class (e.g., every 5 seconds)
        if (!lastAlerted.current[objectClass] || (currentTime - lastAlerted.current[objectClass] > 5000)) {
            if ("Notification" in window && Notification.permission === "granted") {
                const notification = new Notification("Proximity Alert!", {
                    body: `A ${objectClass} is too close!`,
                    icon: "/logo192.png", // Optional: add an icon
                });
            }
            console.warn(`PROXIMITY ALERT: ${objectClass} is too close.`);
            lastAlerted.current[objectClass] = currentTime;
        }
    };

    useEffect(() => {
        let animationFrameId;

        const detect = async () => {
            if (cameraReady && videoRef.current && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");

                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                if (isDetecting && !cocoLoading && !depthLoading && cocoModel) {
                    // Draw depth map first if available
                    if (depthMap) {
                        console.log("Depth map data received, drawing visualization.");
                        drawDepthMap(depthMap, ctx, canvas.width, canvas.height);
                    }

                    const predictions = await cocoModel.detect(video);
                    const filteredPredictions = predictions.filter(prediction => prediction.score > 0.6);

                    let processedPredictions = filteredPredictions.map(p => ({ ...p, isClose: false }));

                    if (depthMap) {
                        processedPredictions = processPredictionsWithDepth(filteredPredictions, depthMap, canvas.width, canvas.height);
                    }

                    drawBoundingBoxes(processedPredictions, ctx);

                    if (filteredPredictions.length > 0 && onObjectDetection) {
                        const currentTime = Date.now();
                        const objectsToSend = [];
                        filteredPredictions.forEach(p => {
                            if (!lastDetected.current[p.class] || (currentTime - lastDetected.current[p.class] > 2000)) { // 2 seconds debounce for list
                                objectsToSend.push({ ...p, timestamp: new Date().toLocaleTimeString() });
                                lastDetected.current[p.class] = currentTime;
                            }
                        });
                        if (objectsToSend.length > 0) {
                            onObjectDetection(objectsToSend);
                        }
                    }

                    predictDepth(video); // Predict for the next frame
                }
            }
            animationFrameId = requestAnimationFrame(detect);
        };

        detect();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [cameraReady, cocoLoading, depthLoading, cocoModel, predictDepth, videoRef, isDetecting, depthMap, alertDistance]); // Add dependencies

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

                if (depthValue > 0.1) { // Example threshold: only show "close" objects
                    const i = (y * width + x) * 4;
                    // Mix with original pixel color to make it look like an overlay
                    newData[i] = newData[i] * (1 - depthValue * 0.5) + (255 * depthValue * 0.5); // R
                    newData[i + 1] = newData[i+1] * (1 - depthValue * 0.5) + (0 * depthValue * 0.5); // G
                    newData[i + 2] = newData[i+2] * (1 - depthValue * 0.5) + (255 * (1 - depthValue) * 0.5); // B
                    newData[i + 3] = 255; // Alpha
                }
            }
        }
        const newImageData = new ImageData(newData, width, height);
        ctx.putImageData(newImageData, 0, 0);
    };

    const processPredictionsWithDepth = (predictions, depthData, canvasWidth, canvasHeight) => {
        const depthMapWidth = 256;
        const depthMapHeight = 256;

        return predictions.map(prediction => {
            const [x, y, width, height] = prediction.bbox;

            // Map bounding box to depth map coordinates
            const startX = Math.floor((x / canvasWidth) * depthMapWidth);
            const startY = Math.floor((y / canvasHeight) * depthMapHeight);
            const endX = Math.ceil(((x + width) / canvasWidth) * depthMapWidth);
            const endY = Math.ceil(((y + height) / canvasHeight) * depthMapHeight);

            let totalDepth = 0;
            let pixelCount = 0;

            for (let i = startY; i < endY; i++) {
                for (let j = startX; j < endX; j++) {
                    const depthIndex = i * depthMapWidth + j;
                    if (depthData[depthIndex] !== undefined) {
                        totalDepth += depthData[depthIndex];
                        pixelCount++;
                    }
                }
            }

            const avgDepth = pixelCount > 0 ? totalDepth / pixelCount : 0;
            const isClose = avgDepth > alertDistance;

            if (isClose) {
                showProximityAlert(prediction.class);
            }

            return { ...prediction, isClose };
        });
    };

    const drawBoundingBoxes = (predictions, ctx) => {
        // Do not clear the canvas here, to keep the depth map
        ctx.globalAlpha = 0.8;
        predictions.forEach(prediction => {
            const { bbox, class: className, score, isClose } = prediction;
            const [x, y, width, height] = bbox;

            // Set color based on proximity
            const color = isClose ? '#FF0000' : '#00FFFF'; // Red for close, Cyan for normal

            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.lineWidth = 3;
            ctx.strokeStyle = color;
            ctx.stroke();
            
            // Draw text background
            const text = `${className} (${Math.round(score * 100)}%)`;
            ctx.font = '18px Arial';
            const textWidth = ctx.measureText(text).width;
            ctx.fillStyle = color;
            ctx.fillRect(x, y > 20 ? y - 20 : y, textWidth + 10, 25);
            
            // Draw text
            ctx.fillStyle = '#000000';
            ctx.fillText(text, x + 5, y > 20 ? y - 5 : y + 15);
        });
        ctx.globalAlpha = 1.0;
    };

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
        </div>
    );
};

export default VideoStream;
