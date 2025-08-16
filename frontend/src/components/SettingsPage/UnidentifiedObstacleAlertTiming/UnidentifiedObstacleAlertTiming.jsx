import React, { useContext } from 'react';
import { SettingsContext } from '../../../context/SettingsContext';
import styles from '../../../pages/SettingsPage.module.css';
import { Slider, Typography } from '@mui/material';

const UnidentifiedObstacleAlertTiming = () => {
    const { 
        unidentifiedObstacleAlertCooldown, 
        setUnidentifiedObstacleAlertCooldown,
        unidentifiedObstacleAlertConsistencyTime,
        setUnidentifiedObstacleAlertConsistencyTime
    } = useContext(SettingsContext);

    const handleCooldownChange = (event, newValue) => {
        setUnidentifiedObstacleAlertCooldown(newValue);
    };

    const handleConsistencyChange = (event, newValue) => {
        setUnidentifiedObstacleAlertConsistencyTime(newValue);
    };

    return (
        <div className={styles.settingItemContainer}>
            <div className={styles.settingItemText}>
                <h3>Unidentified Obstacle Alert Timing</h3>
                <p>Adjust cooldown between alerts and required consistency time.</p>
            </div>
            <div className={styles.sliderContainer}>
                <Typography gutterBottom>Cooldown: {unidentifiedObstacleAlertCooldown} ms</Typography>
                <Slider
                    value={unidentifiedObstacleAlertCooldown}
                    onChange={handleCooldownChange}
                    aria-labelledby="cooldown-slider"
                    valueLabelDisplay="auto"
                    min={500}
                    max={5000}
                    step={100}
                />
                <Typography gutterBottom>Consistency Time: {unidentifiedObstacleAlertConsistencyTime} ms</Typography>
                <Slider
                    value={unidentifiedObstacleAlertConsistencyTime}
                    onChange={handleConsistencyChange}
                    aria-labelledby="consistency-slider"
                    valueLabelDisplay="auto"
                    min={50}
                    max={1000}
                    step={50}
                />
            </div>
        </div>
    );
};

export default UnidentifiedObstacleAlertTiming;