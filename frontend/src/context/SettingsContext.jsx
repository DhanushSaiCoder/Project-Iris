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
});

// 3. Create Provider component
export function SettingsProvider({ children }) {
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
        return saved !== null
            ? JSON.parse(saved)
            : defaultSettings.alertDistance;
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

    // Persist to localStorage on changes
    useEffect(() => {
        localStorage.setItem("bw-audio", JSON.stringify(audioAnnouncements));
    }, [audioAnnouncements]);
    useEffect(() => {
        localStorage.setItem("bw-haptic", JSON.stringify(hapticFeedback));
    }, [hapticFeedback]);
    useEffect(() => {
        localStorage.setItem("bw-alert-distance", JSON.stringify(alertDistance));
    }, [alertDistance]);
    useEffect(() => {
        localStorage.setItem("bw-developer-mode", JSON.stringify(developerMode));
    }, [developerMode]);
    useEffect(() => {
        localStorage.setItem("bw-auto-calibrate", JSON.stringify(autoCaliberateOnLaunch));
    }, [autoCaliberateOnLaunch]);
    useEffect(() => {
        localStorage.setItem("bw-torch", JSON.stringify(torch));
    }, [torch]);

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
            developerMode,
            setDeveloperMode,
            autoCaliberateOnLaunch,
            setAutoCaliberateOnLaunch,
            torch,
            setTorch,
        }),
        [audioAnnouncements, hapticFeedback, sessionId, alertDistance, developerMode, autoCaliberateOnLaunch, torch]
    );

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}
