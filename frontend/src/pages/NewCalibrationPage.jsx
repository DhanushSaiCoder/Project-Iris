
// src/pages/NewCalibrationPage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import PageLoading from "../components/common/PageLoading";
import styles from "./NewCalibrationPage.module.css";
import { useCamera } from "../hooks/useCamera";
import { useDepthModel } from "../hooks/useDepthModel";
import { linearRegression, getDistance } from "../utils/calibration";

const DISTANCES = [1, 2, 3]; // The distances at which to calibrate

export default function NewCalibrationPage() {
    const [step, setStep] = useState(0);
    const [calibrationData, setCalibrationData] = useState([]);
    const [calibration, setCalibration] = useState(null);
    const [currentDepth, setCurrentDepth] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [countdown, setCountdown] = useState(5);

    const { videoRef, ready: cameraReady } = useCamera();
    const { predictDepth, loading: depthLoading, error: depthError, depthMap } = useDepthModel();
    const canvasRef = useRef(null);
    const samples = useRef([]);
    const isRecordingRef = useRef(false);
    const countdownIntervalRef = useRef(null);

    const speak = useCallback((text) => {
        const msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
    }, []);

    const finish = useCallback(() => {
        if (calibration) {
            localStorage.setItem("bw-calibration", JSON.stringify(calibration));
            speak("Calibration complete. Your device is now calibrated.");
            window.location.href = "/";
        } else {
            speak("Calibration incomplete. Please complete all the steps.");
        }
    }, [calibration, speak]);

    const startRecording = useCallback(() => {
        setIsRecording(true);
        isRecordingRef.current = true;
        samples.current = [];
        setCountdown(5);
        speak(`Recording for 5 seconds at ${DISTANCES[step]} meters.`);

        countdownIntervalRef.current = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        setTimeout(() => {
            clearInterval(countdownIntervalRef.current);
            setIsRecording(false);
            isRecordingRef.current = false;
            if (samples.current.length > 0) {
                const avg = samples.current.reduce((a, b) => a + b, 0) / samples.current.length;
                setCalibrationData(prev => [...prev, [1 / avg, DISTANCES[step]]]);
                speak("Measurement recorded.");
                if (step < DISTANCES.length - 1) {
                    setStep(prev => prev + 1);
                } else {
                    // Last step, perform calibration
                    const cal = linearRegression([...calibrationData, [1 / avg, DISTANCES[step]]]);
                    setCalibration(cal);
                    setStep(prev => prev + 1);
                }
            } else {
                speak("Could not record a measurement. Please ensure your hand is visible and try again.");
            }
        }, 5000);
    }, [step, calibrationData, speak]);

        useEffect(() => {
        if (!depthMap) {
            return;
        }

        const { data: rawDepthData, width, height } = depthMap;
        if (!rawDepthData || !width || !height) {
            return;
        }

        // Normalize the incoming data into a 2D JS array depth2D[y][x]
        let depth2D = null;

        // Case 1: already array-ish
        if (Array.isArray(rawDepthData)) {
            // rawDepthData could be [H][W] or [1][H][W] or even [[[...]]] — handle common shapes
            if (Array.isArray(rawDepthData[0])) {
                // If first element is an array of numbers => probably [H][W]
                if (typeof rawDepthData[0][0] === "number") {
                    depth2D = rawDepthData;
                } else if (Array.isArray(rawDepthData[0][0])) {
                    // Could be [1][H][W] or [C][H][W], prefer the first matrix if length === 1
                    if (rawDepthData.length === 1 && Array.isArray(rawDepthData[0][0])) {
                        depth2D = rawDepthData[0];
                    } else {
                        // fallback: try to pick the first matrix that looks like H x W
                        depth2D = rawDepthData.find(mat => Array.isArray(mat) && typeof mat[0]?.[0] === "number") || rawDepthData[0];
                    }
                } else {
                    return;
                }
            } else {
                // rawDepthData is a 1D JS array of numbers (rare if you used .array())
                // convert to 2D
                if (rawDepthData.length === width * height) {
                    depth2D = [];
                    for (let y = 0; y < height; y++) {
                        const row = rawDepthData.slice(y * width, (y + 1) * width);
                        depth2D.push(row);
                    }
                } else {
                    return;
                }
            }
        } else if (rawDepthData instanceof Float32Array || rawDepthData instanceof Uint8Array || ArrayBuffer.isView(rawDepthData)) {
            // typed flat array
            if (rawDepthData.length === width * height) {
                depth2D = [];
                for (let y = 0; y < height; y++) {
                    const row = new Array(width);
                    for (let x = 0; x < width; x++) row[x] = rawDepthData[y * width + x];
                    depth2D.push(row);
                }
            } else {
                return;
            }
        } else {
            return;
        }

        // Patch extraction (center patch)
        const patchSize = 50;
        const y0 = Math.max(0, Math.floor((height - patchSize) / 2));
        const x0 = Math.max(0, Math.floor((width - patchSize) / 2));

        let sum = 0;
        let count = 0;
        for (let y = y0; y < Math.min(height, y0 + patchSize); y++) {
            for (let x = 0; x < Math.min(width, x0 + patchSize); x++) {
                const v = depth2D[y] && depth2D[y][x];
                if (v !== undefined && v !== null && Number.isFinite(v)) {
                    // filter out zeros only if you want to treat zero as 'no reading'
                    sum += v;
                    count++;
                }
            }
        }

        const avg = count > 0 ? sum / count : 0;
        setCurrentDepth(avg);

        if (isRecordingRef.current) {
            // Push only valid finite values. Optionally ignore zero readings if those are invalid in your model.
            if (count > 0 && Number.isFinite(avg) && !Number.isNaN(avg)) {
                samples.current.push(avg);
            }
        }
    }, [depthMap]);

    useEffect(() => {
        if (!cameraReady || !videoRef.current || depthLoading) return;

        const video = videoRef.current;
        const predict = () => predictDepth(video);

        const interval = setInterval(predict, 200);

        return () => clearInterval(interval);
    }, [cameraReady, videoRef, predictDepth, depthLoading]);

    const renderContent = () => {
        if (step < DISTANCES.length) {
            return (
                <div>
                    <h2>Step {step + 1}: Calibrate at {DISTANCES[step]}m</h2>
                    <p>Hold an object at {DISTANCES[step]} meter(s) from the camera.</p>
                    <button onClick={startRecording} disabled={isRecording || depthLoading}>
                        {isRecording ? `Recording... ${countdown}s` : "Start Recording"}
                    </button>
                    {currentDepth && <p>Current Depth: {currentDepth.toFixed(4)}</p>}
                </div>
            );
        } else if (calibration) {
            return (
                <div>
                    <h2>Verification</h2>
                    <p>Move an object around and see the estimated distance.</p>
                    {currentDepth && <p>Estimated Distance: {getDistance(currentDepth, calibration).toFixed(2)}m</p>}
                    <button onClick={finish}>Finish</button>
                </div>
            );
        } else {
            return <PageLoading />;
        }
    };

    return (
        <div className={styles.container}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={styles.videoFeed}
            />
            <canvas ref={canvasRef} className={styles.depthOverlay} />
            {(!cameraReady || depthLoading) && <PageLoading />}
            <div className={styles.contentWrapper}>
                {renderContent()}
            </div>
        </div>
    );
}
