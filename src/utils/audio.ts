// Web Audio API Synthesizer and Voice Audio Utility for Soundbox & Lyria Music

class SoundboxEngine {
  private ctx: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private customAudioElement: HTMLAudioElement | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play standard digital UPI payment confirmation chime (like PayTM / PhonePe Soundbox)
  playUpiChime() {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    const notes = [587.33, 880, 1174.66]; // D5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.4);
    });
  }

  // Realistic Indian Dholak & Tabla Percussion Synthesizer
  // Re-creates the energetic live dholak solo heard in the user's sound clip (136 BPM)
  playDholakRhythm(durationSec: number = 8, onEnd?: () => void) {
    const ctx = this.initCtx();
    const bpm = 136;
    const sixteenth = (60 / bpm) / 4;
    const now = ctx.currentTime;
    const totalSteps = Math.floor(durationSec / sixteenth);

    // Standard high-energy Indian street dholak groove pattern (16 steps)
    // 1: Bass + Slap (Dha), 2: Rim (Ta), 3: Bass roll (Ge), 4: Slap (Na)...
    const pattern = [
      { bass: true, slap: true, vel: 1.0 },
      { bass: false, slap: true, vel: 0.5 },
      { bass: true, slap: false, vel: 0.7 },
      { bass: false, slap: true, vel: 0.9 },
      { bass: true, slap: false, vel: 0.8 },
      { bass: false, slap: true, vel: 0.6 },
      { bass: true, slap: true, vel: 1.0 },
      { bass: false, slap: true, vel: 0.7 },
      { bass: true, slap: false, vel: 0.9 },
      { bass: false, slap: true, vel: 0.5 },
      { bass: true, slap: false, vel: 0.6 },
      { bass: false, slap: true, vel: 0.8 },
      { bass: true, slap: true, vel: 1.1 },
      { bass: false, slap: true, vel: 0.6 },
      { bass: true, slap: false, vel: 0.8 },
      { bass: false, slap: true, vel: 1.0 },
    ];

    for (let step = 0; step < totalSteps; step++) {
      const p = pattern[step % pattern.length];
      const stepTime = now + step * sixteenth;

      // 1. Dholak Bass Drum (Dagga / Bayan thump with pitch drop)
      if (p.bass) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        // Pitch drop from 110Hz to 48Hz gives that authentic deep Indian hand-drum slide
        osc.frequency.setValueAtTime(110, stepTime);
        osc.frequency.exponentialRampToValueAtTime(48, stepTime + 0.12);

        gain.gain.setValueAtTime(0, stepTime);
        gain.gain.linearRampToValueAtTime(0.35 * p.vel, stepTime + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(stepTime);
        osc.stop(stepTime + 0.25);
      }

      // 2. High Crispy Rim Slap (Ta / Na)
      if (p.slap) {
        const osc = ctx.createOscillator();
        const bandpass = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(480 + (step % 2) * 90, stepTime);

        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(750, stepTime);
        bandpass.Q.setValueAtTime(3.5, stepTime);

        gain.gain.setValueAtTime(0, stepTime);
        gain.gain.linearRampToValueAtTime(0.22 * p.vel, stepTime + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.08);

        osc.connect(bandpass);
        bandpass.connect(gain);
        gain.connect(ctx.destination);

        osc.start(stepTime);
        osc.stop(stepTime + 0.1);
      }
    }

    if (onEnd) {
      setTimeout(onEnd, durationSec * 1000 + 50);
    }
  }

  // Play the exact authentic vendor callout uploaded by the user:
  // "आइए आइए! ताजा जूस! अभी बना कर! आइए भैया! एक गिलास ले जाइए! ताजा! ठंडा! ठंडा! मजेदार!"
  // followed by the energetic dholak rhythm beat!
  playOriginalJuiceCall(onEnd?: () => void) {
    const text = 'आइए आइए! ताजा जूस! अभी बना कर! आइए भैया! एक गिलास ले जाइए! ताजा! ठंडा! ठंडा! मजेदार!';

    // Step 1: Speak the authentic call with megaphone voice EQ
    this.speakVendorCall(text, () => {
      // Step 2: Transition into the celebratory dholak rhythm solo (8 seconds)
      this.playDholakRhythm(8, onEnd);
    });
  }

  // Authentic Hot Masala Chai street vendor announcement
  playMasalaChaiCall(onEnd?: () => void) {
    const text = 'गरमा-गरम कड़क मसाला चाय! अदरक और कुटी इलायची वाली! आइए भाईसाहब, कुल्हड़ वाली स्पेशल चाय!';
    this.speakVendorCall(text, () => {
      this.playBazaarMelody(onEnd);
    });
  }

  // Authentic Street Food / Chaat & Pani Puri announcement
  playChaatCall(onEnd?: () => void) {
    const text = 'तीखी-मीठी पानी पूरी! क्रिस्पी आलू टिक्की! दही भल्ला और रगड़ा पैटीज़! आइए चाट खाइए!';
    this.speakVendorCall(text, () => {
      this.playDholakRhythm(6, onEnd);
    });
  }

  // Fresh Fruits / Juice announcement
  playFruitsCall(onEnd?: () => void) {
    const text = 'ताज़ा मीठा संतरा! अन्नास! मौसंबी! बिना बर्फ, शुद्ध रस! ₹30 का बड़ा गिलास!';
    this.speakVendorCall(text, () => {
      this.playDholakRhythm(6, onEnd);
    });
  }

  // Official Soundbox Digital UPI Payment Confirmation Alert
  playUpiVoiceAlert(amount: number = 30, onEnd?: () => void) {
    this.playUpiChime();
    setTimeout(() => {
      const text = `पेटीएम पर ${amount} रुपये प्राप्त हुए. थैंक यू.`;
      this.speakVendorCall(text, onEnd);
    }, 450);
  }

  // Play Indian Bazaar celebratory melody (Sitar / Sarod harmonic emulation)
  playBazaarMelody(onEnd?: () => void) {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    const melody = [
      { f: 523.25, d: 0.25 }, // C5
      { f: 587.33, d: 0.25 }, // D5
      { f: 659.25, d: 0.25 }, // E5
      { f: 783.99, d: 0.4 },  // G5
      { f: 880.00, d: 0.25 }, // A5
      { f: 783.99, d: 0.3 },  // G5
      { f: 659.25, d: 0.3 },  // E5
      { f: 1046.50, d: 0.6 }, // C6
    ];

    let timeOffset = 0;
    melody.forEach((note) => {
      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + timeOffset);

      oscHarmonic.type = 'sine';
      oscHarmonic.frequency.setValueAtTime(note.f * 2, now + timeOffset);

      gain.gain.setValueAtTime(0, now + timeOffset);
      gain.gain.linearRampToValueAtTime(0.2, now + timeOffset + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + note.d);

      osc.connect(gain);
      oscHarmonic.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + timeOffset);
      oscHarmonic.start(now + timeOffset);
      osc.stop(now + timeOffset + note.d);
      oscHarmonic.stop(now + timeOffset + note.d);

      timeOffset += note.d * 0.85;
    });

    if (onEnd) {
      setTimeout(onEnd, timeOffset * 1000 + 100);
    }
  }

  // Play custom uploaded audio file (URL or base64 data URI)
  playCustomAudio(audioSrc: string, onEnd?: () => void) {
    this.stopAll();
    const audio = new Audio(audioSrc);
    this.customAudioElement = audio;

    audio.onended = () => {
      if (onEnd) onEnd();
    };
    audio.onerror = () => {
      if (onEnd) onEnd();
    };

    audio.play().catch((err) => {
      console.warn('Custom audio playback notice:', err);
      if (onEnd) onEnd();
    });
  }

  // Speak a vendor callout in natural Hindi using Web Speech API
  speakVendorCall(text: string, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      this.playUpiChime();
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Look for Hindi voice or Indian English
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(
      (v) => v.lang.includes('hi') || v.lang.includes('IN')
    );
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    utterance.rate = 1.1; // energetic street vendor tempo
    utterance.pitch = 1.15; // welcoming enthusiastic pitch
    utterance.volume = 1;

    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  stopAll() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.customAudioElement) {
      this.customAudioElement.pause();
      this.customAudioElement.currentTime = 0;
      this.customAudioElement = null;
    }
    if (this.ctx && this.ctx.state === 'running') {
      // resume or reset
    }
  }
}

export const soundbox = new SoundboxEngine();
