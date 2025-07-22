import React from 'react';
import styles from './AlertDistanceSlider.module.css';

export default function AlertDistanceSlider({
  value,
  onChange,
  min = 0,
  max = 100
}) {
  // calculate percent fill
  const percent = ((value - min) / (max - min)) * 100;

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
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className={styles.slider}
      style={{ background }}
    />
  );
}
