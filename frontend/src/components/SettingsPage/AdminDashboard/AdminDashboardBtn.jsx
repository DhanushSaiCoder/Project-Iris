import React from 'react';
import styles from "./AdminDashboardBtn.module.css"
import { RotateCcw, ShieldUser } from 'lucide-react';

const AdminDashboardBtn = () => {
    return (
        <div className={styles.AdminDashboardBtn}>
            <button><ShieldUser />Admin Dashboard</button>
        </div>
    );
}

export default AdminDashboardBtn;

