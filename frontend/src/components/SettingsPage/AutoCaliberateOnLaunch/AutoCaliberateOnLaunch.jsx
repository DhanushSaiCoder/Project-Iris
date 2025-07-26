import React, { useContext } from "react";
import styles from "./AutoCaliberateOnLaunch.module.css";
import ToggleSwitch from "../ToggleSwitch";
import { SettingsContext } from "../../../context/SettingsContext";

const AutoCaliberateOnLaunch = () => {
    const { audioAnnouncements, setAudioAnnouncements } = useContext(SettingsContext);

    return (
        <div className={styles.AutoCaliberateOnLaunch}>
            <p>Auto-Caliberate on Launch</p>
            <ToggleSwitch
                checked={audioAnnouncements}
                onChange={setAudioAnnouncements}
                label={audioAnnouncements ? "On" : "Off"}
            />
        </div>
    );
};

export default AutoCaliberateOnLaunch;
