import React, { useState, useEffect } from "react";
import styles from "./CaliberationPage.module.css";
import { SkipForward } from "lucide-react";
// replace with your actual logo import (svg/png)

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

    // announce each step
    useEffect(() => {
        const msg = new SpeechSynthesisUtterance(
            `Step ${step + 1} of 3: ${STEPS[step].title}. ${
                STEPS[step].instruction
            }`
        );
        window.speechSynthesis.speak(msg);
    }, [step]);

    const next = () => {
        if (step < 2) setStep(step + 1);
        else onFinish();
    };

    const recordDistance = () => {
        // your depth‑sampling logic here...
        setRefScore(1.234);
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
            {/* header with logo, title and skip */}

            {/* main content */}
            <div className={styles.content}>
                <div className={styles.contentHeader}>
                    <div className={styles.stepIndicator}>
                        STEP {step + 1}/3
                    </div>
                    <div className={styles.skipButton} onClick={() => { onSkip() }}>
                        
                        Skip{" "}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-skip-forward-icon lucide-skip-forward"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#ebf4ff80"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-skip-forward-icon lucide-skip-forward"
                            >
                                <polygon points="5 4 15 12 5 20 5 4" />
                                <line x1="19" x2="19" y1="5" y2="19" />
                            </svg>
                        </svg>
                    </div>
                </div>
                <h2 className={styles.stepTitle}>DEVICE CALIBRATION</h2>
                <h3 className={styles.subTitle}>{title}</h3>
                <p className={styles.instruction}>{instruction}</p>

                {/* steps 1 & 2 */}
                {step < 2 && (
                    <button
                        className={`${styles.button} ${styles.primary}`}
                        onClick={step === 1 ? recordDistance : next}
                    >
                        {primaryLabel}
                    </button>
                )}

                {/* step 3 */}
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
            </div>
        </div>
    );
}
