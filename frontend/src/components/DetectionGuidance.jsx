import React from 'react';
import styles from './DetectionGuidance.module.css';
import { SettingsContext } from '../context/SettingsContext';
import { useContext } from 'react';

const DetectionGuidance = () => {
    const { setHasSeenDetectionGuidance } = useContext(SettingsContext);

    const handleStart = () => {
        setHasSeenDetectionGuidance(true);
        window.location.href = '/'; // Redirect to home page
    };

    return (
        <div className={styles.guidanceContainer}>
            <h2 className={styles.title}>Object Detection Guidance</h2>
            <p className={styles.instruction}>For the best experience, please follow these suggestions:</p>
            <ul className={styles.pointsList}>
                <li>Make sure nothing is blocking the camera's view.</li>
                <li>Use the app in a place with good lighting for best results.</li>
                <li>Try to keep your phone steady while the app is detecting objects.</li>
                <li>You can change alert distances and other settings in the Settings menu.</li>
            </ul>
            <button className={styles.startButton} onClick={handleStart}>
                Acknowledge & Continue
            </button>
        </div>
    );
};

export default DetectionGuidance;