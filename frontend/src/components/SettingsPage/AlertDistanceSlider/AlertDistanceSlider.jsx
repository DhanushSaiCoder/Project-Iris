import React, { useContext } from "react";
import styles from "./AlertDistanceSlider.module.css";
import { SettingsContext } from "../../../context/SettingsContext";

export default function AlertDistanceSlider({ min = 0.5, max = 10, step = 0.1, value, onChange }) {
    const { alertDistance, setAlertDistance } = useContext(SettingsContext);

    const currentValue = value !== undefined ? value : alertDistance;
    const handleChange = onChange !== undefined ? onChange : (e) => setAlertDistance(Number(e.target.value));

    // calculate percent fill
    const percent = ((currentValue - min) / (max - min)) * 100;

    // inline background gradient: fill + grey remainder
    const background = `
    linear-gradient(
      to right,
      #1e90ff 0%,
      #1e90ff ${percent}%,
      #555 ${percent}%,
      #555 100%
    )
  `;

    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onChange={handleChange}
            className={styles.slider}
            style={{ background }}
        />
    );
}
