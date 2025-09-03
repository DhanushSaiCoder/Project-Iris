// src/pages/NewCalibrationPage.jsx
import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import { Camera, Check, Plus, Minus } from 'lucide-react';
import PageLoading from "../components/common/PageLoading";
import styles from "./NewCalibrationPage.module.css";
import { useCamera } from "../hooks/useCamera";
import { useDepthModel } from "../hooks/useDepthModel";
import { linearRegression, getDistance } from "../utils/calibration";
import { SettingsContext } from "../context/SettingsContext";

const DISTANCES = [1, 2]; // Distances in meters for calibration
const ADJUSTMENT_FACTOR = 0.05;

const ProgressBar = ({ step, totalSteps }) => (
    <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${(step / totalSteps) * 100}%` }} />
    </div>
);

export default function NewCalibrationPage() {
    const [step, setStep] = useState(0); // 0, 1 for capture, 2 for verification
    const [calibrationData, setCalibrationData] = useState([]);
    const [adjustableCalibration, setAdjustableCalibration] = useState(null);
    const [currentDepth, setCurrentDepth] = useState(null);
    const [countdown, setCountdown] = useState(0);
    const countdownTimer = useRef(null);

    const { setCalibration } = useContext(SettingsContext);
    const { videoRef, ready: cameraReady } = useCamera();
    const { predictDepth, loading: depthLoading, error: depthError, depthMap } = useDepthModel();
    
    const canvasRef = useRef(null);

    const speak = useCallback((text) => {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
    }, []);

    // Effect for processing the depth map
    useEffect(() => {
        if (!depthMap) return;
        const { data: rawDepthData, width, height } = depthMap;
        if (!rawDepthData || !width || !height) return;

        let depth2D = null;
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
    }, [depthMap]);

    // Effect for running predictions
    useEffect(() => {
        if (!cameraReady || !videoRef.current || depthLoading) return;
        const video = videoRef.current;
        const predict = () => predictDepth(video);
        const interval = setInterval(predict, 200);
        return () => clearInterval(interval);
    }, [cameraReady, videoRef, predictDepth, depthLoading]);

    const handleCapture = useCallback(() => {
        if (currentDepth > 0) {
            const newPoint = [1 / currentDepth, DISTANCES[step]];
            const updatedData = [...calibrationData, newPoint];
            setCalibrationData(updatedData);
            speak(`Captured at ${DISTANCES[step]} meter.`);
            
            if (step < DISTANCES.length - 1) {
                setStep(prev => prev + 1);
            } else {
                const initialCalibration = linearRegression(updatedData);
                setAdjustableCalibration(initialCalibration);
                setStep(prev => prev + 1);
                speak("Verification step. Adjust if needed.");
            }
        } else {
            speak("Could not capture. Please try again.");
        }
    }, [currentDepth, calibrationData, step]);

    useEffect(() => {
        if (countdown === 0 && countdownTimer.current) {
            clearInterval(countdownTimer.current);
            countdownTimer.current = null;
            handleCapture();
        } else if (countdown > 0) {
            speak(countdown.toString());
        }
    }, [countdown, handleCapture]);

    const startCaptureCountdown = () => {
        setCountdown(3);
        countdownTimer.current = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);
    };

    const handleAdjustment = (direction) => {
        if (!adjustableCalibration) return;
        const adjustment = direction === 'nearer' ? -ADJUSTMENT_FACTOR : ADJUSTMENT_FACTOR;
        setAdjustableCalibration(cal => ({ ...cal, c: cal.c + adjustment }));
    };

    const finishCalibration = () => {
        if (adjustableCalibration) {
            setCalibration(adjustableCalibration);
            localStorage.setItem("bw-calibration", JSON.stringify(adjustableCalibration));
            speak("Calibration complete. Your device is now calibrated.");
            window.location.href = "/";
        }
    };

    const totalSteps = DISTANCES.length + 1;

    const renderContent = () => {
        if (step >= DISTANCES.length) {
            return (
                <>
                    <div className={styles.cardContent}>
                        <div className={styles.stepIndicator}>Step {step + 1} of {totalSteps}</div>
                        <h2>Verify & Adjust</h2>
                        <p>Check the estimated distance and adjust until it feels accurate.</p>
                        <div className={styles.distanceDisplay}>
                            {currentDepth && adjustableCalibration ? getDistance(currentDepth, adjustableCalibration).toFixed(2) : "0.00"}m
                        </div>
                        <div className={styles.buttonGroup}>
                            <button onClick={() => handleAdjustment('nearer')} className={styles.secondaryBtn}><Minus size={20} /> Too Near</button>
                            <button onClick={() => handleAdjustment('farther')} className={styles.secondaryBtn}><Plus size={20} /> Too Far</button>
                        </div>
                        {adjustableCalibration && (
                            <div className={styles.correctionFactor}>
                                <p>Correction: { (adjustableCalibration.c * 100).toFixed(1) } cm</p>
                            </div>
                        )}
                    </div>
                    <div className={styles.cardFooter}>
                        <button onClick={finishCalibration} className={styles.successBtn}><Check size={20} /> Finish & Save</button>
                    </div>
                </>
            );
        }

        return (
            <>
                <div className={styles.stepIndicator}>Step {step + 1} of {totalSteps}</div>
                <h2>Calibrate at {DISTANCES[step]}m</h2>
                <p>Point the center of the camera at an object {DISTANCES[step]}m away, then press capture.</p>
                <button onClick={startCaptureCountdown} className={styles.primaryBtn} disabled={countdown > 0}>
                    {countdown > 0 ? `Capturing in ${countdown}...` : <><Camera size={20} /> Capture</>}
                </button>
            </>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainContentWrapper}>
                <div className={styles.videoStreamDiv}>
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
                </div>
                <div className={styles.contentWrapper}>
                    {(!cameraReady || depthLoading) ? (
                        <PageLoading />
                    ) : (
                        <div className={styles.calibrationCard}>
                            <ProgressBar step={step} totalSteps={totalSteps} />
                            {renderContent()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}