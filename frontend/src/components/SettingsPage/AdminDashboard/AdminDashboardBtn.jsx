import React from 'react';
import { Link } from 'react-router-dom';
import styles from "./AdminDashboardBtn.module.css";
import { ShieldUser } from 'lucide-react';

const AdminDashboardBtn = () => {
    return (
        <div className={styles.AdminDashboardBtn}>
            <Link to="/admin" className={styles.LinkAdmin}>
                <button>
                    <ShieldUser /> Admin Dashboard
                </button>
            </Link>
        </div>
    );
};

export default AdminDashboardBtn;