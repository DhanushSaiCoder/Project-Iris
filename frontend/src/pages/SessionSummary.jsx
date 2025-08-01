import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SessionSummary.module.css";
import { SettingsContext } from "../context/SettingsContext";

// Helper function to format duration
const formatDuration = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default function SessionSummary() {
    const navigate = useNavigate();
    const { sessionId } = useContext(SettingsContext);

    const detectedObjects = JSON.parse(localStorage.getItem("sessionObjects")) || [];

    const alertsCount = detectedObjects.length;
    console.log(detectedObjects);

    let sessionDuration = "0:00:00";
    if (detectedObjects.length > 0) {
        const firstTimestamp = new Date(detectedObjects[0].timestamp);
        const lastTimestamp = new Date(detectedObjects[detectedObjects.length - 1].timestamp);
        const durationMs = lastTimestamp - firstTimestamp;
        sessionDuration = formatDuration(durationMs);
    }

    const uniqueObjectsMap = new Map();
    detectedObjects.forEach((obj) => {
        uniqueObjectsMap.set(obj.class, obj);
    });

    const uniqueDetectedObjects = Array.from(uniqueObjectsMap.values());

    const avgDistance = "0m"; // Placeholder for average distance logic

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
                    <div className={styles.statValue}>{sessionDuration}</div>
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
                    {uniqueDetectedObjects.length === 0 ? (
                        <li>No objects were detected during this session.</li>
                    ) : (
                        uniqueDetectedObjects.map((obj, i) => (
                            <li key={i}>
                                <span className={styles.objectName}>{obj.class}</span> —{" "}
                                <span className={styles.objectDist}>
                                    {obj.score ? `(${Math.round(obj.score * 100)}%)` : "N/A"}
                                </span>
                            </li>
                        ))
                    )}
                </ol>
            </div>

            <button
                className={`${styles.button} ${styles.primary}`}
                onClick={() => {
                    navigate("/");
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
