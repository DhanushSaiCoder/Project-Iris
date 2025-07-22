import React, { useState } from "react";
import styles from "./AlertDistance.module.css";
import AlertDistanceSlider from "./AlertDistanceSlider/AlertDistanceSlider";

const AlertDistance = () => {
    
    const [distance, setDistance] = useState(30);
    
    return (
        <div className={styles.AlertDistance}>
            <div className={styles.labelAndValue}>
                <p className={styles.settingLabel}>Alert Distance</p>
                <p>~1.3m</p>
            </div>
            <AlertDistanceSlider
                min={0}
                max={100}
                value={distance}
                onChange={setDistance}
            />
        </div>
    );
};

export default AlertDistance;
