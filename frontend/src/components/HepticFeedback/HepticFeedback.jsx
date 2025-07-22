import React, { useState } from "react";
import styles from "./HepticFeedback.module.css";
import ToggleSwitch from "./../ToggleSwitch";

const HepticFeedback = () => {
    const [enabled, setEnabled] = useState(false);

    return (
        <div className={styles.hepticFeedback}>
            <p>Heptic Feedback</p>
            <ToggleSwitch
                checked={enabled}
                onChange={setEnabled}
                label={enabled ? "On" : "Off"}
            />
        </div>
    );
};

export default HepticFeedback;
