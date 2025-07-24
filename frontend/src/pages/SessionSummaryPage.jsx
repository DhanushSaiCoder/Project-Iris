// SessionSummary.jsx
import React from "react";
import styles from "./SessionSummary.module.css";
import { useNavigate } from "react-router-dom";

export default function SessionSummary({
    alertsCount = 0,
    duration = "0:00:00",
    avgDistance = "0m",
    detectedObjects = [],
}) {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>SESSION SUMMARY</h1>

            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <div className={styles.statValue}>{alertsCount}</div>
                    <div className={styles.statLabel}>Alerts count</div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statValue}>{duration}</div>
                    <div className={styles.statLabel}>Duration</div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statValue}>{avgDistance}</div>
                    <div className={styles.statLabel}>Avg Distance</div>
                </div>
            </div>

            {detectedObjects.length ? (
                <div className={styles.detected}>
                    <div className={styles.detectedTitle}>DETECTED OBJECTS</div>
                    <ol className={styles.detectedList}>
                        {detectedObjects.map((obj, i) => (
                            <li key={i}>
                                <span className={styles.objectName}>
                                    {obj.name}
                                </span>{" "}
                                —{" "}
                                <span className={styles.objectDist}>
                                    {obj.distance}
                                </span>
                            </li>
                        ))}
                    </ol>
                </div>
            ) : null}

            <button
                className={`${styles.button} ${styles.primary}`}
                onClick={() => {
                    navigate(`/newSession`)
                }}
            >
                New Session
            </button>
            <button
                className={`${styles.button} ${styles.secondary}`}
                onClick={() => {
                    navigate("/");
                }}
            >
                Return Home
            </button>
        </div>
    );
}
