import React from 'react';
import styles from './ActiveUsers.module.css';
import TimeLogger from './TimeLogger';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ActiveUsers = () => {
    const navigate=useNavigate();
    const ActiveUsers = [
        { id: 2263519637 },
        { id: 2263519638 },
        { id: 2263519639 }
    ];
    const  handlemonitoruser  = () => {
    navigate('./TimeLogger');
  };

    return (
        <div className={styles.ActiveUsersContainer}>
            <div className={styles.ActiveUsersTitleContainer}>
                <h1>ACTIVE USERS</h1>
                <Link to='/' className={styles.ViewMore}>View More</Link>
            </div>
            <div className={styles.ActiveUsersDetails}>
                {ActiveUsers.map((user, index) => (
                    <div key={user.id + index} className={styles.UserCard}>
                        <p className={styles.SessionId}>SESSION ID: {"  "}<span>{user.id}</span></p>
                        <p className={styles.Moniter} onClick={handlemonitoruser}>Moniter User</p>
                    </div>
                ))}
            </div>
           
        </div>
    );
};

export default ActiveUsers;
