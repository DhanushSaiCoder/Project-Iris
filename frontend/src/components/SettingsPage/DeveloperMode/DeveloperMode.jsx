import React, { useContext } from 'react';
import { SettingsContext } from '../../../context/SettingsContext';
import ToggleSwitch from '../../SettingsPage/ToggleSwitch';
import styles from './DeveloperMode.module.css';

const DeveloperMode = () => {
    const { developerMode, setDeveloperMode } = useContext(SettingsContext);

    return (
        <div className={styles.container}>
            <label className={styles.label}>Developer Mode</label>
            <ToggleSwitch
                checked={developerMode}
                onChange={setDeveloperMode}
            />
        </div>
    );
};

export default DeveloperMode;
