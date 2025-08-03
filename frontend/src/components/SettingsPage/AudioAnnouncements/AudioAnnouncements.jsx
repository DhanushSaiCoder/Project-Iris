import React, { useContext } from 'react';
import { SettingsContext } from '../../../context/SettingsContext';
import ToggleSwitch from '../../SettingsPage/ToggleSwitch';
import styles from './AudioAnnouncements.module.css';

const AudioAnnouncements = () => {
    const { audioAnnouncements, setAudioAnnouncements } = useContext(SettingsContext);

    return (
        <div className={styles.container}>
            <label className={styles.label}>Audio Announcements</label>
            <ToggleSwitch
                checked={audioAnnouncements}
                onChange={setAudioAnnouncements}
            />
        </div>
    );
};

export default AudioAnnouncements;
