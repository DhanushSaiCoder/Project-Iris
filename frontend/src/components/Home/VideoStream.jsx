import React, { useRef, useEffect, useState, useContext } from "react";
import { useCamera } from "../../hooks/useCamera";
import { useModels } from "../../hooks/useModels";
import { useDepthModel } from "../../hooks/useDepthModel";
import useUnidentifiedObstacleDetection from '../../hooks/useUnidentifiedObstacleDetection';
import { SettingsContext } from "../../context/SettingsContext";
import { speak, cancelSpeech, clearSpeechQueue, setSpeechStatusCallback } from "../../utils/speech";
import { triggerHapticFeedback } from "../../utils/haptics";
import { getDistance } from "../../utils/calibration";
import styles from "./VideoStream.module.css";

const VideoStream = ({ isDetecting, onLoadingChange, onObjectDetection }) => {
    const { videoRef, ready: cameraReady } = useCamera();
    const { cocoModel, loading: cocoLoading, error: cocoError } = useModels();
    const { depthMap, predictDepth, loading: depthLoading, error: depthError } = useDepthModel();
    const { alertDistance, developerMode, audioAnnouncements, hapticFeedback, calibration } = useContext(SettingsContext);
    const { calculateUnidentifiedObstacles } = useUnidentifiedObstacleDetection();
    const canvasRef = useRef(null);
    const lastDetected = useRef({});
    const lastAlerted = useRef({}); // To debounce alerts
    const lastGlobalSpeechTime = useRef(0); // To globally debounce speech
    const GLOBAL_SPEECH_DEBOUNCE_MS = 3000; // 3 seconds debounce for all speech

    const lastDetectionsRef = useRef([]);

    const CENTRAL_CROP_PERCENTAGE_X = 0.70; // Keep central 70% of the width
    const CROP_SIDE_PERCENTAGE_X = (1 - CENTRAL_CROP_PERCENTAGE_X) / 2; // 15% from each side

    const CENTRAL_CROP_PERCENTAGE_Y = 0.90; // Keep central 90% of the height
    const CROP_SIDE_PERCENTAGE_Y = (1 - CENTRAL_CROP_PERCENTAGE_Y) / 2; // 5% from each side

    const tempCanvasRef = useRef(null);

    const lastFrameProcessTime = useRef(0);
    const FRAME_PROCESS_INTERVAL_MS = 100; // Aim for 10 FPS

    useEffect(() => {
        onLoadingChange(cocoLoading || depthLoading);
    }, [cocoLoading, depthLoading, onLoadingChange]);

    const drawUnidentifiedObstacles = (obstacles, ctx, canvasWidth, canvasHeight, depthMapWidth, depthMapHeight) => {
        if (!obstacles) return;
        ctx.globalAlpha = 0.8;
        const scaleX = canvasWidth / depthMapWidth;
        const scaleY = canvasHeight / depthMapHeight;
        obstacles.forEach(obstacle => {
            const { x, y, width, height } = obstacle;
            const scaledX = x * scaleX;
            const scaledY = y * scaleY;
            const scaledWidth = width * scaleX;
            const scaledHeight = height * scaleY;
            ctx.beginPath();
            ctx.rect(scaledX, scaledY, scaledWidth, scaledHeight);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#FF0000';
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
            const text = obstacle.hazardLabel ? `${obstacle.hazardLabel.replace('_', ' ')} (${(obstacle.hazardConfidence * 100).toFixed(0)}%)` : 'Unidentified Obstacle';
            ctx.font = '16px Arial';
            const textWidth = ctx.measureText(text).width;
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(scaledX, scaledY > 20 ? scaledY - 20 : scaledY, textWidth + 10, 25);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(text, scaledX + 5, scaledY > 20 ? scaledY - 5 : scaledY + 15);
        });
        ctx.globalAlpha = 1.0;
    };

    useEffect(() => {
        let animationFrameId;

        const detect = async () => {
            if (cameraReady && videoRef.current && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");

                // Add frame rate control
                const now = Date.now();
                if (now - lastFrameProcessTime.current < FRAME_PROCESS_INTERVAL_MS) {
                    animationFrameId = requestAnimationFrame(detect);
                    return;
                }
                lastFrameProcessTime.current = now;

                // Ensure video dimensions are available and valid before proceeding
                if (!video.videoWidth || !video.videoHeight || video.videoWidth <= 0 || video.videoHeight <= 0) {
                    animationFrameId = requestAnimationFrame(detect);
                    return;
                }

                // --- Cropping Logic Start ---
                const videoWidth = video.videoWidth;
                const videoHeight = video.videoHeight;

                const sourceX = videoWidth * CROP_SIDE_PERCENTAGE_X;
                const sourceY = videoHeight * CROP_SIDE_PERCENTAGE_Y;
                const sourceWidth = videoWidth * CENTRAL_CROP_PERCENTAGE_X;
                const sourceHeight = videoHeight * CENTRAL_CROP_PERCENTAGE_Y;

                // Create or get temporary canvas
                let tempCanvas = tempCanvasRef.current;
                if (!tempCanvas) {
                    tempCanvas = document.createElement('canvas');
                    tempCanvasRef.current = tempCanvas;
                }

                tempCanvas.width = sourceWidth;
                tempCanvas.height = sourceHeight;
                const tempCtx = tempCanvas.getContext('2d');

                // Draw the cropped portion of the video onto the temporary canvas
                tempCtx.drawImage(
                    video,
                    sourceX, sourceY, sourceWidth, sourceHeight, // Source rectangle
                    0, 0, sourceWidth, sourceHeight              // Destination rectangle
                );
                // --- Cropping Logic End ---

                canvas.width = videoWidth; // Main canvas still uses full video dimensions for display
                canvas.height = videoHeight;

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw full video for background

                // NEW: Draw detection area outline
                ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)'; // Cyan, semi-transparent
                ctx.lineWidth = 2;
                ctx.setLineDash([10, 5]); // Dashed line
                ctx.strokeRect(sourceX, sourceY, sourceWidth, sourceHeight);
                ctx.setLineDash([]); // Reset line dash

                if (isDetecting && !cocoLoading && !depthLoading && cocoModel) {
                    if (depthMap && depthMap.data && depthMap.width && depthMap.height && developerMode) {
                        // drawDepthMap still uses full canvas dimensions, but its input is depthMap from cropped video
                        // This might need adjustment if depthMap dimensions change due to cropping.
                        // For now, assume predictDepth returns depthMap relative to cropped input.
                        drawDepthMap(depthMap.data, ctx, canvas.width, canvas.height, depthMap.width, depthMap.height);
                    }

                    // Pass the cropped canvas to models
                    const predictions = await cocoModel.detect(tempCanvas); // Pass tempCanvas
                    const filteredPredictions = predictions.filter(prediction => prediction.score > 0.6);

                    let processedPredictions = filteredPredictions.map(p => ({ ...p, isClose: false }));
                    let unidentifiedObstacles = [];

                    if (depthMap && depthMap.data && depthMap.width && depthMap.height) {
                        // processPredictionsWithDepth and calculateUnidentifiedObstacles now receive depthMap from cropped video
                        // Their internal logic needs to be aware of the cropped dimensions.
                        // The depthMap.width and depthMap.height passed here should be tempCanvas.width/height.
                        processedPredictions = processPredictionsWithDepth(
                            filteredPredictions,
                            depthMap.data,
                            tempCanvas.width, // Use cropped width
                            tempCanvas.height, // Use cropped height
                            depthMap.width,
                            depthMap.height
                        );
                        
                        const depthDataForHook = depthMap.data[0].flat();
                        unidentifiedObstacles = calculateUnidentifiedObstacles(
                            depthDataForHook,
                            filteredPredictions,
                            tempCanvas.width, // Use cropped width
                            tempCanvas.height, // Use cropped height
                            depthMap.width,
                            depthMap.height
                        );

                        if (unidentifiedObstacles.length > 0) {
                            const currentTime = Date.now();
                            const canSpeakGlobally = (currentTime - lastGlobalSpeechTime.current > GLOBAL_SPEECH_DEBOUNCE_MS);
                            if (canSpeakGlobally) {
                                if (audioAnnouncements) {
                                    const firstHazard = unidentifiedObstacles[0];
                                    const message = firstHazard.hazardLabel ?
                                        `${firstHazard.hazardLabel.replace('_', ' ')} detected` :
                                        'Obstacle detected';
                                    speak(message);
                                    lastGlobalSpeechTime.current = currentTime;
                                }
                                if (hapticFeedback) {
                                    triggerHapticFeedback('warning');
                                }
                            }
                        }
                    }

                                                            const newDetections = processedPredictions.filter(p => {
                        const lastDetection = lastDetectionsRef.current.find(ld => ld.class === p.class);
                        if (!lastDetection) {
                            return true;
                        }
                        const distanceChanged = Math.abs(lastDetection.avgDepthInMeters - p.avgDepthInMeters) > 0.5;
                        const isCloseChanged = lastDetection.isClose !== p.isClose;
                        return distanceChanged || isCloseChanged;
                    });

                    if (newDetections.length > 0) {
                        onObjectDetection(newDetections);
                        lastDetectionsRef.current = processedPredictions;
                    }

                    // Adjust bounding box x-coordinates for display on full canvas
                    const adjustedPredictions = processedPredictions.map(p => ({
                        ...p,
                        bbox: [p.bbox[0] + sourceX, p.bbox[1] + sourceY, p.bbox[2], p.bbox[3]]
                    }));
                    drawBoundingBoxes(adjustedPredictions, ctx);

                    const adjustedUnidentifiedObstacles = unidentifiedObstacles.map(o => ({
                        ...o,
                        x: o.x + sourceX,
                        y: o.y + sourceY
                    }));
                    if (depthMap && depthMap.data && depthMap.width && depthMap.height) {
                        drawUnidentifiedObstacles(
                            adjustedUnidentifiedObstacles,
                            ctx,
                            canvas.width, // Full canvas width
                            canvas.height, // Full canvas height
                            depthMap.width,
                            depthMap.height
                        );
                    }

                    predictDepth(tempCanvas); // Pass tempCanvas
                }
            }
            animationFrameId = requestAnimationFrame(detect);
        };

        detect();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [cameraReady, cocoLoading, depthLoading, cocoModel, predictDepth, videoRef, isDetecting, depthMap, alertDistance, calculateUnidentifiedObstacles, audioAnnouncements, hapticFeedback, developerMode, onObjectDetection, calibration]);

    // Clear speech queue if audio announcements are turned off
    useEffect(() => {
        if (!audioAnnouncements) {
            clearSpeechQueue();
        }
    }, [audioAnnouncements]);

    const drawDepthMap = (depthData, ctx, canvasWidth, canvasHeight, depthMapWidth, depthMapHeight) => {
        if (!depthData) {
            return;
        }

        const imageData = ctx.createImageData(canvasWidth, canvasHeight);
        const data = imageData.data;

        // Find min and max depth values for normalization
        let minDepth = Infinity;
        let maxDepth = -Infinity;
        const actualDepthData = depthData[0]; // Access the actual 2D array
        for (let i = 0; i < depthMapHeight; i++) {
            for (let j = 0; j < depthMapWidth; j++) {
                const depthValue = actualDepthData[i][j];
                if (depthValue !== undefined) {
                    minDepth = Math.min(minDepth, depthValue);
                    maxDepth = Math.max(maxDepth, depthValue);
                }
            }
        }

        const depthRange = maxDepth - minDepth;

        for (let y = 0; y < canvasHeight; y++) {
            for (let x = 0; x < canvasWidth; x++) {
                const dx = Math.floor(x * (depthMapWidth / canvasWidth));
                const dy = Math.floor(y * (depthMapHeight / canvasHeight));
                const depthValue = actualDepthData[dy][dx];

                const i = (y * canvasWidth + x) * 4;

                if (depthValue !== undefined) {
                    // Normalize depth value to 0-255 for grayscale
                    const normalizedDepth = depthRange > 0 ? (depthValue - minDepth) / depthRange : 0;
                    const gray = Math.floor(normalizedDepth * 255);

                    data[i] = gray;     // Red
                    data[i + 1] = gray; // Green
                    data[i + 2] = gray; // Blue
                    data[i + 3] = 255;  // Alpha (fully opaque)
                } else {
                    // If no depth data, make it transparent or black
                    data[i] = 0;
                    data[i + 1] = 0;
                    data[i + 2] = 0;
                    data[i + 3] = 0; // Transparent
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
    };

    const processPredictionsWithDepth = (predictions, depthData, canvasWidth, canvasHeight, depthMapWidth, depthMapHeight) => {
        const actualDepthData = depthData[0]; // Access the actual 2D array
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
                    if (actualDepthData[i] && actualDepthData[i][j] !== undefined) {
                        totalDepth += actualDepthData[i][j];
                        pixelCount++;
                    }
                }
            }

            const avgDepth = pixelCount > 0 ? totalDepth / pixelCount : 0;
            const avgDepthInMeters = calibration ? getDistance(avgDepth, calibration) : 0; // Convert normalized depth to meters
            const isClose = avgDepthInMeters < alertDistance;

            if (isClose) {
                const currentTime = Date.now();
                // Debounce per object class
                const canAlertObjectClass = !lastAlerted.current[prediction.class] || (currentTime - lastAlerted.current[prediction.class] > 5000);
                // Global debounce for all speech
                const canSpeakGlobally = (currentTime - lastGlobalSpeechTime.current > GLOBAL_SPEECH_DEBOUNCE_MS);

                if (canAlertObjectClass && canSpeakGlobally) {
                    if (audioAnnouncements) {
                        speak(`A ${prediction.class} is too close!`);
                        lastGlobalSpeechTime.current = currentTime; // Update global speech time
                    }
                    if (hapticFeedback) {
                        triggerHapticFeedback('critical'); // Trigger mild haptic feedback
                    }
                    lastAlerted.current[prediction.class] = currentTime;
                }
            }

            return { ...prediction, isClose, avgDepthInMeters };
        });
    };

    const drawBoundingBoxes = (predictions, ctx) => {
        // Do not clear the canvas here, to keep the depth map
        ctx.globalAlpha = 0.8;
        predictions.forEach(prediction => {
            const { bbox, class: className, score, isClose, avgDepthInMeters } = prediction;
            const [x, y, width, height] = bbox;

            // Set color based on proximity
            const color = isClose ? '#FF0000' : '#00FFFF'; // Red for close, Cyan for normal

            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.lineWidth = 3;
            ctx.strokeStyle = color;
            ctx.stroke();
            
            // Draw text background
            const text = `${className} (${Math.round(score * 100)}%)` + (avgDepthInMeters ? ` - ${avgDepthInMeters.toFixed(2)}m` : '');
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

    const [speechStatus, setSpeechStatus] = useState('Initializing speech...');

    useEffect(() => {
        setSpeechStatusCallback(setSpeechStatus);
        return () => {
            setSpeechStatusCallback(null); // Clean up callback on unmount
        };
    }, []);

    return (
        <div className={styles.videoContainer}>
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
            
                
