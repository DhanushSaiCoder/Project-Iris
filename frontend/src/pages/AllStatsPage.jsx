import React, { useEffect, useState } from 'react';
import PageLoading from "../components/common/PageLoading";
import axios from 'axios';
import styles from './AllStatsPage.module.css';
import { Link } from 'react-router-dom';

const AllStatsPage = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/session`);
                setSessions(response.data.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

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

    if (loading) {
        return <PageLoading />;
    }

    if (error) {
        return <div className={styles.container}>Error loading statistics: {error.message}</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>All Statistics</h1>
            <div className={styles.statsGrid}>
                <div className={styles.statsCard}>
                    <h2 className={styles.cardTitle}>Total Sessions</h2>
                    <p className={styles.cardValue}>{totalSessions}</p>
                </div>
                <div className={styles.statsCard}>
                    <h2 className={styles.cardTitle}>Total Duration</h2>
                    <p className={styles.cardValue}>{formatDuration(totalDuration)}</p>
                </div>
                <div className={styles.statsCard}>
                    <h2 className={styles.cardTitle}>Total Detections</h2>
                    <p className={styles.cardValue}>{totalDetections}</p>
                </div>
                <div className={styles.statsCard}>
                    <h2 className={styles.cardTitle}>Average Session Duration</h2>
                    <p className={styles.cardValue}>{formatDuration(averageSessionDuration)}</p>
                </div>
                <div className={styles.statsCard}>
                    <h2 className={styles.cardTitle}>Unique Users</h2>
                    <p className={styles.cardValue}>{uniqueUsers}</p>
                </div>
                <div className={styles.statsCard}>
                    <h2 className={styles.cardTitle}>Total Unique Objects</h2>
                    <p className={styles.cardValue}>{totalUniqueObjects}</p>
                </div>
            </div>
            <Link to="/admin" className={styles.backLink}>Back to Admin Dashboard</Link>
        </div>
    );
};

export default AllStatsPage;