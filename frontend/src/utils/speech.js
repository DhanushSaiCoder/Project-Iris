const synth = window.speechSynthesis;

/**
 * Speaks the given text aloud using the browser's Web Speech API.
 * @param {string} text The text to be spoken.
 */
export const speak = (text) => {
    if (synth && text) {
        const utterance = new SpeechSynthesisUtterance(text);
        // Optional: Configure voice, pitch, rate, etc.
        // const voices = synth.getVoices();
        // utterance.voice = voices[0];
        // utterance.pitch = 1;
        // utterance.rate = 1;
        synth.speak(utterance);
    }
};

/**
 * Cancels any speech that is currently in progress.
 */
export const cancelSpeech = () => {
    if (synth) {
        synth.cancel();
    }
};
