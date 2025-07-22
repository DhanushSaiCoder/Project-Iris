import React from 'react';
import styles from "./Header.module.css"
import logo from "../../assets/images/logo.png"
import { Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom';


const Header = () => {
    const navigate = useNavigate();

    const handleSettingsClick = () => {
        navigate('/settings');
    }

    return (
        <div className={styles.Header}>
            <img className={styles.logoImg} src={logo} alt="My Brand Logo" />
            <h2 className={styles.headerTxt}>PROJECT IRIS</h2>
            <Settings className={styles.settingsIcon} onClick={handleSettingsClick}/>
        </div>
    );
}

export default Header;
