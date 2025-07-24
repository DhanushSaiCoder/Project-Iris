import React from 'react';
import styles from './ActiveUsers.module.css';
import { Link } from 'react-router-dom';

const ActiveUsers = () => {
    const ActiveUsers = [
        { id: 2263519637 },
        { id: 2263519638 },
        { id: 2263519639 }
    ];

    return (
        <div className={styles.ActiveUsersContainer}>
            <div className={styles.ActiveUsersTitleContainer}>
                <p>ACTIVE USERS</p>
                <Link to='/' className={styles.LinkView}>View More</Link>
            </div>
            <div className={styles.ActiveUsersDetails}>
                {ActiveUsers.map((user, index) => (
                    <div key={user.id + index} className={styles.UserCard}>
                        <p className={styles.SessionId}>SESSION ID: <span>{user.id}</span></p>
                        <p className={styles.Moniter}>Moniter User</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActiveUsers;
