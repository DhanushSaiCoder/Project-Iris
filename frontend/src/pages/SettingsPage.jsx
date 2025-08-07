import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import styles from "./SettingsPage.module.css";
import AlertDistance from "../components/SettingsPage/AlertDistance/AlertDistance";
import HepticFeedback from "../components/SettingsPage/HepticFeedback/HepticFeedback";
import AutoCaliberateOnLaunch from "../components/SettingsPage/AutoCaliberateOnLaunch/AutoCaliberateOnLaunch";
import ReCaliberateDevice from "./../components/SettingsPage/ReCaliberateDeviceBtn/ReCaliberateDevice";
import AdminDashboardBtn from "../components/SettingsPage/AdminDashboard/AdminDashboardBtn";
import DeveloperMode from "../components/SettingsPage/DeveloperMode/DeveloperMode";
import AudioAnnouncements from "../components/SettingsPage/AudioAnnouncements/AudioAnnouncements";
import LogoutButton from "../components/SettingsPage/LogoutButton/LogoutButton";

const SettingsPage = () => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const getUserRoleFromToken = () => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                return decodedToken.role;
            } catch (error) {
                console.error("Error decoding token:", error);
                return null;
            }
        }
        return null;
    };

    const userRole = getUserRoleFromToken();
    const isAdminOrDeveloper = userRole === 'admin' || userRole === 'developer';
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
                <AudioAnnouncements />
                <AutoCaliberateOnLaunch />
                <DeveloperMode />
                <div className={styles.buttonsDiv}>
                    <ReCaliberateDevice />
                    {isAdminOrDeveloper && <AdminDashboardBtn />}
                </div>
                <LogoutButton />
            </div>
        </div>
    );
};

export default SettingsPage;
