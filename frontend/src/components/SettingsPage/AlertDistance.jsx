import React from "react";
import styles from "./AlertDistance.module.css";

const AlertDistance = () => {
    return (
        <div className={styles.AlertDistance}>
            <div className={styles.labelAndValue}>
                <p className={styles.settingLabel}>Alert Distance</p>
                <p>~1.3m</p>
            </div>
            <input className={styles.alertDistanceSlider} type="range" color="#1e90ff" />
        </div>
    );
};

export default AlertDistance;
