const synth = window.speechSynthesis;
let voicesLoaded = false;
const speechQueue = [];
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
        const text = speechQueue.shift();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.2;

        utterance.onstart = () => {
            isSpeaking = true;
            if (statusUpdateCallback) statusUpdateCallback(`Speech started: ${text}`);
        };

        utterance.onend = () => {
            isSpeaking = false;
            if (statusUpdateCallback) statusUpdateCallback(`Speech ended: ${text}`);
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
 */
export const speak = (text) => {
    if (statusUpdateCallback) statusUpdateCallback(`Speak called with: ${text}`);
    if (!synth || !text) {
        if (statusUpdateCallback) statusUpdateCallback('Synth or text is missing.');
        return;
    }

    if (!voicesLoaded) {
        if (statusUpdateCallback) statusUpdateCallback('Voices not loaded yet, adding to queue.');
        speechQueue.push(text);
        return;
    }

    speechQueue.push(text);
    processQueue();
};

/**
 * Cancels any speech that is currently in progress.
 * Does NOT clear the queue.
 */
export const cancelSpeech = () => {
    if (statusUpdateCallback) statusUpdateCallback('cancelSpeech called.');
    if (synth) {
        synth.cancel();
        if (statusUpdateCallback) statusUpdateCallback('Current speech cancelled.');
    }
};

/**
 * Clears the entire speech queue and stops any ongoing speech.
 */
export const clearSpeechQueue = () => {
    if (statusUpdateCallback) statusUpdateCallback('clearSpeechQueue called.');
    if (synth) {
        synth.cancel();
        speechQueue.length = 0;
        isSpeaking = false;
        if (statusUpdateCallback) statusUpdateCallback('Speech queue cleared and current speech cancelled.');
    }
};

/**
 * Sets a callback function to receive speech status updates.
 * @param {function} callback The function to call with status messages.
 */
export const setSpeechStatusCallback = (callback) => {
    statusUpdateCallback = callback;
};