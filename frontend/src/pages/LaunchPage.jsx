import React from 'react';
import styles from './LaunchPage.module.css';
import Logo from '../assets/images/logo.png';

const LaunchPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src={Logo} alt="Project Iris Logo" className={styles.logo} />
        <h1 className={styles.title}>PROJECT IRIS</h1>
        <p className={styles.subtitle}>
          Welcome to PROJECT IRIS,<br />
          Please install for best experience.
        </p>

        <button className={styles.installButton}>Install App</button>

        <ul className={styles.benefitsList}>
          <li className={styles.positive}>
            Works offline once installed.
          </li>
          <li className={styles.positive}>
            Get audio cues.
          </li>
          <li className={styles.positive}>
            Smoother experience.
          </li>
        </ul>

        <button className={styles.continueButton}>Continue in Browser</button>

        <ul className={styles.drawbacksList}>
          <li className={styles.negative}>
            No offline compatibility.
          </li>
          <li className={styles.negative}>
            No audio cues.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LaunchPage;
