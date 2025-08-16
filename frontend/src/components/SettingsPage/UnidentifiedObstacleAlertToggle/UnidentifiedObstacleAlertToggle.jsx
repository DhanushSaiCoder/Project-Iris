import React, { useContext } from 'react';
import { SettingsContext } from '../../../context/SettingsContext';
import styles from '../../../pages/SettingsPage.module.css';
import { Switch } from '@mui/material';

const UnidentifiedObstacleAlertToggle = () => {
    const { unidentifiedObstacleAlertEnabled, setUnidentifiedObstacleAlertEnabled } = useContext(SettingsContext);

    const handleChange = (event) => {
        setUnidentifiedObstacleAlertEnabled(event.target.checked);
    };

    return (
        <div className={styles.settingItemContainer}>
            <div className={styles.settingItemText}>
                <h3>Unidentified Obstacle Alerts</h3>
                <p>Enable alerts for obstacles not recognized by object detection.</p>
            </div>
            <Switch
                checked={unidentifiedObstacleAlertEnabled}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'unidentified obstacle alert toggle' }}
            />
        </div>
    );
};

export default UnidentifiedObstacleAlertToggle;