import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AllHistoryPage.module.css';
import { Link, useNavigate } from 'react-router-dom';

const AllHistoryPage = () => {
    const navigate = useNavigate();
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

    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}m ${seconds}s`;
    };

    if (loading) {
        return <div className={styles.container}>Loading session history...</div>;
    }

    if (error) {
        return <div className={styles.container}>Error loading session history: {error.message}</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>All Session History</h1>
            <div className={styles.tableContainer}>
                <table className={styles.HistoryTable}>
                    <thead>
                        <tr>
                            <th>Session ID</th>
                            <th>User ID</th>
                            <th>Duration</th>
                            <th>Unique Objects</th>
                            <th>Total Detections</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.length > 0 ? (
                            sessions.map((session) => (
                                <tr key={session._id}>
                                    <td onClick={() => navigate(`/sessionSummary?sessionId=${session._id}`)} style={{ cursor: 'pointer', color: 'var(--color-cta)' }}>{session._id}</td>
                                    <td>{session.userId}</td>
                                    <td>{formatDuration(session.duration)}</td>
                                    <td>{session.uniqueObjects}</td>
                                    <td>{session.totalDetections}</td>
                                    <td>{new Date(session.createdAt).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No session history available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Link to="/admin" className={styles.backLink}>Back to Admin Dashboard</Link>
        </div>
    );
};

export default AllHistoryPage;