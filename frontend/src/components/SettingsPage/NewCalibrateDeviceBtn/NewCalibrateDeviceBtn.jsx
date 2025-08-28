
import React from "react";
import styles from "./NewCalibrateDeviceBtn.module.css";
import { useNavigate } from "react-router-dom";

const NewCalibrateDeviceBtn = () => {
    const navigate = useNavigate();

    const handleRecalibrate = () => {
        navigate("/new-calibration");
    };

    return (
        <div className={styles.reCaliberateDevice}>
            <button onClick={handleRecalibrate} className={styles.reCaliberateDeviceBtn}>
                New Calibrate Device
            </button>
        </div>
    );
};

export default NewCalibrateDeviceBtn;
