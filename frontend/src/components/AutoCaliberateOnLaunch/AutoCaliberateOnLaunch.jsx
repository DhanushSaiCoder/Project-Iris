import React, { useState } from "react";
import styles from "./AutoCaliberateOnLaunch.module.css";
import ToggleSwitch from "./../ToggleSwitch";

const AutoCaliberateOnLaunch = () => {
    const [enabled, setEnabled] = useState(false);

    return (
        <div className={styles.AutoCaliberateOnLaunch}>
            <p>Auto-Caliberate on Launch</p>
            <ToggleSwitch
                checked={enabled}
                onChange={setEnabled}
                label={enabled ? "On" : "Off"}
            />
        </div>
    );
};

export default AutoCaliberateOnLaunch;
