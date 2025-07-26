import React, { useContext } from "react";
import styles from "./HepticFeedback.module.css";
import ToggleSwitch from "../ToggleSwitch";
import { SettingsContext } from "../../../context/SettingsContext";

const HepticFeedback = () => {
    const { hapticFeedback, setHapticFeedback } = useContext(SettingsContext);

    return (
        <div className={styles.hepticFeedback}>
            <p>Heptic Feedback</p>
            <ToggleSwitch
                checked={hapticFeedback}
                onChange={setHapticFeedback}
                label={hapticFeedback ? "On" : "Off"}
            />
        </div>
    );
};

export default HepticFeedback;
