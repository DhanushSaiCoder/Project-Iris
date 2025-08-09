import React, { useEffect, useState } from 'react';
import PageLoading from "../components/common/PageLoading";
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

    const uniqueUsers = sessions.reduce((acc, session) => {
        if (session.userId && session.userId._id) {
            acc[session.userId._id] = session.userId;
        }
        return acc;
    }, {});

    const uniqueUserList = Object.values(uniqueUsers);

    if (loading) {
        return <PageLoading />;
    }

    if (error) {
        return <div className={styles.container}>Error loading active users: {error.message}</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>All Active Users</h1>
            <div className={styles.userList}>
                {uniqueUserList.length > 0 ? (
                    uniqueUserList.map((user) => (
                        <div key={user._id} className={styles.userCard}>
                            <p className={styles.username}>Username: <span>{user.fullName}</span></p>
                            <p className={styles.userId}>User ID: <span>{user._id}</span></p>
                            <button className={styles.monitorButton} onClick={() => navigate(`/monitor-user/${user._id}`)}>Monitor User</button>
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