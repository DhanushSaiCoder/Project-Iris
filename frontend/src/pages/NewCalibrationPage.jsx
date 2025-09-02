
// src/pages/NewCalibrationPage.jsx
import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import { Play, Check, Timer, MoveLeft, MoveRight, CheckCircle, XCircle, ArrowRight, ZapOff, Camera } from 'lucide-react';
import PageLoading from "../components/common/PageLoading";
import styles from "./NewCalibrationPage.module.css";
import { useCamera } from "../hooks/useCamera";
import { useDepthModel } from "../hooks/useDepthModel";
import { linearRegression, getDistance } from "../utils/calibration";
import { SettingsContext } from "../context/SettingsContext";

const DISTANCES = [1, 2, 3];
const TOLERANCE = 0.1; 
const STABILITY_THRESHOLD = 0.005; // Made it a bit more lenient
const STABILITY_WINDOW = 15; // Check over 15 frames
const RECORDING_SECONDS = 3;

export default function NewCalibrationPage() {
    const [step, setStep] = useState(0);
    const [calibrationData, setCalibrationData] = useState([]);
    const [calibration, setCalibration] = useState(null);
    const [currentDepth, setCurrentDepth] = useState(null);
    
    // State Machine for the process
    const [processState, setProcessState] = useState('idle'); // idle | guiding | stabilizing | pre-recording | recording | reviewing
    const [guidance, setGuidance] = useState("Get ready to calibrate.");
    const [stability, setStability] = useState(0); // 0-100 stability score
    const [lastDepthValues, setLastDepthValues] = useState([]);

    const { autoCapture } = useContext(SettingsContext);
    const { videoRef, ready: cameraReady } = useCamera();
    const { predictDepth, loading: depthLoading, error: depthError, depthMap } = useDepthModel();
    
    const canvasRef = useRef(null);
    const samples = useRef([]);
    const timerRef = useRef(null);

    const speak = useCallback((text) => {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
    }, []);

    const finish = useCallback(() => {
        if (calibration) {
            localStorage.setItem("bw-calibration", JSON.stringify(calibration));
            speak("Calibration complete. Your device is now calibrated.");
            window.location.href = "/";
        }
    }, [calibration, speak]);

    const startCountdown = useCallback((isAuto) => {
        const startRecord = () => {
            setProcessState('recording');
            samples.current = [];
            speak(`Recording for ${RECORDING_SECONDS} seconds.`);
            timerRef.current = setTimeout(() => {
                if (samples.current.length > 0) {
                    const avg = samples.current.reduce((a, b) => a + b, 0) / samples.current.length;
                    const newPoint = [1 / avg, DISTANCES[step]];
                    const updatedData = [...calibrationData, newPoint];
                    setCalibrationData(updatedData);
                    speak("Measurement saved.");
                    if (updatedData.length >= DISTANCES.length) {
                        setCalibration(linearRegression(updatedData));
                    }
                } else {
                    speak("Recording failed. Please try again.");
                }
                setProcessState('reviewing');
            }, RECORDING_SECONDS * 1000);
        };

        if (isAuto) {
            setProcessState('pre-recording');
            speak(`Object stable. Auto-capturing in 3 seconds. Say stop or press cancel.`);
            timerRef.current = setTimeout(startRecord, 3000);
        } else {
            startRecord();
        }
    }, [step, calibrationData, speak]);

    // Main logic for guidance and stability
    useEffect(() => {
        if (processState !== 'guiding') {
            setStability(0);
            return;
        }

        if (currentDepth) {
            const target = DISTANCES[step];
            const error = target - currentDepth;

            if (Math.abs(error) > TOLERANCE) {
                setGuidance(error > 0 ? "Move Closer" : "Move Farther");
                setLastDepthValues([]);
                setStability(0);
            } else {
                setGuidance("In position. Hold steady...");
                const newDepths = [...lastDepthValues, currentDepth].slice(-STABILITY_WINDOW);
                setLastDepthValues(newDepths);

                if (newDepths.length === STABILITY_WINDOW) {
                    const mean = newDepths.reduce((a, b) => a + b, 0) / newDepths.length;
                    const variance = newDepths.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / newDepths.length;
                    const newStability = Math.max(0, 100 - (variance / STABILITY_THRESHOLD) * 100);
                    setStability(newStability);

                    if (newStability >= 100) {
                        if (autoCapture) {
                            startCountdown(true);
                        } else {
                            setProcessState('stabilizing');
                        }
                    }
                }
            }
        }
    }, [currentDepth, processState, step, autoCapture, startCountdown, lastDepthValues]);

    // Effect for processing the depth map
    useEffect(() => {
        if (!depthMap) return;
        const { data: rawDepthData, width, height } = depthMap;
        if (!rawDepthData || !width || !height) return;

        let depth2D = null;
        // ... (code to normalize depthData to 2D, unchanged)
        if (Array.isArray(rawDepthData)) {
            if (Array.isArray(rawDepthData[0])) {
                if (typeof rawDepthData[0][0] === "number") depth2D = rawDepthData;
                else if (Array.isArray(rawDepthData[0][0])) {
                    if (rawDepthData.length === 1) depth2D = rawDepthData[0];
                    else depth2D = rawDepthData.find(mat => Array.isArray(mat) && typeof mat[0]?.[0] === "number") || rawDepthData[0];
                } else return;
            } else {
                if (rawDepthData.length === width * height) {
                    depth2D = [];
                    for (let y = 0; y < height; y++) depth2D.push(rawDepthData.slice(y * width, (y + 1) * width));
                } else return;
            }
        } else if (ArrayBuffer.isView(rawDepthData)) {
            if (rawDepthData.length === width * height) {
                depth2D = [];
                for (let y = 0; y < height; y++) {
                    const row = new Array(width);
                    for (let x = 0; x < width; x++) row[x] = rawDepthData[y * width + x];
                    depth2D.push(row);
                }
            } else return;
        } else return;

        const patchSize = 50;
        const y0 = Math.max(0, Math.floor((height - patchSize) / 2));
        const x0 = Math.max(0, Math.floor((width - patchSize) / 2));

        let sum = 0, count = 0;
        for (let y = y0; y < Math.min(height, y0 + patchSize); y++) {
            for (let x = x0; x < Math.min(width, x0 + patchSize); x++) {
                const v = depth2D[y]?.[x];
                if (v !== undefined && v !== null && Number.isFinite(v)) {
                    sum += v;
                    count++;
                }
            }
        }

        const avg = count > 0 ? sum / count : 0;
        setCurrentDepth(avg);

        if (processState === 'recording' && count > 0 && Number.isFinite(avg)) {
            samples.current.push(avg);
        }
    }, [depthMap, processState]);

    // Effect for running predictions
    useEffect(() => {
        if (!cameraReady || !videoRef.current || depthLoading) return;
        const video = videoRef.current;
        const predict = () => predictDepth(video);
        const interval = setInterval(predict, 200);
        return () => clearInterval(interval);
    }, [cameraReady, videoRef, predictDepth, depthLoading]);

    const handleCancel = () => {
        clearTimeout(timerRef.current);
        setProcessState('guiding');
        speak("Cancelled.");
    }

    const handleRedo = () => {
        setCalibrationData(prev => prev.slice(0, -1));
        setProcessState('idle');
    };

    const handleNext = () => {
        if (step < DISTANCES.length - 1) {
            setStep(prev => prev + 1);
            setProcessState('idle');
        } else {
            setStep(prev => prev + 1); // Move to verification
        }
    };

    const renderContent = () => {
        if (step >= DISTANCES.length) {
            return (
                <>
                    <div className={styles.stepIndicator}>Verification</div>
                    <h2>Calibration Complete!</h2>
                    <p>Move an object to see the estimated distance.</p>
                    {currentDepth && <p className={styles.distanceDisplay}>{(getDistance(currentDepth, calibration)).toFixed(2)}m</p>}
                    <button onClick={finish}><Check size={20} /><span>Finish & Save</span></button>
                </>
            );
        }

        const commonHeader = (
            <>
                <div className={styles.stepIndicator}>Step {step + 1} of {DISTANCES.length}</div>
                <h2>Calibrate at {DISTANCES[step]}m</h2>
            </>
        );

        switch (processState) {
            case 'idle':
                return (
                    <>
                        {commonHeader}
                        <p>When ready, press Start to begin guidance.</p>
                        <button onClick={() => { setProcessState('guiding'); speak(`Step ${step + 1}. Calibrate at ${DISTANCES[step]} meters.`)}}><Play size={20} /><span>Start Guidance</span></button>
                    </>
                );
            case 'guiding':
                return (
                    <>
                        {commonHeader}
                        <div className={styles.guidanceBox}>
                            {guidance === "Move Closer" ? <MoveLeft size={24} /> : <MoveRight size={24} />}
                            <span>{guidance}</span>
                        </div>
                        <div className={styles.stabilityMeter}>
                            <div className={styles.stabilityFill} style={{ width: `${stability}%` }}></div>
                            <span className={styles.stabilityText}>{Math.round(stability)}% Stable</span>
                        </div>
                    </>
                );
            case 'stabilizing':
                 return (
                    <>
                        {commonHeader}
                        <div className={styles.guidanceBox}>
                           <CheckCircle size={24} className={styles.successIcon} />
                           <span>Object is stable.</span>
                        </div>
                        <p>Press the button to capture.</p>
                        <button onClick={() => startCountdown(false)}><Camera size={20} /><span>Capture</span></button>
                    </>
                );
            case 'pre-recording':
                return (
                    <>
                        {commonHeader}
                        <div className={styles.guidanceBox}>
                            <Timer size={24} className={styles.recordingIcon} />
                            <span>Auto-capture in 3s...</span>
                        </div>
                        <button onClick={handleCancel} className={styles.redoButton}><ZapOff size={20} /><span>Cancel</span></button>
                    </>
                );
            case 'recording':
                return (
                    <>
                        {commonHeader}
                        <div className={styles.guidanceBox}>
                            <Timer size={24} className={styles.recordingIcon} />
                            <span>Recording...</span>
                        </div>
                    </>
                );
            case 'reviewing':
                return (
                    <>
                        {commonHeader}
                        <div className={styles.guidanceBox}>
                            <CheckCircle size={24} className={styles.successIcon} />
                            <span>Measurement Saved!</span>
                        </div>
                        <div className={styles.buttonGroup}>
                            <button onClick={handleRedo} className={styles.redoButton}><XCircle size={20} /><span>Redo Step</span></button>
                            <button onClick={handleNext}><span>{step < DISTANCES.length - 1 ? "Next Step" : "Finish Calibration"}</span><ArrowRight size={20} /></button>
                        </div>
                    </>
                );
            default:
                return <PageLoading />;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.videoWrapper}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={styles.videoFeed}
                />
                <canvas ref={canvasRef} className={styles.depthOverlay} />
                {(!cameraReady || depthLoading) && <div className={styles.videoLoading}><PageLoading /></div>}
            </div>
            <div className={styles.contentWrapper}>
                {renderContent()}
            </div>
        </div>
    );
}
