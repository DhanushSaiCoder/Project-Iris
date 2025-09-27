// src/context/SettingsContext.jsx
import React, { createContext, useState, useEffect, useMemo } from "react";

// 1. Define default values
const defaultSettings = {
    audioAnnouncements: true,
    hapticFeedback: true,
    sessionId: null,
    alertDistance: 4, // Default alert distance in meters
    developerMode: false,
    autoCaliberateOnLaunch: false,
    torch: false,
    hasSeenDetectionGuidance: false,
    enableUnidentifiedObstacleDetection: false, // New default setting
};

// 2. Create Context
export const SettingsContext = createContext({
    ...defaultSettings,
    setAudioAnnouncements: () => {},
    setHapticFeedback: () => {},
    setSessionId: () => {},
    setAlertDistance: () => {},
    setDeveloperMode: () => {},
    setAutoCaliberateOnLaunch: () => {},
    setTorch: () => {},
    setEnableUnidentifiedObstacleDetection: () => {},
});

// 3. Create Provider component
export const SettingsProvider = ({ children }) => {
    const [autoCapture, setAutoCapture] = useState(false);
    // Initialize from localStorage or defaults
    const [audioAnnouncements, setAudioAnnouncements] = useState(() => {
        const saved = localStorage.getItem("bw-audio");
        return saved !== null
            ? JSON.parse(saved)
            : defaultSettings.audioAnnouncements;
    });
    const [hapticFeedback, setHapticFeedback] = useState(() => {
        const saved = localStorage.getItem("bw-haptic");
        return saved !== null
            ? JSON.parse(saved)
            : defaultSettings.hapticFeedback;
    });
    const [sessionId, setSessionId] = useState(defaultSettings.sessionId);
    const [alertDistance, setAlertDistance] = useState(() => {
        const saved = localStorage.getItem("bw-alert-distance");
        return saved ? JSON.parse(saved) : defaultSettings.alertDistance;
    });

    const [calibration, setCalibration] = useState(() => {
        const saved = localStorage.getItem("bw-calibration");
        return saved ? JSON.parse(saved) : null;
    });
    const [developerMode, setDeveloperMode] = useState(() => {
        const saved = localStorage.getItem("bw-developer-mode");
        return saved !== null
            ? JSON.parse(saved)
            : defaultSettings.developerMode;
    });
    const [autoCaliberateOnLaunch, setAutoCaliberateOnLaunch] = useState(() => {
        const saved = localStorage.getItem("bw-auto-calibrate");
        return saved !== null
            ? JSON.parse(saved)
            : defaultSettings.autoCaliberateOnLaunch;
    });
    const [torch, setTorch] = useState(() => {
        const saved = localStorage.getItem("bw-torch");
        return saved !== null
            ? JSON.parse(saved)
            : defaultSettings.torch;
    });
    const [hasSeenDetectionGuidance, setHasSeenDetectionGuidance] = useState(() => {
        const saved = localStorage.getItem("bw-detection-guidance");
        return saved !== null
            ? JSON.parse(saved)
            : defaultSettings.hasSeenDetectionGuidance;
    });
    const [
        enableUnidentifiedObstacleDetection,
        setEnableUnidentifiedObstacleDetection,
    ] = useState(() => {
        const saved = localStorage.getItem(
            "bw-unidentified-obstacle-detection"
        );
        return saved !== null
            ? JSON.parse(saved)
            : defaultSettings.enableUnidentifiedObstacleDetection;
    });

    // Persist to localStorage on changes
    useEffect(() => {
        localStorage.setItem("bw-audio", JSON.stringify(audioAnnouncements));
    }, [audioAnnouncements]);
    useEffect(() => {
        localStorage.setItem("bw-haptic", JSON.stringify(hapticFeedback));
    }, [hapticFeedback]);
    useEffect(() => {
        localStorage.setItem(
            "bw-alert-distance",
            JSON.stringify(alertDistance)
        );
        localStorage.setItem(
            "bw-calibration",
            JSON.stringify(calibration)
        );
    }, [alertDistance, calibration]);
    useEffect(() => {
        localStorage.setItem(
            "bw-developer-mode",
            JSON.stringify(developerMode)
        );
    }, [developerMode]);
    useEffect(() => {
        localStorage.setItem(
            "bw-auto-calibrate",
            JSON.stringify(autoCaliberateOnLaunch)
        );
    }, [autoCaliberateOnLaunch]);
    useEffect(() => {
        localStorage.setItem("bw-torch", JSON.stringify(torch));
    }, [torch]);
    useEffect(() => {
        localStorage.setItem(
            "bw-detection-guidance",
            JSON.stringify(hasSeenDetectionGuidance)
        );
    }, [hasSeenDetectionGuidance]);
    useEffect(() => {
        localStorage.setItem(
            "bw-unidentified-obstacle-detection",
            JSON.stringify(enableUnidentifiedObstacleDetection)
        );
    }, [enableUnidentifiedObstacleDetection]);

    // 4. Provide state + setters
    const value = useMemo(
        () => ({
            audioAnnouncements,
            setAudioAnnouncements,
            hapticFeedback,
            setHapticFeedback,
            sessionId,
            setSessionId,
            alertDistance,
            setAlertDistance,
            calibration,
            setCalibration,
            developerMode,
            setDeveloperMode,
            autoCaliberateOnLaunch,
            setAutoCaliberateOnLaunch,
            torch,
            setTorch,
            hasSeenDetectionGuidance,
            setHasSeenDetectionGuidance,
            enableUnidentifiedObstacleDetection,
            setEnableUnidentifiedObstacleDetection,
            autoCapture,
            setAutoCapture,
            autoCapture,
            setAutoCapture,
        }),
        [
            audioAnnouncements,
            hapticFeedback,
            sessionId,
            alertDistance,
            developerMode,
            autoCaliberateOnLaunch,
            torch,
            hasSeenDetectionGuidance,
            enableUnidentifiedObstacleDetection,
            calibration,
        ]
    );

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}
