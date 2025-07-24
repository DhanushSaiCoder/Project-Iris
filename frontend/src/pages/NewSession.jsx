// NewSession.jsx
import React from "react";
import styles from "./NewSession.module.css";

export default function NewSession({
    imageUrl,
    status = "Detecting Obstacles",
    onStop = () => {},
}) {
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
                <button className={styles.button} onClick={onStop}>
                    Stop Detection
                </button>
            </div>
        </div>
    );
}
