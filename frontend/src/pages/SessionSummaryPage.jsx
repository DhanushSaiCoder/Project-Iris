import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SessionSummary.module.css";
import { SettingsContext } from "../context/SettingsContext";

export default function SessionSummary() {
    const navigate = useNavigate();
    const { sessionId } = useContext(SettingsContext);
    const [detectedObjects, setDetectedObjects] = useState([]);

    useEffect(() => {
        const storedObjects = JSON.parse(localStorage.getItem("sessionObjects")) || [];
        console.log("Loaded objects:", storedObjects);
        setDetectedObjects(storedObjects);
    }, []);

    const alertsCount = detectedObjects.length;

    // Convert "3:55:42 pm" into full Date object using today's date
    const parseTimeToDate = (timeStr) => {
        const today = new Date();
        const dateString = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()} ${timeStr}`;
        const parsedDate = new Date(dateString);
        return parsedDate;
    };

    // Filter and parse timestamps
    const timestamps = detectedObjects
        .map((obj) => parseTimeToDate(obj.timestamp))
        .filter((date) => !isNaN(date)); // Only valid dates

    let durationMs = 0;
    if (timestamps.length >= 2) {
        const startTime = timestamps[0].getTime();
        const endTime = timestamps[timestamps.length - 1].getTime();
        durationMs = endTime > startTime ? endTime - startTime : 0;
    }

    const formatDuration = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours > 0 ? hours + "h " : ""}${minutes > 0 ? minutes + "m " : ""}${seconds}s`;
    };

    const sessionDuration = formatDuration(durationMs);

    // Get unique objects based on class
    const uniqueObjectsMap = new Map();
    detectedObjects.forEach((obj) => {
        uniqueObjectsMap.set(obj.class, obj);
    });
    const uniqueDetectedObjects = Array.from(uniqueObjectsMap.values());

    const avgDistance = "0m"; // Placeholder

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
                                <span className={styles.objectName}>{obj.class}</span>{" "}
                                —{" "}
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
