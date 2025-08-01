// src/components/SessionSummary/SessionAnalytics.jsx
import React from "react";
import styles from "./SessionAnalytics.module.css";

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

const SessionAnalytics = ({ detectedObjects }) => {
    const totalDetections = detectedObjects.length;
    const uniqueClasses = [...new Set(detectedObjects.map((obj) => obj.class))];
    const uniqueDetectionsCount = uniqueClasses.length;

    const classCounts = detectedObjects.reduce((acc, obj) => {
        acc[obj.class] = (acc[obj.class] || 0) + 1;
        return acc;
    }, {});

    const sortedClasses = Object.entries(classCounts).sort(
        (a, b) => b[1] - a[1]
    );

    return (
        <div className={styles.analyticsContainer}>
            <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                    <span className={styles.metricValue}>{totalDetections}</span>
                    <span className={styles.metricLabel}>Total Detections</span>
                </div>
                <div className={styles.metricItem}>
                    <span className={styles.metricValue}>{uniqueDetectionsCount}</span>
                    <span className={styles.metricLabel}>Unique Objects</span>
                </div>
            </div>

            <h3 className={styles.chartTitle}>Detection Breakdown</h3>
            <div className={styles.detectionList}>
                {sortedClasses.map(([className, count], index) => {
                    const percentage = totalDetections > 0 ? (count / totalDetections) * 100 : 0;
                    const gradient = GRADIENT_PAIRS[index % GRADIENT_PAIRS.length];
                    const isLabelInside = percentage >= 15;

                    return (
                        <div key={className} className={styles.detectionItem}>
                            <div className={styles.itemInfo}>
                                <span className={styles.itemName}>{className}</span>
                                <span className={styles.itemCount}>{count} detections</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressBarFill}
                                    style={{ 
                                        width: `${percentage}%`, 
                                        background: `linear-gradient(to right, ${gradient[0]}, ${gradient[1]})` 
                                    }}
                                >
                                    {isLabelInside && (
                                        <span className={`${styles.percentageLabel} ${styles.inside}`}>
                                            {percentage.toFixed(1)}%
                                        </span>
                                    )}
                                </div>
                                {!isLabelInside && (
                                    <span 
                                        className={`${styles.percentageLabel} ${styles.outside}`}
                                        style={{ left: `calc(${percentage}% + 8px)` }}
                                    >
                                        {percentage.toFixed(1)}%
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SessionAnalytics;
