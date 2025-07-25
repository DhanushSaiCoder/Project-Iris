import React from 'react';
import styles from './Stats.module.css';
import { Link } from 'react-router-dom';

const Stats = () => {
    return (
        <div className={styles.StatsContainer}>
            <div className={styles.StatsTitleContainer}>
                <h1 className={styles.statsTitle}>STATS</h1>
                <Link to='/' className={styles.ViewMore}>View More</Link>

            </div>
            <div className={styles.StatsDetailsContainer}>
                <div className={styles.StatsDetailsCard}>
                    <h1 className={styles.statsData}>05</h1>
                    <p>Sessions Today</p>
                </div>
                <div className={styles.StatsDetailsCard}>
                    <h1 className={styles.statsData}>43</h1>
                    <p>Alerts Today</p>
                </div>
                <div className={styles.StatsDetailsCard}>
                    <h1 className={styles.statsData}>143</h1>
                    <p>Alerts</p>
                </div>
            </div>
        </div>
    );
};

export default Stats;
