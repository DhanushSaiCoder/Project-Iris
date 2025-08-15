import React from 'react';
import styles from './DetectionGuidance.module.css';
import { SettingsContext } from '../context/SettingsContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const DetectionGuidance = () => {
    const { setHasSeenDetectionGuidance } = useContext(SettingsContext);
    const navigate = useNavigate();

    const handleStart = () => {
        setHasSeenDetectionGuidance(true);
        navigate('/'); // Redirect to home page
    };

    return (
        <div className={styles.guidanceContainer}>
            <h2 className={styles.title}>Welcome to Project Iris!</h2>
            <p className={styles.instruction}>Before you start, here are a few things to know about using the object detection feature:</p>
            <ul className={styles.pointsList}>
                <li>Ensure your device camera has a clear view of the area you want to monitor.</li>
                <li>For best results, use in well-lit environments.</li>
                <li>Keep your device steady during detection.</li>
                <li>You can adjust alert distances and other settings later in the Settings page.</li>
            </ul>
            <button className={styles.startButton} onClick={handleStart}>
                Continue
            </button>
        </div>
    );
};

export default DetectionGuidance;
