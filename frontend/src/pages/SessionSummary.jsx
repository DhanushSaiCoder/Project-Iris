import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SessionSummary.module.css";
import { SettingsContext } from "../context/SettingsContext";

export default function SessionSummary({
    alertsCount = 0,
    duration = "0:00:00",
    avgDistance = "0m",
    detectedObjects = [],
}) {
    const navigate = useNavigate();
    const { sessionId } = useContext(SettingsContext);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>SESSION SUMMARY</h1>
            <p className={styles.sessionId}>Session ID: {sessionId}</p>

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

            <div className={styles.detected}>
                <div className={styles.detectedTitle}>DETECTED OBJECTS</div>
                <ol className={styles.detectedList}>
                    {detectedObjects.map((obj, i) => (
                        <li key={i}>
                            <span className={styles.objectName}>{obj.name}</span> —{" "}
                            <span className={styles.objectDist}>
                                {obj.distance}
                            </span>
                        </li>
                    ))}
                </ol>
            </div>

            <button
                className={`${styles.button} ${styles.primary}`}
                onClick={() => navigate("/")}
            >
                New Session
            </button>
            <button
                className={`${styles.button} ${styles.secondary}`}
                onClick={() => navigate("/")}
            >
                Return Home
            </button>
        </div>
    );
}
