import React from 'react';
import { ChevronLeft } from 'lucide-react';
import styles from './PrivacyNotesPage.module.css';

export default function PrivacyNotesPage() {
  function handleBack() {
    window.history.back();
  }

  return (
    <div className={styles.privacyScreen}>
      <header className={styles.privacyHeader}>
        <button
          onClick={handleBack}
          className={styles.backButton}
          aria-label="Go back"
        >
          <ChevronLeft className={styles.icon} />
          <span className={styles.backText}>Back</span>
        </button>
        <h1 className={styles.privacyTitle}>PRIVACY NOTES</h1>
        <div className={styles.spacer} />
      </header>

      <main className={styles.privacyMain}>
        <div className={styles.privacyContainer}>
          <p className={styles.notesTxt}>
            At Project Iris, we are committed to protecting your privacy. This page outlines our practices regarding the collection, use, and protection of your information when you use our web-based smart assistant.
          </p>

          <h2 className={styles.notesSubtitle}>1. Data Collection and Use</h2>
          <p className={styles.notesTxt}>
            Project Iris is designed to provide real-time environmental awareness. To achieve this, the application processes video feeds from your device's camera for object and depth detection.
            <br /><br />
            <strong>Important:</strong> All video processing for object and depth detection occurs locally on your device. We do not store, transmit, or have access to your live video feeds or any personal visual data.
            <br /><br />
            We collect anonymized session data to help you track your usage and to improve the application. This includes:
            <ul>
              <li>Session duration</li>
              <li>Number of unique objects detected</li>
              <li>Total detections made during a session</li>
              <li>Aggregated, non-identifiable statistics for the Admin Dashboard</li>
            </ul>
            This data is used solely to provide you with session summaries, analytics, and to enhance the overall performance and features of Project Iris.
          </p>

          <h2 className={styles.notesSubtitle}>2. Data Storage and Security</h2>
          <p className={styles.notesTxt}>
            Anonymized session data is stored securely in our MongoDB database. We implement industry-standard security measures to protect your data from unauthorized access, alteration, disclosure, or destruction.
            <br /><br />
            Your personal information, such as your user ID, is used to link session data to your account for personalized analytics. However, this data is kept separate from any visual information, which is never stored.
          </p>

          <h2 className={styles.notesSubtitle}>3. User Control and Preferences</h2>
          <p className={styles.notesTxt}>
            You have control over your experience with Project Iris. Our customizable settings allow you to adjust alert distances, feedback types (audio and haptic), and other preferences.
            <br /><br />
            You can review your session history and manage your account settings within the application.
          </p>

          <h2 className={styles.notesSubtitle}>4. Changes to This Privacy Policy</h2>
          <p className={styles.notesTxt}>
            We may update our Privacy Notes from time to time. We will notify you of any changes by posting the new Privacy Notes on this page. You are advised to review this Privacy Notes periodically for any changes.
          </p>

          <h2 className={styles.notesSubtitle}>5. Contact Us</h2>
          <p className={styles.notesTxt}>
            If you have any questions or concerns about these Privacy Notes, please contact us through the application's support channels or refer to the project's GitHub repository for contact information.
          </p>
        </div>
      </main>
    </div>
  );
}
