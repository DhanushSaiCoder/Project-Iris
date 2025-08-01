// src/components/SessionSummary/SessionAnalytics.jsx
import React from "react";
import styles from "./SessionAnalytics.module.css";

// Define a color palette for the bars
const COLORS = [
    "#4A90E2", "#50E3C2", "#F5A623", "#F8E71C", "#D0021B",
    "#BD10E0", "#9013FE", "#4A4A4A", "#B8E986", "#7ED321"
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
                    const barColor = COLORS[index % COLORS.length];

                    return (
                        <div key={className} className={styles.detectionItem}>
                            <div className={styles.itemInfo}>
                                <span className={styles.itemName}>{className}</span>
                                <span className={styles.itemCount}>{count} detections</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressBarFill}
                                    style={{ width: `${percentage}%`, backgroundColor: barColor }}
                                >
                                    <span className={styles.percentageLabel}>
                                        {percentage.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SessionAnalytics;
