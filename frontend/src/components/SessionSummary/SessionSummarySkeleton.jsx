import React from 'react';
import styles from './SessionSummarySkeleton.module.css';

const SessionSummarySkeleton = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={`${styles.skeletonLine} ${styles.title}`}></div>
                <div className={`${styles.skeletonLine} ${styles.subtitle}`}></div>
            </header>

            <div className={styles.analyticsContainer}>
                <div className={styles.metricsGrid}>
                    <div className={styles.metricItem}>
                        <div className={`${styles.skeletonLine} ${styles.metricValue}`}></div>
                        <div className={`${styles.skeletonLine} ${styles.metricLabel}`}></div>
                    </div>
                    <div className={styles.metricItem}>
                        <div className={`${styles.skeletonLine} ${styles.metricValue}`}></div>
                        <div className={`${styles.skeletonLine} ${styles.metricLabel}`}></div>
                    </div>
                    <div className={`${styles.metricItem} ${styles.fullWidth}`}>
                        <div className={`${styles.skeletonLine} ${styles.metricValue}`}></div>
                        <div className={`${styles.skeletonLine} ${styles.metricLabel}`}></div>
                    </div>
                </div>

                <div className={`${styles.skeletonLine} ${styles.chartTitle}`}></div>
                <div className={styles.detectionList}>
                    {[...Array(3)].map((_, i) => ( // Reduced to 3 for typical display
                        <div key={i} className={styles.detectionItem}>
                            <div className={styles.itemInfo}>
                                <div className={`${styles.skeletonLine} ${styles.itemName}`}></div>
                                <div className={`${styles.skeletonLine} ${styles.itemCount}`}></div>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressBarFill}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.detailsSection}>
                <div className={`${styles.skeletonLine} ${styles.detailsTitle}`}></div>
                <div className={styles.objectListContainer}>
                    <div className={styles.objectList}>
                        {[...Array(6)].map((_, i) => ( // Reduced to 6 for typical display
                            <div key={i} className={styles.objectItem}>
                                <div className={`${styles.skeletonLine} ${styles.objectName}`}></div>
                                <div className={`${styles.skeletonLine} ${styles.objectScore}`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <div className={`${styles.skeletonLine} ${styles.button}`}></div>
            </div>
        </div>
    );
};

export default SessionSummarySkeleton;