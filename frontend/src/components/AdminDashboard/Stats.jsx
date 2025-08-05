import React from 'react';
import styles from './Stats.module.css';
import { Link } from 'react-router-dom';

const Stats = ({ sessions }) => {
    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce((acc, session) => acc + session.duration, 0);
    const totalUniqueObjects = sessions.reduce((acc, session) => acc + session.uniqueObjects, 0);
    const totalDetections = sessions.reduce((acc, session) => acc + session.totalDetections, 0);
    const averageSessionDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;
    const uniqueUsers = [...new Set(sessions.map(session => session.userId))].length;

    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}m ${seconds}s`;
    };

    return (
        <div className={styles.StatsContainer}>
            <div className={styles.StatsTitleContainer}>
                <h1 className={styles.statsTitle}>STATS</h1>
                <Link to='/' className={styles.ViewMore}>View More</Link>
            </div>
            <div className={styles.StatsDetailsContainer}>
                <div className={styles.StatsDetailsCard}>
                    <h1 className={styles.statsData}>{totalSessions}</h1>
                    <p>Total Sessions</p>
                </div>
                <div className={styles.StatsDetailsCard}>
                    <h1 className={styles.statsData}>{formatDuration(totalDuration)}</h1>
                    <p>Total Duration</p>
                </div>
                <div className={styles.StatsDetailsCard}>
                    <h1 className={styles.statsData}>{totalDetections}</h1>
                    <p>Total Detections</p>
                </div>
                <div className={styles.StatsDetailsCard}>
                    <h1 className={styles.statsData}>{formatDuration(averageSessionDuration)}</h1>
                    <p>Avg. Session Duration</p>
                </div>
                <div className={styles.StatsDetailsCard}>
                    <h1 className={styles.statsData}>{uniqueUsers}</h1>
                    <p>Unique Users</p>
                </div>
            </div>
        </div>
    );
};

export default Stats;
