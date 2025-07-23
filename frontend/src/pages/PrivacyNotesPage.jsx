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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Cras eget aliquam metus. Morbi sed nibh nec justo semper
            fringilla id ac neque. Nullam eleifend dolor sit amet
            lorem euismod aliquet sed sit amet nunc. Donec et massa ut
            lacus iaculis euismod. Vivamus cursus nisi sit amet
            convallis varius. Phasellus sit amet sagittis neque.
            Curabitur convallis molestie mauris, id sodales turpis
            suscipit eu. Sed fermentum placerat turpis, in sodales
            felis vehicula eget. Aliquam a dictum orci. Nulla ut
            suscipit augue.
          </p>

          <p className={styles.notesTxt}>
            In aliquam lorem a euismod vestibulum. Mauris malesuada
            orci nec tellus rhoncus hendrerit at ac tellus. Nulla in
            ligula vel magna fringilla malesuada a in ante. Nullam
            eget suscipit leo, eget viverra eros. Ut facilisis erat
            ipsum, sed malesuada quam semper id. Aliquam aliquam
            mauris id molestie tempus. Aliquam a ipsum velit. Ut
            volutpat dui justo. Pellentesque faucibus erat vitae
            orci bibendum dapibus. In at vestibulum urna. Nam
            hendrerit elementum libero in porta. Sed pulvinar, nunc
            id sagittis finibus, orci arcu mattis justo, a rutrum
            tortor neque nec mi. Nulla eu convallis velit.
          </p>

          <p className={styles.notesTxt}>
            Pellentesque faucibus erat vitae orci bibendum dapibus.
            In at vestibulum urna. Nam hendrerit elementum libero in
            porta. Sed pulvinar, nunc id sagittis finibus, orci arcu
            mattis justo, a rutrum tortor neque nec mi. Nulla eu
            convallis velit.
          </p>
        </div>
      </main>
    </div>
  );
}
