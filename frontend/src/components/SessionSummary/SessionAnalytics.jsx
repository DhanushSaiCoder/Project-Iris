// src/components/SessionSummary/SessionAnalytics.jsx
import React from "react";
import styles from "./SessionAnalytics.module.css";

const SessionAnalytics = ({ detectedObjects, colorMap, duration }) => {
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

    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}m ${seconds}s`;
    };

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
                <div className={styles.metricItem}>
                    <span className={styles.metricValue}>{formatDuration(duration)}</span>
                    <span className={styles.metricLabel}>Duration</span>
                </div>
            </div>

            <h3 className={styles.chartTitle}>Detection Breakdown</h3>
            <div className={styles.detectionList}>
                {sortedClasses.map(([className, count]) => {
                    const percentage = totalDetections > 0 ? (count / totalDetections) * 100 : 0;
                    const gradient = colorMap[className];
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
