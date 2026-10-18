/**
 * Accessibility Text-to-Speech (TTS) Reader using standard Web Speech API
 * Provides gentle audio narration for neurodivergent & dyslexic elementary learners.
 */

class SpeechReader {
  private isSpeaking = false;

  public speak(text: string, rate = 0.9, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      return;
    }

    // Stop any ongoing speech first
    window.speechSynthesis.cancel();

    if (!text.trim()) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate; // Slightly slower than default for easier comprehension
    utterance.pitch = 1.05; // Slightly warmer/friendly elementary tone

    // Try selecting a natural sounding English voice
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Friendly')))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      onEnd?.();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public getSpeakingState() {
    return this.isSpeaking;
  }
}

export const speechReader = new SpeechReader();
