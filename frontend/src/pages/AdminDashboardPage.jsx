import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AdminDashboardPage.module.css';
import Stats from '../components/AdminDashboard/Stats';
import ActiveUsers from '../components/AdminDashboard/ActiveUsers';
import History from '../components/AdminDashboard/History';
import ObjectDetectionChart from '../components/AdminDashboard/ObjectDetectionChart';
import chartStyles from './Charts.module.css';

const AdminDashboardPage = () => {
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

    if (loading) {
        return <div className={styles.AdminDashboardPage}>Loading dashboard...</div>;
    }

    if (error) {
        return <div className={styles.AdminDashboardPage}>Error loading dashboard: {error.message}</div>;
    }

    return (
        <div className={styles.AdminDashboardPage}>
            <h1 className={styles.Title}>DASHBOARD</h1>
            <Stats sessions={sessions} />
            <ActiveUsers sessions={sessions} />
            <History sessions={sessions} />

            <div className={chartStyles.ChartsContainer}>
                <h2 className={chartStyles.Title}>CHARTS</h2>
                <ObjectDetectionChart sessions={sessions} />
            </div>
        </div>
    );
}

export default AdminDashboardPage;
