import React from 'react';
import styles from './LoadingSpinnerSecondary.module.css';

const LoadingSpinnerSecondary = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinnerDot}></div>
      <div className={styles.spinnerDot}></div>
      <div className={styles.spinnerDot}></div>
    </div>
  );
};

export default LoadingSpinnerSecondary;