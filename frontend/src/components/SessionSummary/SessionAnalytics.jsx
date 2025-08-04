import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./SessionAnalytics.module.css";

const SessionAnalytics = ({ detectedObjects, colorMap, duration }) => {
    const [isPosted, setIsPosted] = useState(false);
    const userId = "user123"; // Replace with dynamic user ID if available

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

    useEffect(() => {
        if (!isPosted && detectedObjects.length > 0) {
            const payload = {
                userId,
                duration,
                uniqueObjects: uniqueDetectionsCount,
                totalDetections,
                allDetections: detectedObjects,
            };

            axios
                .post("http://localhost:5555/session", payload)
                .then((response) => {
                    console.log("Session posted successfully:", response.data);
                    setIsPosted(true);
                })
                .catch((error) => {
                    console.error("Error posting session:", error.message);
                });
        }
    }, [detectedObjects, duration, uniqueDetectionsCount, totalDetections, isPosted]);

    return (
        <div className={styles.analyticsContainer}>
            <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                    <span className={styles.metricValue}>
                        {totalDetections}
                    </span>
                    <span className={styles.metricLabel}>Total Detections</span>
                </div>
                <div className={styles.metricItem}>
                    <span className={styles.metricValue}>
                        {uniqueDetectionsCount}
                    </span>
                    <span className={styles.metricLabel}>Unique Objects</span>
                </div>
                <div className={`${styles.metricItem} ${styles.fullWidth}`}>
                    <span className={styles.metricValue}>
                        {formatDuration(duration)}
                    </span>
                    <span className={styles.metricLabel}>Duration</span>
                </div>
            </div>

            <h3 className={styles.chartTitle}>Detection Breakdown</h3>
            <div className={styles.detectionList}>
                {sortedClasses.map(([className, count]) => {
                    const percentage =
                        totalDetections > 0
                            ? (count / totalDetections) * 100
                            : 0;
                    const gradient = colorMap[className];
                    const isLabelInside = percentage >= 15;

                    return (
                        <div key={className} className={styles.detectionItem}>
                            <div className={styles.itemInfo}>
                                <span className={styles.itemName}>
                                    {className}
                                </span>
                                <span className={styles.itemCount}>
                                    {count} detections
                                </span>
                            </div>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressBarFill}
                                    style={{
                                        width: `${percentage}%`,
                                        background: `linear-gradient(to right, ${gradient[0]}, ${gradient[1]})`,
                                    }}
                                >
                                    {isLabelInside && (
                                        <span
                                            className={`${styles.percentageLabel} ${styles.inside}`}
                                        >
                                            {percentage.toFixed(1)}%
                                        </span>
                                    )}
                                </div>
                                {!isLabelInside && (
                                    <span
                                        className={`${styles.percentageLabel} ${styles.outside}`}
                                        style={{
                                            left: `calc(${percentage}% + 8px)`,
                                        }}
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
