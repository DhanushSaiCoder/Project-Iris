import React, { useContext } from 'react';
import { Switch } from '@mui/material';
import { SettingsContext } from '../../../context/SettingsContext';
import styles from './UnidentifiedObstacleDetection.module.css';

const UnidentifiedObstacleDetection = () => {
    const { enableUnidentifiedObstacleDetection, setEnableUnidentifiedObstacleDetection } = useContext(SettingsContext);

    return (
        <div className={styles.unidentifiedObstacleDetection}>
            <div className={styles.label}>
                Unidentified Obstacle Detection
            </div>
            <Switch
                checked={enableUnidentifiedObstacleDetection}
                onChange={(e) => setEnableUnidentifiedObstacleDetection(e.target.checked)}
                name="enableUnidentifiedObstacleDetection"
                color="primary"
            />
        </div>
    );
};

export default UnidentifiedObstacleDetection;
