import React, { useContext } from 'react';
import { SettingsContext } from '../../../context/SettingsContext';
import styles from '../../../pages/SettingsPage.module.css';
import { Switch } from '@mui/material';

const DeveloperModeDebugOverlays = () => {
    const { developerModeDebugOverlays, setDeveloperModeDebugOverlays } = useContext(SettingsContext);

    const handleChange = (event) => {
        setDeveloperModeDebugOverlays(event.target.checked);
    };

    return (
        <div className={styles.settingItemContainer}>
            <div className={styles.settingItemText}>
                <h3>Debug Overlays</h3>
                <p>Show visual debugging information on the video stream.</p>
            </div>
            <Switch
                checked={developerModeDebugOverlays}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'developer mode debug overlays toggle' }}
            />
        </div>
    );
};

export default DeveloperModeDebugOverlays;