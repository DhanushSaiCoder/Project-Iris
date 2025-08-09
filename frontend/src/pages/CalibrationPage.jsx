// src/pages/CalibrationPage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import PageLoading from "../components/common/PageLoading";
import styles from "./CalibrationPage.module.css";
import { SkipForward } from "lucide-react";
import { useCamera } from "../hooks/useCamera";
import { useDepthModel } from "../hooks/useDepthModel";
import { triggerHapticFeedback } from "../utils/haptics";
import AlertDistanceSlider from "../components/SettingsPage/AlertDistanceSlider/AlertDistanceSlider";
import LoadingSpinner from "../components/common/LoadingSpinner";
const STEPS = [
    {
        title: "Get Ready: Position Your Device",
        instruction: "For accurate measurements, place your device in your pocket or armband with the camera facing forward. This ensures a clear view of your surroundings.",
        primaryLabel: "Continue",
    },
    {
        title: "Set Your Alert Distance: Record a Reference",
        instruction: "Hold your hand or an object at the exact distance where you want to receive alerts. Keep your hand steady and ensure it's well-lit. The system will record this as your personal safety zone. You'll see a countdown and a visual representation of the depth as you record.",
        primaryLabel: "Start Recording",
    },
    {
        title: "Test & Refine: Verify Your Safety Zone",
        instruction: "Now, test your alert distance! Move your hand or an object closer and further away. The device should provide haptic feedback (vibration) when you cross your set safety zone. Use the slider to fine-tune the sensitivity if needed.",
        primaryLabel: "Done",
    },
];

const onFinish = () => {
    window.location.href = "/";
};

const onSkip = () => {
    onFinish();
};

