import React, { useState, useEffect } from "react";
import styles from "./LaunchPage.module.css";
import Logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

const LaunchPage = () => {
    const navigate = useNavigate();
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isAppInstalled, setIsAppInstalled] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        const handleAppInstalled = () => {
            setIsAppInstalled(true);
            setDeferredPrompt(null); // Clear the prompt once installed
        };

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt
        );
        window.addEventListener("appinstalled", handleAppInstalled);

        // Check if the app is already installed (for subsequent visits)
        if (
            window.matchMedia("(display-mode: standalone)").matches ||
            navigator.standalone
        ) {
            setIsAppInstalled(true);
        }

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt
            );
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === "accepted") {
                console.log("User accepted the A2HS prompt");
                navigate("/"); // Redirect to home page after successful installation
            } else {
                console.log("User dismissed the A2HS prompt");
            }
            setDeferredPrompt(null);
        }
    };

    const handleContinueInBrowser = () => {
        navigate("/");
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <img
                    src={Logo}
                    alt="Project Iris Logo"
                    className={styles.logo}
                />
                <h1 className={styles.title}>PROJECT IRIS</h1>
                <p className={styles.subtitle}>
                    Welcome to PROJECT IRIS,
                    <br />
                    Please install for best experience.
                </p>

                {!isAppInstalled && deferredPrompt && (
                    <>
                        <button
                            onClick={handleInstallClick}
                            className={styles.installButton}
                        >
                            Install App
                        </button>

                        <ul className={styles.benefitsList}>
                            <li className={styles.positive}>
                                Works offline once installed.
                            </li>
                            <li className={styles.positive}>Get audio cues.</li>
                            <li className={styles.positive}>
                                Smoother experience.
                            </li>
                        </ul>
                    </>
                )}

                <button
                    onClick={handleContinueInBrowser}
                    className={styles.continueButton}
                >
                    Continue in Browser
                </button>

                <ul className={styles.drawbacksList}>
                    <li className={styles.negative}>
                        No offline compatibility.
                    </li>
                    <li className={styles.negative}>No audio cues.</li>
                </ul>
            </div>
        </div>
    );
};

export default LaunchPage;
