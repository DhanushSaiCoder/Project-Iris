import React, { useContext } from "react";
import styles from "./Header.module.css";

import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const handleSettingsClick = () => {
        navigate("/settings");
    };

    const handleLogoClick = () => {
        navigate("/");
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className={styles.Header}>
            <img
                onClick={handleLogoClick}
                className={styles.logoImg}
                src="/logo.png"
                alt="My Brand Logo"
            />
            <h2 onClick={handleLogoClick} className={styles.headerTxt}>
                PROJECT IRIS
            </h2>
            <div className={styles.headerRight}>
                {user ? (
                    <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
                ) : (
                    <>
                        <button onClick={() => navigate("/login")} className={styles.loginBtn}>Login</button>
                        <button onClick={() => navigate("/signup")} className={styles.signupBtn}>Sign Up</button>
                    </>
                )}
                <Settings
                    className={styles.settingsIcon}
                    onClick={handleSettingsClick}
                />
            </div>
        </div>
    );
};

export default Header;
