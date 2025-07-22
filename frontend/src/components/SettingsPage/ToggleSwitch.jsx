import React from "react";
import styles from "./ToggleSwitch.module.css";

export default function ToggleSwitch({ checked, onChange, label }) {
    return (
        <label className={styles.switch}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <span className={styles.slider}></span>
            {label && <span style={{ marginLeft: 8 }}>{label}</span>}
        </label>
    );
}
