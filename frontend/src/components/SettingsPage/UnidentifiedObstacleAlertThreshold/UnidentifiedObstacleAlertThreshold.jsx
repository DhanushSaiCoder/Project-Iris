import React, { useContext } from 'react';
import { SettingsContext } from '../../../context/SettingsContext';
import styles from '../../../pages/SettingsPage.module.css';
import { Slider, Typography } from '@mui/material';

const UnidentifiedObstacleAlertThreshold = () => {
    const { 
        unidentifiedObstacleAlertThreshold, 
        setUnidentifiedObstacleAlertThreshold,
        unidentifiedObstacleAlertOffThreshold,
        setUnidentifiedObstacleAlertOffThreshold
    } = useContext(SettingsContext);

    const handleThresholdChange = (event, newValue) => {
        setUnidentifiedObstacleAlertThreshold(newValue);
    };

    const handleOffThresholdChange = (event, newValue) => {
        setUnidentifiedObstacleAlertOffThreshold(newValue);
    };

    return (
        <div className={styles.settingItemContainer}>
            <div className={styles.settingItemText}>
                <h3>Unidentified Obstacle Distance Thresholds</h3>
                <p>Set the distance at which alerts are triggered (T_on) and disarmed (T_off).</p>
            </div>
            <div className={styles.sliderContainer}>
                <Typography gutterBottom>Alert On (T_on): {unidentifiedObstacleAlertThreshold.toFixed(1)} m</Typography>
                <Slider
                    value={unidentifiedObstacleAlertThreshold}
                    onChange={handleThresholdChange}
                    aria-labelledby="alert-threshold-slider"
                    valueLabelDisplay="auto"
                    min={0.5}
                    max={10}
                    step={0.1}
                />
                <Typography gutterBottom>Alert Off (T_off): {unidentifiedObstacleAlertOffThreshold.toFixed(1)} m</Typography>
                <Slider
                    value={unidentifiedObstacleAlertOffThreshold}
                    onChange={handleOffThresholdChange}
                    aria-labelledby="off-threshold-slider"
                    valueLabelDisplay="auto"
                    min={0.5}
                    max={10}
                    step={0.1}
                />
            </div>
        </div>
    );
};

export default UnidentifiedObstacleAlertThreshold;