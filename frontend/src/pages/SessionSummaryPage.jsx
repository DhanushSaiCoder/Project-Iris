// src/pages/SessionSummaryPage.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import SessionAnalytics from "../components/SessionSummary/SessionAnalytics";
import NoDataState from "../components/SessionSummary/NoDataState";
import styles from "./SessionSummaryPage.module.css";
import { List, ChevronDown, ChevronUp, PlayCircle } from "lucide-react";

// Define a color palette for the bars as gradient pairs
const GRADIENT_PAIRS = [
    ["#4A90E2", "#2C5E8E"], // Blue
    ["#50E3C2", "#349A7E"], // Teal
    ["#F5A623", "#B87E1A"], // Orange
    ["#F8E71C", "#C4B516"], // Yellow
    ["#D0021B", "#8A0112"], // Red
    ["#BD10E0", "#8C0DA8"], // Purple
    ["#9013FE", "#6C0FB8"], // Violet
    ["#4A4A4A", "#2F2F2F"], // Gray
    ["#B8E986", "#8CB866"], // Light Green
    ["#7ED321", "#5E9C19"]  // Green
];

const SessionSummaryPage = () => {
    const location = useLocation();
    const { detectedObjects } = location.state || { detectedObjects: [] };
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    if (!detectedObjects || detectedObjects.length === 0) {
        return <NoDataState />;
    }

    const classCounts = detectedObjects.reduce((acc, obj) => {
        acc[obj.class] = (acc[obj.class] || 0) + 1;
        return acc;
    }, {});

    const sortedClasses = Object.keys(classCounts).sort(
        (a, b) => classCounts[b] - classCounts[a]
    );

    const colorMap = sortedClasses.reduce((acc, className, index) => {
        acc[className] = GRADIENT_PAIRS[index % GRADIENT_PAIRS.length];
        return acc;
    }, {});

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Session Summary</h1>
                <p className={styles.subtitle}>
                    A detailed breakdown of the objects detected during your session.
                </p>
            </header>

            <SessionAnalytics detectedObjects={detectedObjects} colorMap={colorMap} />

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
                                <span 
                                    className={styles.objectScore}
                                    style={{ background: `linear-gradient(to right, ${colorMap[obj.class][0]}, ${colorMap[obj.class][1]})` }}
                                >
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