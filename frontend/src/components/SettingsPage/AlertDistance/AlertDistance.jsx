import React, { useContext } from "react";
import styles from "./AlertDistance.module.css";
import AlertDistanceSlider from "../AlertDistanceSlider/AlertDistanceSlider";
import { SettingsContext } from "../../../context/SettingsContext";

const AlertDistance = () => {
    const { alertDistance } = useContext(SettingsContext);

    return (
        <div className={styles.AlertDistance}>
            <div className={styles.labelAndValue}>
                <p className={styles.settingLabel}>Alert Distance</p>
                <p>{alertDistance} m</p>
            </div>
            <AlertDistanceSlider min={0.5} max={10} step={0.1} />
        </div>
    );
};

export default AlertDistance;
