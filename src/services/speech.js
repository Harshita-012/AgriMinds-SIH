class SpeechService {
  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    this.currentUtterance = null;
    this.listeners = new Set();
  }

  speak(text, lang = 'hi') {
    if (!this.isSupported || !text) {
      console.warn('SpeechSynthesis not supported or empty text');
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    // Pick best voice
    const voices = window.speechSynthesis.getVoices();
    const targetLangCode = lang.startsWith('hi') ? 'hi' : 'en';
    const matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetLangCode));
    
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    
    utterance.lang = lang.startsWith('hi') ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.notify(true);
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      this.notify(false);
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.currentUtterance = null;
      this.notify(false);
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Speech trigger failed:', err);
      this.notify(false);
    }
  }

  stop() {
    if (this.isSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
    this.notify(false);
  }

  isSpeaking() {
    return this.isSupported ? window.speechSynthesis.speaking : false;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(state) {
    this.listeners.forEach(cb => cb(state));
  }
}

export const speech = new SpeechService();
