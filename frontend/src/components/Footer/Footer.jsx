import React from 'react';
import styles from "./Footer.module.css"

const Footer = () => {
    return (
        <div className={styles.Footer}>
            <p><span className={styles.helpIcon}>?</span> Help</p>
            <p><span className={styles.privacyNotesIcon}>!</span> Privacy Notes</p>
            <p><span className={styles.developersIcon}>&lt;/&gt;</span> Developers</p>
        </div>
    );
}

export default Footer;
