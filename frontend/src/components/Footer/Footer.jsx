import React from "react";
import styles from "./Footer.module.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate()
    return (

        <div className={styles.Footer}>
            <p
                onClick={() => {
                    navigate("/help");
                }}
            >
                <span className={styles.helpIcon}>?</span> Help
            </p>
            <p
                onClick={() => {
                    navigate("/privacy-notes");
                }}
            >
                <span className={styles.privacyNotesIcon}>!</span> Privacy Notes
            </p>
            <p
                onClick={() => {
                    navigate("/developers");
                }}
            >
                <span className={styles.developersIcon}>&lt;/&gt;</span>{" "}
                Developers
            </p>
        </div>
    );
};

export default Footer;
