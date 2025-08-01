// src/context/SettingsContext.jsx
import React, { createContext, useState, useEffect, useMemo } from "react";

// 1. Define default values
const defaultSettings = {
    thresholdScore: null,
    audioAnnouncements: true,
    hapticFeedback: true,
    sessionId: null,
    alertDistance: 0.5, // Default alert distance
};

// 2. Create Context
export const SettingsContext = createContext({
    ...defaultSettings,
    setThresholdScore: () => {},
    setAudioAnnouncements: () => {},
    setHapticFeedback: () => {},
    setSessionId: () => {},
    setAlertDistance: () => {}, // Add setter for alert distance
});

// 3. Create Provider component
export function SettingsProvider({ children }) {
    // Initialize from localStorage or defaults
    const [thresholdScore, setThresholdScore] = useState(() => {
        const saved = localStorage.getItem("bw-threshold");
        return saved !== null
            ? JSON.parse(saved)
            : defaultSettings.thresholdScore;
    });
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

    // Persist to localStorage on changes
    useEffect(() => {
        if (thresholdScore !== null)
            localStorage.setItem(
                "bw-threshold",
                JSON.stringify(thresholdScore)
            );
    }, [thresholdScore]);
    useEffect(() => {
        localStorage.setItem("bw-audio", JSON.stringify(audioAnnouncements));
    }, [audioAnnouncements]);
    useEffect(() => {
        localStorage.setItem("bw-haptic", JSON.stringify(hapticFeedback));
    }, [hapticFeedback]);
    useEffect(() => {
        localStorage.setItem("bw-alert-distance", JSON.stringify(alertDistance));
    }, [alertDistance]);

    // 4. Provide state + setters
    const value = useMemo(
        () => ({
            thresholdScore,
            setThresholdScore,
            audioAnnouncements,
            setAudioAnnouncements,
            hapticFeedback,
            setHapticFeedback,
            sessionId,
            setSessionId,
            alertDistance,
            setAlertDistance,
        }),
        [
            thresholdScore,
            audioAnnouncements,
            hapticFeedback,
            sessionId,
            alertDistance,
        ]
    );

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}
