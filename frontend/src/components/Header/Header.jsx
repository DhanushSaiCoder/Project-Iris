import React from "react";
import styles from "./Header.module.css";
import logo from "../../assets/images/logo.png";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    const handleSettingsClick = () => {
        navigate("/settings");
    };

    const handleLogoClick = () => {
        navigate("/");
    };

    return (
        <div className={styles.Header}>
            <img
                onClick={handleLogoClick}
                className={styles.logoImg}
                src={logo}
                alt="My Brand Logo"
            />
            <h2 onClick={handleLogoClick} className={styles.headerTxt}>
                PROJECT IRIS
            </h2>
            <Settings
                className={styles.settingsIcon}
                onClick={handleSettingsClick}
            />
        </div>
    );
};

export default Header;