export default function CalibrationPage() {
    const [step, setStep] = useState(0);
    const [refScore, setRefScore] = useState(null);
    const [sensitivity, setSensitivity] = useState(1.0);
    const [isRecording, setIsRecording] = useState(false);
    const [currentDepth, setCurrentDepth] = useState(null);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [countdown, setCountdown] = useState(10);

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
        if (refScore) {
            localStorage.setItem("bw-threshold", refScore * sensitivity);
            speak("Calibration complete. Your safety zone is set.");
            onFinish();
        } else {
            speak("Calibration incomplete. Please record a reference distance first.");
        }
    }, [refScore, sensitivity, speak]);

    const next = useCallback(() => {
        if (step < 2) {
            setStep(step + 1);
        } else {
            finish();
        }
    }, [step, finish]);

    const startRecording = useCallback(() => {
        setIsRecording(true);
        isRecordingRef.current = true;
        samples.current = [];
        setCountdown(10);
        speak("Recording your reference distance for 10 seconds.");

        countdownIntervalRef.current = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        setTimeout(() => {
            clearInterval(countdownIntervalRef.current);
            setIsRecording(false);
            isRecordingRef.current = false;
            if (samples.current.length > 0) {
                const avg = samples.current.reduce((a, b) => a + b, 0) / samples.current.length;
                setRefScore(avg);
                speak("Reference distance recorded. Moving to verification.");
                next();
            } else {
                speak("Could not record a reference distance. Please ensure your hand is visible and try again.");
            }
        }, 10000);
    }, [next, speak]);

    useEffect(() => {
        if (!cameraReady) return;
        const { title, instruction } = STEPS[step];
        speak(`Step ${step + 1} of 3: ${title}. ${instruction}`);
    }, [step, cameraReady, speak]);

    useEffect(() => {
        if (!depthMap) {
            return;
        }

        const { data: rawDepthData, width, height } = depthMap;
        if (!rawDepthData || !width || !height) {
            return;
        }

        const actualDepthData = rawDepthData[0]; // Access the actual 2D array
        if (!actualDepthData) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Find min and max depth values for normalization for display
        let minDisplayDepth = Infinity;
        let maxDisplayDepth = -Infinity;
        for (let i = 0; i < height; i++) {
            if (!actualDepthData[i]) continue;
            for (let j = 0; j < width; j++) {
                const depthValue = actualDepthData[i][j];
                if (depthValue !== undefined) {
                    minDisplayDepth = Math.min(minDisplayDepth, depthValue);
                    maxDisplayDepth = Math.max(maxDisplayDepth, depthValue);
                }
            }
        }
        const displayDepthRange = maxDisplayDepth - minDisplayDepth;

        // Draw the depth map
        for (let y = 0; y < height; y++) {
            if (!actualDepthData[y]) continue;
            for (let x = 0; x < width; x++) {
                const depthValue = actualDepthData[y][x];
                const normalizedForDisplay = displayDepthRange > 0 ? (depthValue - minDisplayDepth) / displayDepthRange : 0;
                const color = `hsl(240, 100%, ${normalizedForDisplay * 100}%)`; // Blue color scheme
                ctx.fillStyle = color;
                ctx.fillRect(x, y, 1, 1);
            }
        }

        // Draw a circle indicating the current depth
        if (currentDepth !== null) {
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = 10;
            // Normalize currentDepth for display color
            const normalizedCurrentDepth = displayDepthRange > 0 ? (currentDepth - minDisplayDepth) / displayDepthRange : 0;
            const hue = normalizedCurrentDepth * 100; // Adjust as needed for color range
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'white';
            ctx.stroke();
        }

        // Draw a crosshair in the center during step 1
        if (step === 1) {
            const centerX = width / 2;
            const centerY = height / 2;
            const crosshairSize = 20;
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.moveTo(centerX - crosshairSize, centerY);
            ctx.lineTo(centerX + crosshairSize, centerY);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(centerX, centerY - crosshairSize);
            ctx.lineTo(centerX, centerY + crosshairSize);
            ctx.stroke();
        }

        const patchSize = 50;
        const y0 = Math.floor((height - patchSize) / 2);
        const x0 = Math.floor((width - patchSize) / 2);

        let sum = 0;
        let count = 0;
        for (let y = y0; y < y0 + patchSize; y++) {
            if (!actualDepthData[y]) continue;
            for (let x = x0; x < x0 + patchSize; x++) {
                if (actualDepthData[y] && actualDepthData[y][x] !== undefined) {
                    sum += actualDepthData[y][x];
                    count++;
                }
            }
        }
        const avg = count > 0 ? sum / count : 0;
        setCurrentDepth(avg);

        if (isRecordingRef.current) {
            samples.current.push(avg);
        }

        if (step === 2 && refScore && avg < refScore * sensitivity) {
            triggerHapticFeedback("warning");
        }

    }, [depthMap, step, refScore, sensitivity]);

    useEffect(() => {
        if (!isVideoReady || !videoRef.current || depthLoading) return;
        
        const video = videoRef.current;
        const predict = () => predictDepth(video);

        const interval = setInterval(predict, 200);

        return () => clearInterval(interval);
    }, [isVideoReady, videoRef, predictDepth, depthLoading]);

    const renderStepContent = () => {
        const { title, instruction, primaryLabel } = STEPS[step];
        return (
            <div className={styles.contentWrapper}>
                <div className={styles.skipButton} onClick={onSkip}>
                    SKIP <SkipForward size={16} />
                </div>
                <div className={styles.stepIndicator}>STEP {step + 1}/3</div>
                <h3 className={styles.subTitle}>{title}</h3>
                <p className={styles.instruction}>{instruction}</p>

                {step === 0 && <button className={`${styles.button} ${styles.primary}`} onClick={next}>{primaryLabel}</button>}

                {step === 1 && (
                    <>
                        <button className={`${styles.button} ${styles.primary}`} onClick={startRecording} disabled={isRecording || !isVideoReady || depthLoading}>
                            {isRecording ? (<><LoadingSpinner /> Recording: {countdown}s</>) : primaryLabel}
                        </button>
                        {depthError && (
                            <div className={styles.errorMessage}>
                                <p>Error: {depthError.message}</p>
                                <p>Please ensure your camera is working and try again. If the problem persists, try refreshing the page.</p>
                            </div>
                        )}
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className={styles.verification}>
                            <p>Current Depth: {currentDepth ? currentDepth.toFixed(4) : "N/A"}</p>
                            <p>Reference Depth: {refScore ? refScore.toFixed(4) : "N/A"}</p>
                            <p>Sensitivity: {sensitivity.toFixed(2)}</p>
                        </div>
                        <AlertDistanceSlider min={0.5} max={1.5} step={0.05} value={sensitivity} onChange={(e) => setSensitivity(Number(e.target.value))} />
                        <button className={`${styles.button} ${styles.done}`} onClick={finish}>{primaryLabel}</button>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.videoHalf}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={styles.videoFeed}
                    onLoadedMetadata={() => setIsVideoReady(true)}
                    style={{
                        visibility: step === 1 || step === 2 ? 'visible' : 'hidden',
                    }}
                />
                <canvas
                    ref={canvasRef}
                    className={styles.depthOverlay}
                    width={depthMap ? depthMap.width : 0}
                    height={depthMap ? depthMap.height : 0}
                    style={{
                        visibility: step === 1 || step === 2 ? 'visible' : 'hidden',
                    }}
                />
            </div>

            {(!cameraReady || depthLoading) && <PageLoading />}

            {renderStepContent()}
        </div>
    );
}
