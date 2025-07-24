// NewSession.jsx
import React from "react";
import styles from "./NewSession.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function NewSession({
    imageUrl,
    status = "Detecting Obstacles",
}) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("sessionId");

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.cameraStreamDiv}>
                    <img
                        src={imageUrl}
                        alt="Session livestream"
                        className={styles.image}
                    />
                </div>
                <p className={styles.status}>
                    <span className={styles.statusLabel}>Status:</span> {status}
                </p>
                <button
                    className={styles.button}
                    onClick={() => {
                        navigate(`/sessionSummary?sessionId=${sessionId}`, {
                            replace: true,
                        });
                    }}
                >
                    Stop Detection
                </button>
            </div>
        </div>
    );
}
