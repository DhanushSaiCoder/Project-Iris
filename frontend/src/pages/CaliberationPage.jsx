// src/pages/CalibrationPage.jsx
import React, { useState, useEffect, useRef } from "react";
import styles from "./CaliberationPage.module.css";
import { SkipForward } from "lucide-react";
import { useCamera } from "../hooks/useCamera"; // <-- import your hook

const STEPS = [
    {
        title: "Position Alignment",
        instruction:
            "Hold your phone in your pocket or armband, camera forward.",
        primaryLabel: "Continue",
    },
    {
        title: "Reference Distance Recording",
        instruction: "Hold your hand at the distance you want to be alerted.",
        primaryLabel: "Record Distance",
    },
    {
        title: "Verification",
        instruction:
            "As you walk to your hand, alert should fire at your set distance.",
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

    // 1) Hook up camera
    const { videoRef, ready: cameraReady } = useCamera();
    const canvasRef = useRef(null);

    // Announce each step
    useEffect(() => {
        if (!cameraReady) return;
        const msg = new SpeechSynthesisUtterance(
            `Step ${step + 1} of 3: ${STEPS[step].title}. ${
                STEPS[step].instruction
            }`
        );
        window.speechSynthesis.speak(msg);
    }, [step, cameraReady]);

    // Navigation functions
    const next = () => (step < 2 ? setStep(step + 1) : onFinish());
    const recordDistance = async () => {
        // draw frame to canvas
        const ctx = canvasRef.current.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0, 320, 240);

        // TODO: replace with depth-sampling logic
        const dummyScore = 1.234;
        setRefScore(dummyScore);
        next();
    };
    const handleTune = (factor) => {
        setSensitivity((s) => +(s * factor).toFixed(2));
        const tuneMsg = new SpeechSynthesisUtterance(
            factor > 1 ? "Less sensitive" : "More sensitive"
        );
        window.speechSynthesis.speak(tuneMsg);
    };
    const finish = () => {
        localStorage.setItem("bw-threshold", refScore * sensitivity);
        window.speechSynthesis.speak(
            new SpeechSynthesisUtterance("Calibration complete.")
        );
        onFinish();
    };

    const { title, instruction, primaryLabel } = STEPS[step];

    return (
        <div className={styles.container}>
            {/* Hidden video & canvas for frame capture */}
            <video
                ref={videoRef}
                style={{ display: "none" }}
                playsInline
                muted
            />
            <canvas
                ref={canvasRef}
                width={320}
                height={240}
                style={{ display: "none" }}
            />

            {/* Show a loading state until camera is ready */}
            {!cameraReady ? (
                <div className={styles.loadingContainer}>
                    <p>Starting camera…</p>
                </div>
            ) : (
                <>
                    {/* Skip button */}
                    <div className={styles.skipButton} onClick={onSkip}>
                        SKIP <SkipForward size={16} />
                    </div>

                    {/* Step Indicator */}
                    <div className={styles.stepIndicator}>STEP {step + 1}/3</div>

                    {/* Main Title */}
                    <h2 className={styles.stepTitle}>DEVICE CALIBRATION</h2>

                    {/* Subtitle & Instruction */}
                    <h3 className={styles.subTitle}>{title}</h3>
                    <p className={styles.instruction}>{instruction}</p>

                    {/* Steps 1 & 2 */}
                    {step < 2 && (
                        <button
                            className={`${styles.button} ${styles.primary}`}
                            onClick={step === 1 ? recordDistance : next}
                        >
                            {primaryLabel}
                        </button>
                    )}

                    {/* Step 3 */}
                    {step === 2 && (
                        <>
                            <div className={styles.tuning}>
                                <button
                                    className={styles.tuningButton}
                                    onClick={() => handleTune(1.1)}
                                >
                                    Less Sensitive
                                </button>
                                <button
                                    className={styles.tuningButton}
                                    onClick={() => handleTune(0.9)}
                                >
                                    More Sensitive
                                </button>
                            </div>
                            <button
                                className={`${styles.button} ${styles.done}`}
                                onClick={finish}
                            >
                                {primaryLabel}
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
}