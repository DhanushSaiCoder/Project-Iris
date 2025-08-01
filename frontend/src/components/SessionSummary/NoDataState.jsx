// src/components/SessionSummary/NoDataState.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NoDataState.module.css';
import { PlayCircle, AlertTriangle } from 'lucide-react';

const NoDataState = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.noDataContainer}>
            <div className={styles.noDataContent}>
                <AlertTriangle size={64} className={styles.noDataIcon} />
                <h1 className={styles.title}>No Session Data</h1>
                <p className={styles.noDataText}>
                    We couldn't find any detection data. Start a new session to begin analyzing your surroundings.
                </p>
                <div className={styles.actions}>
                    <button
                        className={`${styles.button} ${styles.primary}`}
                        onClick={() => navigate('/')}
                    >
                        <PlayCircle />
                        Start New Session
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoDataState;