import React from "react";
import styles from "./SettingsPage.module.css";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
        </div>
    );
};

export default SettingsPage;
