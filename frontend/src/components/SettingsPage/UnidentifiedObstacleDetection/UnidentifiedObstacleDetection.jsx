import React, { useContext } from "react";
import styles from "../HepticFeedback/HepticFeedback.module.css";
import ToggleSwitch from "../ToggleSwitch";
import { SettingsContext } from "../../../context/SettingsContext";

const UnidentifiedObstacleDetection = () => {
    const {
        enableUnidentifiedObstacleDetection,
        setEnableUnidentifiedObstacleDetection,
    } = useContext(SettingsContext);

    return (
        <>
            <p className={styles.settingLabel}>
                Unidentified Obstacle Detection <span className={styles.betaTag}>(beta)</span>
            </p>
            <ToggleSwitch
                checked={enableUnidentifiedObstacleDetection}
                onChange={setEnableUnidentifiedObstacleDetection}
                label={enableUnidentifiedObstacleDetection ? "On" : "Off"}
            />
        </>
    );
};

export default UnidentifiedObstacleDetection;
