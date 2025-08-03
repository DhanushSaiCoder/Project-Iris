const HAPTIC_DEBOUNCE_MS = 1000; // 1 second debounce for haptic feedback
let lastHapticTime = 0;

// Define different haptic patterns
const HAPTIC_PATTERN_MILD = [100]; // Single short pulse
const HAPTIC_PATTERN_MODERATE = [100, 50, 100]; // Double pulse
const HAPTIC_PATTERN_CRITICAL = [200, 100, 200]; // Longer, insistent vibration
const HAPTIC_PATTERN_WARNING = [50]; // Quick, sharp buzz

/**
 * Returns a haptic vibration pattern based on the alert type.
 * @param {string} type The type of alert (e.g., 'mild', 'moderate', 'critical', 'warning').
 * @returns {number | number[]} The vibration pattern.
 */
export const getHapticPattern = (type) => {
    switch (type) {
        case 'mild':
            return HAPTIC_PATTERN_MILD;
        case 'moderate':
            return HAPTIC_PATTERN_MODERATE;
        case 'critical':
            return HAPTIC_PATTERN_CRITICAL;
        case 'warning':
            return HAPTIC_PATTERN_WARNING;
        default:
            return HAPTIC_PATTERN_MILD; // Default to mild if type is unknown
    }
};

/**
 * Triggers haptic feedback (vibration) on devices that support it.
 * Implements a debounce to prevent excessive vibrations.
 * @param {string} type The type of alert (e.g., 'mild', 'moderate', 'critical', 'warning').
 */
export const triggerHapticFeedback = (type) => {
    if (!navigator.vibrate) {
        // console.warn("Haptic feedback not supported on this device.");
        return;
    }

    const currentTime = Date.now();
    if (currentTime - lastHapticTime < HAPTIC_DEBOUNCE_MS) {
        // console.log("Haptic feedback debounced.");
        return;
    }

    const pattern = getHapticPattern(type);
    navigator.vibrate(pattern);
    lastHapticTime = currentTime;
};