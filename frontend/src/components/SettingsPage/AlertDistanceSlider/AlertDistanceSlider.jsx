import React, { useContext } from "react";
import styles from "./AlertDistanceSlider.module.css";
import { SettingsContext } from "../../../context/SettingsContext";

export default function AlertDistanceSlider({ min = 0.5, max = 10, step = 0.1 }) {
    const { alertDistance, setAlertDistance } = useContext(SettingsContext);

    // calculate percent fill
    const percent = ((alertDistance - min) / (max - min)) * 100;

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
            value={alertDistance}
            onChange={(e) => setAlertDistance(Number(e.target.value))}
            className={styles.slider}
            style={{ background }}
        />
    );
}
