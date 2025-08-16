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
    hasSeenDetectionGuidance: false, // New default setting

    // New settings for unidentified obstacle detection
    unidentifiedObstacleAlertEnabled: true,
    unidentifiedObstacleAlertThreshold: 2.0, // meters (T_on)
    unidentifiedObstacleAlertOffThreshold: 2.5, // meters (T_off for hysteresis)
    unidentifiedObstacleAlertCooldown: 2000, // milliseconds
    unidentifiedObstacleAlertConsistencyTime: 250, // milliseconds
    developerModeDebugOverlays: false,
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
    setHasSeenDetectionGuidance: () => {}, // Added missing setter

    // New setters
    setUnidentifiedObstacleAlertEnabled: () => {},
    setUnidentifiedObstacleAlertThreshold: () => {},
    setUnidentifiedObstacleAlertOffThreshold: () => {},
    setUnidentifiedObstacleAlertCooldown: () => {},
    setUnidentifiedObstacleAlertConsistencyTime: () => {},
    setDeveloperModeDebugOverlays: () => {},
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
    const [hasSeenDetectionGuidance, setHasSeenDetectionGuidance] = useState(() => {
        const saved = localStorage.getItem("bw-detection-guidance");
        return saved !== null
            ? JSON.parse(saved)
            : defaultSettings.hasSeenDetectionGuidance;
    });

    // New states for unidentified obstacle detection
    const [unidentifiedObstacleAlertEnabled, setUnidentifiedObstacleAlertEnabled] = useState(() => {
        const saved = localStorage.getItem("bw-unidentified-alert-enabled");
        return saved !== null ? JSON.parse(saved) : defaultSettings.unidentifiedObstacleAlertEnabled;
    });
    const [unidentifiedObstacleAlertThreshold, setUnidentifiedObstacleAlertThreshold] = useState(() => {
        const saved = localStorage.getItem("bw-unidentified-alert-threshold");
        return saved !== null ? JSON.parse(saved) : defaultSettings.unidentifiedObstacleAlertThreshold;
    });
    const [unidentifiedObstacleAlertOffThreshold, setUnidentifiedObstacleAlertOffThreshold] = useState(() => {
        const saved = localStorage.getItem("bw-unidentified-alert-off-threshold");
        return saved !== null ? JSON.parse(saved) : defaultSettings.unidentifiedObstacleAlertOffThreshold;
    });
    const [unidentifiedObstacleAlertCooldown, setUnidentifiedObstacleAlertCooldown] = useState(() => {
        const saved = localStorage.getItem("bw-unidentified-alert-cooldown");
        return saved !== null ? JSON.parse(saved) : defaultSettings.unidentifiedObstacleAlertCooldown;
    });
    const [unidentifiedObstacleAlertConsistencyTime, setUnidentifiedObstacleAlertConsistencyTime] = useState(() => {
        const saved = localStorage.getItem("bw-unidentified-alert-consistency-time");
        return saved !== null ? JSON.parse(saved) : defaultSettings.unidentifiedObstacleAlertConsistencyTime;
    });
    const [developerModeDebugOverlays, setDeveloperModeDebugOverlays] = useState(() => {
        const saved = localStorage.getItem("bw-developer-debug-overlays");
        return saved !== null ? JSON.parse(saved) : defaultSettings.developerModeDebugOverlays;
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
    useEffect(() => {
        localStorage.setItem("bw-detection-guidance", JSON.stringify(hasSeenDetectionGuidance));
    }, [hasSeenDetectionGuidance]);

    // New useEffects for unidentified obstacle detection settings
    useEffect(() => {
        localStorage.setItem("bw-unidentified-alert-enabled", JSON.stringify(unidentifiedObstacleAlertEnabled));
    }, [unidentifiedObstacleAlertEnabled]);
    useEffect(() => {
        localStorage.setItem("bw-unidentified-alert-threshold", JSON.stringify(unidentifiedObstacleAlertThreshold));
    }, [unidentifiedObstacleAlertThreshold]);
    useEffect(() => {
        localStorage.setItem("bw-unidentified-alert-off-threshold", JSON.stringify(unidentifiedObstacleAlertOffThreshold));
    }, [unidentifiedObstacleAlertOffThreshold]);
    useEffect(() => {
        localStorage.setItem("bw-unidentified-alert-cooldown", JSON.stringify(unidentifiedObstacleAlertCooldown));
    }, [unidentifiedObstacleAlertCooldown]);
    useEffect(() => {
        localStorage.setItem("bw-unidentified-alert-consistency-time", JSON.stringify(unidentifiedObstacleAlertConsistencyTime));
    }, [unidentifiedObstacleAlertConsistencyTime]);
    useEffect(() => {
        localStorage.setItem("bw-developer-debug-overlays", JSON.stringify(developerModeDebugOverlays));
    }, [developerModeDebugOverlays]);


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
            hasSeenDetectionGuidance,
            setHasSeenDetectionGuidance,

            // New states and setters
            unidentifiedObstacleAlertEnabled,
            setUnidentifiedObstacleAlertEnabled,
            unidentifiedObstacleAlertThreshold,
            setUnidentifiedObstacleAlertThreshold,
            unidentifiedObstacleAlertOffThreshold,
            setUnidentifiedObstacleAlertOffThreshold,
            unidentifiedObstacleAlertCooldown,
            setUnidentifiedObstacleAlertCooldown,
            unidentifiedObstacleAlertConsistencyTime,
            setUnidentifiedObstacleAlertConsistencyTime,
            developerModeDebugOverlays,
            setDeveloperModeDebugOverlays,
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
            // New dependencies
            unidentifiedObstacleAlertEnabled,
            unidentifiedObstacleAlertThreshold,
            unidentifiedObstacleAlertOffThreshold,
            unidentifiedObstacleAlertCooldown,
            unidentifiedObstacleAlertConsistencyTime,
            developerModeDebugOverlays,
        ]
    );

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}
