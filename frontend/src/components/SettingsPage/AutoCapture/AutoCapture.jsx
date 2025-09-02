import React, { useContext } from 'react';
import { SettingsContext } from '../../../context/SettingsContext';
import styles from './AutoCapture.module.css';

const AutoCapture = () => {
    const { autoCapture, setAutoCapture } = useContext(SettingsContext);

    return (
        <div className={styles.autoCaptureContainer}>
            <div className={styles.labelContainer}>
                <span className={styles.label}>Enable Auto-Capture in Calibration</span>
                <p className={styles.description}>Automatically start recording when the object is stable.</p>
            </div>
            <div className={styles.switchContainer}>
                <label className={styles.switch}>
                    <input 
                        type="checkbox" 
                        checked={autoCapture}
                        onChange={(e) => setAutoCapture(e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                </label>
            </div>
        </div>
    );
};

export default AutoCapture;
