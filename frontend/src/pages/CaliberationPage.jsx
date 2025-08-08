// src/pages/CalibrationPage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./CaliberationPage.module.css";
import { SkipForward } from "lucide-react";
import { useCamera } from "../hooks/useCamera";
import { useDepthModel } from "../hooks/useDepthModel";
import { triggerHapticFeedback } from "../utils/haptics";
import AlertDistanceSlider from "../components/SettingsPage/AlertDistanceSlider/AlertDistanceSlider";
import LoadingSpinner from "../components/common/LoadingSpinner";
const STEPS = [
    {
        title: "Position Alignment",
        instruction: "Hold your phone in your pocket or armband, camera forward.",
        primaryLabel: "Continue",
    },
    {
        title: "Reference Distance Recording",
        instruction: "Hold your hand at the distance you want to be alerted.",
        primaryLabel: "Start Recording",
    },
    {
        title: "Verification & Tuning",
        instruction: "As you move your hand, the alert should fire at your set distance. Fine-tune with the slider.",
        primaryLabel: "Done",
    },
];

const onFinish = () => {
    window.location.href = "/";
};

const onSkip = () => {
    onFinish();
};

export default function CaliberationPage() {
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
            speak("Calibration complete.");
            onFinish();
        } else {
            speak("Calibration incomplete. Please record a distance first.");
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
        speak("Recording for 10 seconds.");

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
                speak("Reference distance recorded.");
                next();
            } else {
                speak("Could not record a reference distance. Please try again.");
            }
        }, 10000);
    }, [next, speak]);

    useEffect(() => {
        if (!cameraReady) return;
        const { title, instruction } = STEPS[step];
        speak(`Step ${step + 1} of 3: ${title}. ${instruction}`);
    }, [step, cameraReady, speak]);

    useEffect(() => {
        if (!depthMap) return;

        const { data, width, height } = depthMap;
        if (!data || !width || !height) return;

        const patchSize = 50;
        const y0 = Math.floor((height - patchSize) / 2);
        const x0 = Math.floor((width - patchSize) / 2);

        let sum = 0;
        for (let y = y0; y < y0 + patchSize; y++) {
            for (let x = x0; x < x0 + patchSize; x++) {
                if (data[y] && data[y][x]) {
                    sum += data[y][x];
                }
            }
        }
        const avg = sum / (patchSize * patchSize);
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
            <>
                <div className={styles.skipButton} onClick={onSkip}>
                    SKIP <SkipForward size={16} />
                </div>
                <div className={styles.stepIndicator}>STEP {step + 1}/3</div>
                <h2 className={styles.stepTitle}>DEVICE CALIBRATION</h2>
                <h3 className={styles.subTitle}>{title}</h3>
                <p className={styles.instruction}>{instruction}</p>

                {step === 0 && <button className={`${styles.button} ${styles.primary}`} onClick={next}>{primaryLabel}</button>}

                {step === 1 && (
                    <>
                        <button className={`${styles.button} ${styles.primary}`} onClick={startRecording} disabled={isRecording || !isVideoReady || depthLoading}>
                            {isRecording ? <LoadingSpinner /> : primaryLabel}
                        </button>
                        {depthError && <p style={{ color: "red" }}>{depthError.message}</p>}
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
            </>
        );
    };

    return (
        <div className={styles.container}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={styles.videoFeed}
                onLoadedMetadata={() => setIsVideoReady(true)}
                style={{
                    visibility: step === 1 ? 'visible' : 'hidden',
                }}
            />
            <canvas
                ref={canvasRef}
                className={styles.depthOverlay}
                style={{
                    visibility: step === 1 ? 'visible' : 'hidden',
                }}
            />

            {!cameraReady ? (
                <div className={styles.loadingContainer}><p>Starting camera…</p></div>
            ) : depthLoading ? (
                <div className={styles.depthLoader}><p>Loading depth model…</p></div>
            ) : (
                renderStepContent()
            )}
        </div>
    );
}
