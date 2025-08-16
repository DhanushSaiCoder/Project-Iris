const synth = window.speechSynthesis;
let voicesLoaded = false;
const speechQueue = []; // Stores { text, id }
let isSpeaking = false;
let statusUpdateCallback = null;

// Check if voices are already loaded on script initialization
if (synth.getVoices().length > 0) {
    voicesLoaded = true;
}

// Listen for voices to be loaded or changed
synth.onvoiceschanged = () => {
    voicesLoaded = true;
    if (statusUpdateCallback) statusUpdateCallback('Voices loaded!');
    if (!isSpeaking) {
        processQueue();
    }
};

const processQueue = () => {
    if (statusUpdateCallback) statusUpdateCallback(`Processing queue. Speaking: ${isSpeaking}, Queue length: ${speechQueue.length}`);
    if (speechQueue.length > 0 && !isSpeaking) {
        const { text, id } = speechQueue.shift();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.2;

        utterance.onstart = () => {
            isSpeaking = true;
            if (statusUpdateCallback) statusUpdateCallback(`Speech started: ${text} (ID: ${id})`);
        };

        utterance.onend = () => {
            isSpeaking = false;
            if (statusUpdateCallback) statusUpdateCallback(`Speech ended: ${text} (ID: ${id})`);
            processQueue();
        };

        utterance.onerror = (event) => {
            console.error('SpeechSynthesisUtterance error:', event.error);
            if (statusUpdateCallback) statusUpdateCallback(`Speech error: ${event.error.message}`);
            isSpeaking = false;
            processQueue();
        };

        synth.speak(utterance);
    } else if (speechQueue.length === 0) {
        if (statusUpdateCallback) statusUpdateCallback('Speech queue is empty.');
    }
};

/**
 * Speaks the given text aloud using the browser's Web Speech API.
 * @param {string} text The text to be spoken.
 * @param {string} id An identifier for the speech, allowing for specific cancellation.
 */
export const speak = (text, id = 'default') => {
    if (statusUpdateCallback) statusUpdateCallback(`Speak called with: ${text} (ID: ${id})`);
    if (!synth || !text) {
        if (statusUpdateCallback) statusUpdateCallback('Synth or text is missing.');
        return;
    }

    if (!voicesLoaded) {
        if (statusUpdateCallback) statusUpdateCallback('Voices not loaded yet, adding to queue.');
        speechQueue.push({ text, id });
        return;
    }

    speechQueue.push({ text, id });
    processQueue();
};

/**
 * Cancels any speech that is currently in progress and optionally clears specific types from the queue.
 * @param {string} id Optional. If provided, only speech with this ID will be removed from the queue.
 *                    If not provided, all speech will be cancelled and the entire queue cleared.
 */
export const cancelSpeech = (id) => {
    if (statusUpdateCallback) statusUpdateCallback(`cancelSpeech called for ID: ${id || 'all'}`);
    if (synth) {
        if (id) {
            // Clear specific items from the queue
            for (let i = speechQueue.length - 1; i >= 0; i--) {
                if (speechQueue[i].id === id) {
                    speechQueue.splice(i, 1);
                }
            }
            // If the currently speaking item has this ID, cancel all speech
            // Note: Web Speech API doesn't allow cancelling by ID, so this stops everything.
            // We rely on the queue clearing for specific cancellation.
            // If you need to stop *only* the current utterance of a specific ID, it's not directly supported.
            // For now, if a specific ID is requested, we only clear future queued items.
            // If no ID is provided, it's a full cancel.
            if (!isSpeaking) {
                // If not speaking, just clearing the queue is enough
            } else {
                // If speaking, and we want to cancel a specific type, we can't without stopping all.
                // So, we only cancel all if no ID is provided (original behavior).
            }
        } else {
            // Original behavior: cancel all and clear queue
            synth.cancel();
            speechQueue.length = 0;
            isSpeaking = false;
        }
        if (statusUpdateCallback) statusUpdateCallback(`Speech cancelled for ID: ${id || 'all'}. Queue length: ${speechQueue.length}`);
    }
};

/**
 * Clears the entire speech queue and stops any ongoing speech.
 * This is equivalent to cancelSpeech() without an ID.
 */
export const clearSpeechQueue = () => {
    cancelSpeech(); // Call the modified cancelSpeech without an ID
};