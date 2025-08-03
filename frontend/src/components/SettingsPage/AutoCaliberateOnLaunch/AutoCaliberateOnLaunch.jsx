import React, { useContext } from "react";
import styles from "./AutoCaliberateOnLaunch.module.css";
import ToggleSwitch from "../ToggleSwitch";
import { SettingsContext } from "../../../context/SettingsContext";

const AutoCaliberateOnLaunch = () => {
    const { autoCaliberateOnLaunch, setAutoCaliberateOnLaunch } = useContext(SettingsContext);

    return (
        <div className={styles.AutoCaliberateOnLaunch}>
            <p>Auto-Caliberate on Launch</p>
            <ToggleSwitch
                checked={autoCaliberateOnLaunch}
                onChange={setAutoCaliberateOnLaunch}
                label={autoCaliberateOnLaunch ? "On" : "Off"}
            />
        </div>
    );
};

export default AutoCaliberateOnLaunch;
