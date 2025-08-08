import React, { useContext } from "react";
import ToggleSwitch from "../../common/ToggleSwitch";
import styles from "./Torch.module.css";
import { SettingsContext } from "../../../context/SettingsContext";

const Torch = () => {
    const { torch, setTorch } = useContext(SettingsContext);

    const handleToggle = () => {
        setTorch(!torch);
    };

    return (
        <div className={styles.settingItem}>
            <div className={styles.settingText}>
                <h3>Torch</h3>
                <p>Toggle camera torch (flashlight).</p>
            </div>
            <ToggleSwitch isOn={torch} handleToggle={handleToggle} />
        </div>
    );
};

export default Torch;
