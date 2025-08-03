const HAPTIC_DEBOUNCE_MS = 1000; // 1 second debounce for haptic feedback
let lastHapticTime = 0;

/**
 * Triggers haptic feedback (vibration) on devices that support it.
 * Implements a debounce to prevent excessive vibrations.
 * @param {number | number[]} pattern A single number for duration in milliseconds, or an array of durations and pauses.
 */
export const triggerHapticFeedback = (pattern) => {
    if (!navigator.vibrate) {
        // console.warn("Haptic feedback not supported on this device.");
        return;
    }

    const currentTime = Date.now();
    if (currentTime - lastHapticTime < HAPTIC_DEBOUNCE_MS) {
        // console.log("Haptic feedback debounced.");
        return;
    }

    navigator.vibrate(pattern);
    lastHapticTime = currentTime;
};
