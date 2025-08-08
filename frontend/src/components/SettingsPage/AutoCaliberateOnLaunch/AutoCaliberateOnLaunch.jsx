import React, { useContext } from "react";
import ToggleSwitch from "../ToggleSwitch";
import { SettingsContext } from "../../../context/SettingsContext";
import styles from "./AutoCaliberateOnLaunch.module.css"
const AutoCaliberateOnLaunch = () => {
    const { autoCaliberateOnLaunch, setAutoCaliberateOnLaunch } = useContext(SettingsContext);

    return (
        <>
            <p className={styles.settingLabel}>Auto-Caliberate on Launch</p>
            <ToggleSwitch
                checked={autoCaliberateOnLaunch}
                onChange={setAutoCaliberateOnLaunch}
                label={autoCaliberateOnLaunch ? "On" : "Off"}
            />
        </>
    );
};

export default AutoCaliberateOnLaunch;