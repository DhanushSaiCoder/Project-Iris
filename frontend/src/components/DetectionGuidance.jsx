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
            <ul className={styles.pointsList}>
                <li>Ensure the device's camera has an unobstructed view of the desired area.</li>
                <li>Operate the device in a well-illuminated environment for best results.</li>
                <li>Maintain a stable device position during the detection process.</li>
                <li>Alert distances and other preferences can be configured in the Settings menu.</li>
            </ul>
            <button className={styles.startButton} onClick={handleStart}>
                Continue
            </button>
        </div>
    );
};

export default DetectionGuidance;
