import React, { useRef, useEffect, useState, useContext } from "react";
import { useCamera } from "../../hooks/useCamera";
import { useModels } from "../../hooks/useModels";
import { useDepthModel } from "../../hooks/useDepthModel";
import { SettingsContext } from "../../context/SettingsContext";
import { speak, cancelSpeech, clearSpeechQueue, setSpeechStatusCallback } from "../../utils/speech";
import { triggerHapticFeedback } from "../../utils/haptics";
import styles from "./VideoStream.module.css";

const VideoStream = ({ isDetecting, onLoadingChange, onObjectDetection }) => {
    const { videoRef, ready: cameraReady } = useCamera();
    const { cocoModel, loading: cocoLoading, error: cocoError } = useModels();
    const { depthMap, predictDepth, loading: depthLoading, error: depthError, emaDepthValue, isDepthReliable } = useDepthModel();
    const { 
        alertDistance, 
        developerMode, 
        audioAnnouncements, 
        hapticFeedback, 
        unidentifiedObstacleAlertEnabled, 
        unidentifiedObstacleAlertThreshold, 
        unidentifiedObstacleAlertOffThreshold, 
        unidentifiedObstacleAlertCooldown, 
        unidentifiedObstacleAlertConsistencyTime,
        developerModeDebugOverlays
    } = useContext(SettingsContext);
    const canvasRef = useRef(null);
    const lastDetected = useRef({});
    const lastAlerted = useRef({}); // To debounce alerts for known objects
    const lastGlobalSpeechTime = useRef(0); // To globally debounce speech
    const GLOBAL_SPEECH_DEBOUNCE_MS = 3000; // 3 seconds debounce for all speech

    // New states for unidentified obstacle alert logic
    const [isUnidentifiedObstacleAlertActive, setIsUnidentifiedObstacleAlertActive] = useState(false);
    const lastUnidentifiedObstacleAlertTime = useRef(0);
    const unidentifiedObstacleConsistentStartTime = useRef(null);

    useEffect(() => {
        onLoadingChange(cocoLoading || depthLoading);
    }, [cocoLoading, depthLoading, onLoadingChange]);

    useEffect(() => {
        let animationFrameId;
        let lastFrameTime = performance.now(); // For time-based consistency

        const detect = async () => {
            const currentTime = performance.now();
            const deltaTime = currentTime - lastFrameTime;
            lastFrameTime = currentTime;

            if (cameraReady && videoRef.current && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");

                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Predict depth for the current frame
                console.log('VideoStream: Calling predictDepth'); // Added for debugging
                predictDepth(video);

                if (isDetecting && !cocoLoading && !depthLoading && cocoModel) {
                    // Draw depth map first if available (for debug overlays)
                    if (depthMap && developerModeDebugOverlays) {
                        drawDepthMap(depthMap.data, ctx, canvas.width, canvas.height, depthMap.width, depthMap.height);
                    }

                    const predictions = await cocoModel.detect(video);
                    const filteredPredictions = predictions.filter(prediction => prediction.score > 0.6);

                    let processedPredictions = filteredPredictions.map(p => ({ ...p, isClose: false }));

                    // Process known objects with depth (existing logic)
                    if (depthMap) { // This depthMap is the raw one, not the EMA one
                        processedPredictions = processPredictionsWithDepth(filteredPredictions, depthMap.data, canvas.width, canvas.height, depthMap.width, depthMap.height);
                    }

                    drawBoundingBoxes(processedPredictions, ctx);

                    if (filteredPredictions.length > 0 && onObjectDetection) {
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

                    // --- Unidentified Obstacle Detection Logic ---
                    if (unidentifiedObstacleAlertEnabled && isDepthReliable && emaDepthValue !== null) {
                        const cpzCoords = getCPZCoordinates(canvas.width, canvas.height);
                        let knownObjectInCPZ = false;

                        // Check if any known object overlaps with CPZ
                        for (const p of processedPredictions) {
                            const [x, y, width, height] = p.bbox;
                            if (checkOverlap(cpzCoords, { x, y, width, height })) {
                                knownObjectInCPZ = true;
                                break;
                            }
                        }

                        // Hysteresis and Consistency
                        if (emaDepthValue < unidentifiedObstacleAlertThreshold) { // Below T_on
                            if (unidentifiedObstacleConsistentStartTime.current === null) {
                                unidentifiedObstacleConsistentStartTime.current = currentTime;
                            }
                            if (currentTime - unidentifiedObstacleConsistentStartTime.current >= unidentifiedObstacleAlertConsistencyTime) {
                                if (!isUnidentifiedObstacleAlertActive) {
                                    setIsUnidentifiedObstacleAlertActive(true);
                                }
                            }
                        } else if (emaDepthValue > unidentifiedObstacleAlertOffThreshold) { // Above T_off
                            if (isUnidentifiedObstacleAlertActive) {
                                setIsUnidentifiedObstacleAlertActive(false);
                            }
                            unidentifiedObstacleConsistentStartTime.current = null;
                        } else { // Between T_on and T_off, maintain current state
                            // Do nothing, state is maintained
                        }

                        // Trigger Alert (with cooldown and COCO-SSD gating)
                        if (isUnidentifiedObstacleAlertActive && !knownObjectInCPZ) {
                            if (currentTime - lastUnidentifiedObstacleAlertTime.current > unidentifiedObstacleAlertCooldown) {
                                if (audioAnnouncements) {
                                    // Determine alert stage (Caution vs. Stop)
                                    const alertStage = emaDepthValue < (unidentifiedObstacleAlertThreshold * 0.75) ? "Stop" : "Caution"; // Example: 75% of threshold for Stop
                                    speak(`Unidentified obstacle ${alertStage === "Stop" ? "critically close!" : "ahead!"}`, alertStage); // Pass alertStage to speak for distinct feedback
                                }
                                if (hapticFeedback) {
                                    triggerHapticFeedback(emaDepthValue < (unidentifiedObstacleAlertThreshold * 0.75) ? 'critical' : 'mild'); // Distinct haptic feedback
                                }
                                lastUnidentifiedObstacleAlertTime.current = currentTime;
                            }
                        } else if (isUnidentifiedObstacleAlertActive && knownObjectInCPZ) {
                            // If a known object is in CPZ, and unidentified alert was active,
                            // potentially clear the unidentified alert and let known object alert take over.
                            // Or, if the known object alert is already handled, do nothing.
                            // For now, we just won't trigger the unidentified alert if known object is present.
                            // We might want to explicitly cancel any pending unidentified speech here.
                            cancelSpeech("unidentified"); // Assuming speak can take an ID to cancel specific speech
                        }
                    } else {
                        // If feature disabled or depth unreliable, ensure alert is off
                        if (isUnidentifiedObstacleAlertActive) {
                            setIsUnidentifiedObstacleAlertActive(false);
                        }
                        unidentifiedObstacleConsistentStartTime.current = null;
                    }

                    // --- Debug Overlays ---
                    if (developerModeDebugOverlays) {
                        const cpzCoords = getCPZCoordinates(canvas.width, canvas.height);
                        ctx.strokeStyle = 'yellow';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(cpzCoords.x, cpzCoords.y, cpzCoords.width, cpzCoords.height);

                        ctx.fillStyle = 'white';
                        ctx.font = '16px Arial';
                        ctx.fillText(`EMA Depth: ${emaDepthValue !== null ? emaDepthValue.toFixed(2) + 'm' : 'N/A'}`, 10, 30);
                        ctx.fillText(`Depth Reliable: ${isDepthReliable ? 'Yes' : 'No'}`, 10, 50);
                        ctx.fillText(`Unidentified Alert: ${isUnidentifiedObstacleAlertActive ? 'Active' : 'Inactive'}`, 10, 70);
                        ctx.fillText(`Consistent Time: ${unidentifiedObstacleConsistentStartTime.current !== null ? (currentTime - unidentifiedObstacleConsistentStartTime.current).toFixed(0) + 'ms' : 'N/A'}`, 10, 90);
                    }
                }
            }
            animationFrameId = requestAnimationFrame(detect);
        };

        detect();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [
        cameraReady,
        cocoLoading,
        depthLoading,
        cocoModel,
        predictDepth,
        videoRef,
        isDetecting,
        depthMap, // This is the raw depthMap, not emaDepthValue
        alertDistance,
        audioAnnouncements,
        hapticFeedback,
        emaDepthValue, // New dependency
        isDepthReliable, // New dependency
        unidentifiedObstacleAlertEnabled,
        unidentifiedObstacleAlertThreshold,
        unidentifiedObstacleAlertOffThreshold,
        unidentifiedObstacleAlertCooldown,
        unidentifiedObstacleAlertConsistencyTime,
        developerModeDebugOverlays,
        isUnidentifiedObstacleAlertActive, // Dependency for state update
        setIsUnidentifiedObstacleAlertActive, // Dependency for state update
    ]);

// Helper function for CPZ coordinates
const getCPZCoordinates = (canvasWidth, canvasHeight) => {
    const cpzWidth = canvasWidth * CPZ_WIDTH_RATIO;
    const cpzHeight = canvasHeight * CPZ_HEIGHT_RATIO;
    const cpzX = (canvasWidth - cpzWidth) / 2;
    const cpzY = (canvasHeight - cpzHeight) / 2;
    return { x: cpzX, y: cpzY, width: cpzWidth, height: cpzHeight };
};

// Helper function to check overlap between two rectangles
const checkOverlap = (rect1, rect2) => {
    // rect: {x, y, width, height}
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
};

// Constants for CPZ ratios (should match worker)
const CPZ_WIDTH_RATIO = 0.3;
const CPZ_HEIGHT_RATIO = 0.3;

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
            const avgDepthInMeters = (1 - avgDepth) * distanceMultiplier; // Convert normalized depth to meters
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

    const [distanceMultiplier, setDistanceMultiplier] = useState(2.25);

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
            {developerMode && (
                <div className={styles.calibrationControls}>
                    <label htmlFor="distanceMultiplier">Distance Multiplier: {distanceMultiplier.toFixed(2)}</label>
                    <input
                        type="range"
                        id="distanceMultiplier"
                        min="1"
                        max="50"
                        step="0.5"
                        value={distanceMultiplier}
                        onChange={(e) => setDistanceMultiplier(parseFloat(e.target.value))}
                        className={styles.slider}
                    />
                </div>
            )}
        </div>
    );
};

export default VideoStream;