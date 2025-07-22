import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import styles from "./SettingsPage.module.css";
import AlertDistance from "../components/SettingsPage/AlertDistance";
import HepticFeedback from "./../components/HepticFeedback/HepticFeedback";

const SettingsPage = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.Settings}>
            <div className={styles.settingsHeader}>
                <div
                    onClick={() => {
                        navigate(-1);
                    }}
                    className={styles.settingsBackDiv}
                >
                    <ChevronLeft />
                    Back
                </div>
                <h2>SETTINGS</h2>
            </div>

            <div className={styles.settingsContentDiv}>
                <AlertDistance />
                <HepticFeedback />
            </div>
        </div>
    );
};

export default SettingsPage;
