import React from 'react';
import styles from './AdminDashboardPage.module.css'
import Stats from '../components/AdminDashboard/Stats';
import ActiveUsers from '../components/AdminDashboard/ActiveUsers';
import History from '../components/AdminDashboard/History';

const AdminDashboardPage = () => {
    return (
        <div className={styles.AdminDashboardPage}>
            <h1 className={styles.Title}>DASHBOARD</h1>
            <Stats />
            <ActiveUsers />
            <History />
        </div>
    );
}

export default AdminDashboardPage;
