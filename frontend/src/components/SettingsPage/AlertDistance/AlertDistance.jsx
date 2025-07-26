import React, { useContext } from "react";
import styles from "./AlertDistance.module.css";
import AlertDistanceSlider from "../AlertDistanceSlider/AlertDistanceSlider";
import { SettingsContext } from "../../../context/SettingsContext";

const AlertDistance = () => {
    const { thresholdScore } = useContext(SettingsContext);

    return (
        <div className={styles.AlertDistance}>
            <div className={styles.labelAndValue}>
                <p className={styles.settingLabel}>Alert Distance</p>
                <p>{thresholdScore}</p>
            </div>
            <AlertDistanceSlider min={0} max={100} />
        </div>
    );
};

export default AlertDistance;
