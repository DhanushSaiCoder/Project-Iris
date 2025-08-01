// src/pages/SessionSummaryPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SessionAnalytics from "../components/SessionSummary/SessionAnalytics";
import styles from "./SessionSummaryPage.module.css";
import { FaChartBar, FaListUl, FaPlay } from "react-icons/fa";

const SessionSummaryPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { detectedObjects } = location.state || { detectedObjects: [] };

    // Handle cases where the user navigates here directly
    if (!detectedObjects || detectedObjects.length === 0) {
        return (
            <div className={`${styles.container} ${styles.noDataContainer}`}>
                <div className={styles.noDataContent}>
                    <h1 className={styles.title}>No Session Data</h1>
                    <p className={styles.noDataText}>
                        We couldn't find any detection data. Start a new session to begin analyzing your surroundings.
                    </p>
                    <div className={styles.actions}>
                        <button
                            className={`${styles.button} ${styles.primary}`}
                            onClick={() => navigate("/")}
                        >
                            <FaPlay />
                            Start New Session
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>SESSION SUMMARY</h1>
            </header>

            <SessionAnalytics detectedObjects={detectedObjects} />

            <div className={styles.detailsSection}>
                <h3 className={styles.detailsTitle}>
                    <FaListUl /> All Detections
                </h3>
                <div className={styles.objectList}>
                    {detectedObjects.map((obj, i) => (
                        <div key={i} className={styles.objectItem}>
                            <span className={styles.objectName}>{obj.class}</span>
                            <span className={styles.objectScore}>
                                {`${(obj.score * 100).toFixed(0)}%`}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.actions}>
                <button
                    className={`${styles.button} ${styles.primary}`}
                    onClick={() => navigate("/")}
                >
                    <FaPlay />
                    Start New Session
                </button>
            </div>
        </div>
    );
};

export default SessionSummaryPage;