// src/pages/SessionSummaryPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SessionAnalytics from "../components/SessionSummary/SessionAnalytics";
import styles from "./SessionSummaryPage.module.css";

const SessionSummaryPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { detectedObjects } = location.state || { detectedObjects: [] };

    // Handle cases where the user navigates here directly
    if (!detectedObjects || detectedObjects.length === 0) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Session Summary</h1>
                <p className={styles.noData}>No detection data found for this session.</p>
                <div className={styles.actions}>
                    <button
                        className={`${styles.button} ${styles.primary}`}
                        onClick={() => navigate("/")}
                    >
                        Start New Session
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Session Summary</h1>

            <SessionAnalytics detectedObjects={detectedObjects} />

            <div className={styles.detailsSection}>
                <h3 className={styles.detailsTitle}>All Detections</h3>
                <div className={styles.objectList}>
                    {detectedObjects.map((obj, i) => (
                        <div key={i} className={styles.objectItem}>
                            <span className={styles.objectName}>{obj.class}</span>
                            <span className={styles.objectScore}>
                                {`(${(obj.score * 100).toFixed(0)}%)`}
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
                    Start New Session
                </button>
                <button
                    className={`${styles.button} ${styles.secondary}`}
                    onClick={() => navigate(-1)}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default SessionSummaryPage;