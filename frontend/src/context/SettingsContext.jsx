// src/context/SettingsContext.jsx
import React, { createContext, useState, useEffect } from "react";

// 1. Define default values
const defaultSettings = {
    thresholdScore: null,
    audioAnnouncements: true,
    hapticFeedback: true,
    sessionId: null,
};

// 2. Create Context
export const SettingsContext = createContext({
    ...defaultSettings,
    setThresholdScore: () => {},
    setAudioAnnouncements: () => {},
    setHapticFeedback: () => {},
    setSessionId: () => {},
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

    // 4. Provide state + setters
    const value = {
        thresholdScore,
        setThresholdScore,
        audioAnnouncements,
        setAudioAnnouncements,
        hapticFeedback,
        setHapticFeedback,
        sessionId,
        setSessionId,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}
