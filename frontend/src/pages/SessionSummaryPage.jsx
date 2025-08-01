// src/pages/SessionSummaryPage.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import SessionAnalytics from "../components/SessionSummary/SessionAnalytics";
import NoDataState from "../components/SessionSummary/NoDataState";
import styles from "./SessionSummaryPage.module.css";
import { List, ChevronDown, ChevronUp, PlayCircle } from "lucide-react";

const SessionSummaryPage = () => {
    const location = useLocation();
    const { detectedObjects } = location.state || { detectedObjects: [] };
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    if (!detectedObjects || detectedObjects.length === 0) {
        return <NoDataState />;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Session Summary</h1>
                <p className={styles.subtitle}>
                    A detailed breakdown of the objects detected during your session.
                </p>
            </header>

            <SessionAnalytics detectedObjects={detectedObjects} />

            <div className={styles.detailsSection}>
                <button 
                    className={`${styles.detailsTitle} ${!isDetailsOpen ? styles.collapsed : ''}`}
                    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    aria-expanded={isDetailsOpen}
                    aria-controls="detection-list"
                >
                    <div className={styles.detailsTitleContent}>
                        <List /> 
                        <span>All Detections</span>
                    </div>
                    {isDetailsOpen ? <ChevronUp /> : <ChevronDown />}
                </button>
                <div 
                    id="detection-list"
                    className={`${styles.objectListContainer} ${isDetailsOpen ? styles.open : ''}`}
                >
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
            </div>

            <div className={styles.actions}>
                <button
                    className={`${styles.button} ${styles.primary}`}
                    onClick={() => window.location.href = "/"}
                >
                    <PlayCircle />
                    Start New Session
                </button>
            </div>
        </div>
    );
};

export default SessionSummaryPage;