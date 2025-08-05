import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AllActiveUsersPage.module.css';
import { Link, useNavigate } from 'react-router-dom';

const AllActiveUsersPage = () => {
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

    const uniqueUsers = [...new Set(sessions.map(session => session.userId))];

    if (loading) {
        return <div className={styles.container}>Loading active users...</div>;
    }

    if (error) {
        return <div className={styles.container}>Error loading active users: {error.message}</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>All Active Users</h1>
            <div className={styles.userList}>
                {uniqueUsers.length > 0 ? (
                    uniqueUsers.map((userId, index) => (
                        <div key={userId + index} className={styles.userCard}>
                            <p className={styles.userId}>User ID: <span>{userId}</span></p>
                            <button className={styles.monitorButton} onClick={() => navigate(`/monitor-user/${userId}`)}>Monitor User</button>
                        </div>
                    ))
                ) : (
                    <p>No active users found.</p>
                )}
            </div>
            <Link to="/admin" className={styles.backLink}>Back to Admin Dashboard</Link>
        </div>
    );
};

export default AllActiveUsersPage;