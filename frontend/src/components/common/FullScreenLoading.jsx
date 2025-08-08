import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import styles from './FullScreenLoading.module.css';
import logo from '../../assets/images/logo.png'; // Adjust path as necessary

const FullScreenLoading = ({ message }) => {
  return (
    <div className={styles.fullScreenContainer}>
      <img src={logo} alt="Project Iris Logo" className={styles.logo} />
      <LoadingSpinner />
      <p className={styles.loadingMessage}>{message}</p>
    </div>
  );
};

export default FullScreenLoading;