import React, { useContext } from "react";
import styles from "./HepticFeedback.module.css";
import ToggleSwitch from "../ToggleSwitch";
import { SettingsContext } from "../../../context/SettingsContext";

const HepticFeedback = () => {
    const { hapticFeedback, setHapticFeedback } = useContext(SettingsContext);

    return (
        <>
            <p className={styles.settingLabel}>Heptic Feedback</p>
            <ToggleSwitch
                checked={hapticFeedback}
                onChange={setHapticFeedback}
                label={hapticFeedback ? "On" : "Off"}
            />
        </>
    );
};

export default HepticFeedback;