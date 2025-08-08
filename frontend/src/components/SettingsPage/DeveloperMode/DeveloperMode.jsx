import React, { useContext } from 'react';
import { SettingsContext } from '../../../context/SettingsContext';
import ToggleSwitch from '../../SettingsPage/ToggleSwitch';
import styles from './DeveloperMode.module.css';

const DeveloperMode = () => {
    const { developerMode, setDeveloperMode } = useContext(SettingsContext);

    return (
        <>
            <p className={styles.settingLabel}>Developer Mode</p>
            <ToggleSwitch
                checked={developerMode}
                onChange={setDeveloperMode}
            />
        </>
    );
};

export default DeveloperMode;
