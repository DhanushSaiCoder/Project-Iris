import React from "react";
import styles from "./SettingsPage.module.css";
import { ChevronLeft } from "lucide-react";

const SettingsPage = () => {
    return (
        <div className={styles.Settings}>
            <div className={styles.settingsHeader}>
                <div className={styles.settingsBackDiv}>
                    <ChevronLeft />
                    Back
                </div>
                <h2>SETTINGS</h2>
            </div>
        </div>
    );
};

export default SettingsPage;
