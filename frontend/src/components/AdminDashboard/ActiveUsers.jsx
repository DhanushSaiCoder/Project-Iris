import React from 'react';
import styles from './ActiveUsers.module.css';
import { Link, useNavigate } from 'react-router-dom';

const ActiveUsers = ({ sessions }) => {
    const navigate = useNavigate();

    // Get unique user IDs from sessions
    const uniqueUserIds = [...new Set(sessions.map(session => session.userId))];

    const handleMonitorUser = (userId) => {
        // Navigate to a page where user-specific data can be displayed
        // For now, let's just log it or navigate to a generic monitoring page
        console.log(`Monitoring user: ${userId}`);
        navigate(`/monitor-user/${userId}`); // Example: navigate to a user monitoring page
    };

    return (
        <div className={styles.ActiveUsersContainer}>
            <div className={styles.ActiveUsersTitleContainer}>
                <h1>ACTIVE USERS</h1>
                <Link to='/all-active-users' className={styles.ViewMore}>View More</Link>
            </div>
            <div className={styles.ActiveUsersDetails}>
                {uniqueUserIds.length > 0 ? (
                    uniqueUserIds.slice(0, 5).map((userId, index) => (
                        <div key={userId + index} className={styles.UserCard}>
                            <p className={styles.SessionId}>USER ID: {"  "}<span>{userId}</span></p>
                            <p className={styles.Moniter} onClick={() => handleMonitorUser(userId)}>Monitor User</p>
                        </div>
                    ))
                ) : (
                    <p>No active users found.</p>
                )}
            </div>
        </div>
    );
};

export default ActiveUsers;
