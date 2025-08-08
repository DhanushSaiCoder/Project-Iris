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
        <div className={styles.container}>
            <label className={styles.label}>Torch</label>

            <ToggleSwitch checked={torch} onChange={handleToggle} />
        </div>
    );
};

export default Torch;
