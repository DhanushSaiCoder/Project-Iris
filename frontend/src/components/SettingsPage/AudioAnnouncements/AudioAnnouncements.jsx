import React, { useContext } from 'react';
import { SettingsContext } from '../../../context/SettingsContext';
import ToggleSwitch from '../../SettingsPage/ToggleSwitch';
import styles from './AudioAnnouncements.module.css';

const AudioAnnouncements = () => {
    const { audioAnnouncements, setAudioAnnouncements } = useContext(SettingsContext);

    return (
        <>
            <p className={styles.settingLabel}>Audio Announcements</p>
            <ToggleSwitch
                checked={audioAnnouncements}
                onChange={setAudioAnnouncements}
            />
        </>
    );
};

export default AudioAnnouncements;
