import React from 'react';
import IrisSpinner from './IrisSpinner';
import styles from './PageLoading.module.css';
import IrisSpinnerSecondary from './IrisSpinnerSecondary';

const PageLoading = () => {
  return (
    <div className={styles.pageLoadingContainer}>
      <IrisSpinnerSecondary size={48} />
      <p className={styles.loadingText}>Loading...</p>
    </div>
  );
};

export default PageLoading;
