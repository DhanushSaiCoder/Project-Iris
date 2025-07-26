import React, { useContext } from "react";
import styles from "./AlertDistanceSlider.module.css";
import { SettingsContext } from "../../../context/SettingsContext";

export default function AlertDistanceSlider({ min = 0, max = 100 }) {
    const { thresholdScore, setThresholdScore } = useContext(SettingsContext);

    // calculate percent fill
    const percent = ((thresholdScore - min) / (max - min)) * 100;

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
            value={thresholdScore}
            onChange={(e) => setThresholdScore(Number(e.target.value))}
            className={styles.slider}
            style={{ background }}
        />
    );
}
