/**
 * SchlaganfallFit - Audio & Sprachausgabe Modul
 * 1. Web Audio API: Sanfte Signaltöne ohne zu erschrecken
 * 2. Web Speech API: Deutliche, verlangsamte Sprachausgabe (Deutsch, Tempo 0.8)
 */

class SchlaganfallAudio {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.synth = window.speechSynthesis || null;
        this.speechRate = 0.8; // Standardmäßig verlangsamt für optimale Verständlichkeit
        this.currentUtterance = null;
        this.isSpeaking = false;
        this.germanVoice = null;

        this.initVoice();
        if (this.synth && this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.initVoice();
        }
    }

    /**
     * Sucht eine passende deutsche Stimme
     */
    initVoice() {
        if (!this.synth) return;
        const voices = this.synth.getVoices();
        // Suche zuerst nach hochwertigen deutschen Stimmen
        this.germanVoice = voices.find(v => v.lang.startsWith('de') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Stefan') || v.name.includes('Katja'))) 
            || voices.find(v => v.lang.startsWith('de'))
            || null;
    }

    /**
     * Initialisiert den Web Audio Context bei Nutzerinteraktion
     */
    initAudioContext() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    /**
     * Stummschaltung umschalten
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopSpeaking();
        }
        return this.isMuted;
    }

    /**
     * Ändert die Lesegeschwindigkeit (z. B. 0.7 sehr langsam, 0.8 normal, 1.0 zügig)
     */
    setSpeechRate(rate) {
        this.speechRate = Math.max(0.6, Math.min(1.2, rate));
        return this.speechRate;
    }

    /**
     * Spielt einen sanften Sinuston ab (kein harter Knall)
     */
    playTone(frequency, duration = 0.3, gainVal = 0.12) {
        if (this.isMuted) return;
        try {
            this.initAudioContext();
            if (!this.ctx) return;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

            // Weiches Ein- und Ausblenden (Fade-In / Fade-Out)
            gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(gainVal, this.ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            console.warn('Audio playTone fehlgeschlagen:', e);
        }
    }

    /**
     * Sanfter Signalton bei neuem Schritt
     */
    playStepChime() {
        this.playTone(523.25, 0.25, 0.1); // C5
    }

    /**
     * Harmonischer Doppelton bei erfolgreichem Abschluss
     */
    playSuccessChime() {
        if (this.isMuted) return;
        try {
            this.initAudioContext();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const playNote = (freq, start, dur) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + start);
                gain.gain.setValueAtTime(0.001, now + start);
                gain.gain.exponentialRampToValueAtTime(0.12, now + start + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + start);
                osc.stop(now + start + dur);
            };

            playNote(523.25, 0.0, 0.25); // C5
            playNote(659.25, 0.15, 0.25); // E5
            playNote(783.99, 0.30, 0.45); // G5
        } catch (e) {
            console.warn('Audio playSuccessChime fehlgeschlagen:', e);
        }
    }

    /**
     * Klickton für Countdown
     */
    playTick() {
        this.playTone(440, 0.08, 0.04);
    }

    /**
     * Vorlesefunktion (Text-to-Speech)
     * @param {string} text - Der vorzulesende deutsche Text
     * @param {Function} onStart - Callback bei Start
     * @param {Function} onEnd - Callback bei Ende
     */
    speak(text, onStart = null, onEnd = null) {
        if (!this.synth) {
            console.warn('Web Speech API wird von diesem Browser nicht unterstützt.');
            if (onEnd) onEnd();
            return;
        }

        // Vorherige Ausgabe stoppen
        this.stopSpeaking();

        if (this.isMuted || !text) {
            if (onEnd) onEnd();
            return;
        }

        const cleanText = text.replace(/<[^>]*>?/gm, '').trim();
        if (!cleanText) return;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'de-DE';
        utterance.rate = this.speechRate;
        utterance.pitch = 1.0;

        if (this.germanVoice) {
            utterance.voice = this.germanVoice;
        }

        utterance.onstart = () => {
            this.isSpeaking = true;
            if (onStart) onStart();
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            this.currentUtterance = null;
            if (onEnd) onEnd();
        };

        utterance.onerror = (err) => {
            console.warn('Sprachausgabe Fehler:', err);
            this.isSpeaking = false;
            this.currentUtterance = null;
            if (onEnd) onEnd();
        };

        this.currentUtterance = utterance;
        this.synth.speak(utterance);
    }

    /**
     * Bricht die aktuelle Sprachausgabe sofort ab
     */
    stopSpeaking() {
        if (this.synth) {
            this.synth.cancel();
        }
        this.isSpeaking = false;
        this.currentUtterance = null;
    }
}

// Globale Instanz für die gesamte App
const appAudio = new SchlaganfallAudio();
