import React, { useContext } from "react";
import ToggleSwitch from "../ToggleSwitch";
import styles from "./Torch.module.css";
import { SettingsContext } from "../../../context/SettingsContext";

const Torch = () => {
    const { torch, setTorch } = useContext(SettingsContext);

    const handleToggle = () => {
        setTorch(!torch);
    };

    return (
        <>
            <p className={styles.settingLabel}>Torch</p>

            <ToggleSwitch checked={torch} onChange={handleToggle} />
        </>
    );
};

export default Torch;
