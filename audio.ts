// Child Narrator Voice & Interactive Sound Manager for Preschoolers (Ages 3–6)

export const ANIMAL_AUDIO_MAP: Record<string, string> = {};

export type VoicePersonaId = 'girl_10' | 'boy_10' | 'teacher_female' | 'teen_girl' | 'teen_boy';

export interface VoicePersona {
  id: VoicePersonaId;
  name: string;
  shortName: string;
  avatar: string;
  tag: string;
  gender: 'female' | 'male';
  pitch: number;
  rate: number;
  description: string;
  sampleText: string;
}

export const VOICE_PERSONAS: VoicePersona[] = [
  {
    id: 'girl_10',
    name: 'Girl (Lily)',
    shortName: 'Girl',
    avatar: '👧',
    tag: 'Sweet & Cheerful',
    gender: 'female',
    pitch: 1.55, // Sweet, bright, cheerful girl pitch
    rate: 1.02,
    description: 'Sweet, bright & friendly kid voice',
    sampleText: 'Hi! I am Lily! Let us play and learn together!',
  },
  {
    id: 'boy_10',
    name: 'Boy (Leo)',
    shortName: 'Boy',
    avatar: '👦',
    tag: 'Energetic & Cool',
    gender: 'male',
    pitch: 0.88, // Distinct energetic boy pitch
    rate: 1.05,
    description: 'Energetic, cheerful & friendly boy voice',
    sampleText: 'Hey buddy! I am Leo! Ready for an awesome game?',
  },
  {
    id: 'teacher_female',
    name: 'Teacher (Miss Sarah)',
    shortName: 'Teacher',
    avatar: '👩‍🏫',
    tag: 'Warm & Gentle',
    gender: 'female',
    pitch: 1.00, // Exact original gentle preschool teacher storyteller pitch
    rate: 0.88, // Gentle, calm preschool teacher pace
    description: 'Gentle, calm & patient preschool teacher voice',
    sampleText: 'Hello little learner! Let us explore together today!',
  },
];

class SoundManager {
  private audioCtx: AudioContext | null = null;
  public enabled: boolean = true;
  private childVoice: SpeechSynthesisVoice | null = null;
  private femaleVoice: SpeechSynthesisVoice | null = null;
  private maleVoice: SpeechSynthesisVoice | null = null;
  private currentPersonaId: VoicePersonaId = 'girl_10';

  // Background music audio node references
  private bgMusicGainNode: GainNode | null = null;
  private isBgMusicPlaying: boolean = false;
  private bgTimerId: any = null;
  private isDucked: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        let savedPersona = localStorage.getItem('playroom_voice_persona') as VoicePersonaId;
        // Backward compatibility mappings
        if (savedPersona === 'teen_girl') savedPersona = 'girl_10';
        if (savedPersona === 'teen_boy') savedPersona = 'boy_10';

        if (savedPersona && VOICE_PERSONAS.some((p) => p.id === savedPersona)) {
          this.currentPersonaId = savedPersona;
        }

        const savedSound = localStorage.getItem('playroom_sound_enabled');
        if (savedSound !== null) {
          this.enabled = savedSound !== 'false';
        }
      } catch (e) {
        // LocalStorage access guard
      }
    }
    this.initVoice();
    this.setupGlobalClickUnlocker();
  }

  public isSoundEnabled(): boolean {
    return this.enabled;
  }

  public setSoundEnabled(val: boolean): void {
    this.enabled = val;
    if (!val) {
      this.stopBackgroundMusic();
      this.stopSpeech();
      this.stopNurserySong();
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('playroom_sound_enabled', val ? 'true' : 'false');
        window.dispatchEvent(
          new CustomEvent('playroom_sound_toggle', { detail: { enabled: val } })
        );
      } catch (e) {
        // storage guard
      }
    }
  }

  public toggleSound(): boolean {
    this.setSoundEnabled(!this.enabled);
    return this.enabled;
  }

  // Auto-start audio context & background music on first user click/touch
  private setupGlobalClickUnlocker() {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      this.getContext();
      this.startBackgroundMusic();
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('click', unlock);
    window.addEventListener('touchstart', unlock);
    window.addEventListener('keydown', unlock);
  }

  // Helper to accurately detect if a browser voice is male
  private isVoiceMale(v: SpeechSynthesisVoice): boolean {
    const s = `${v.name} ${v.voiceURI || ''}`.toLowerCase();
    const maleHints = [
      'male',
      'david',
      'mark',
      'alex',
      'guy',
      'george',
      'daniel',
      'james',
      'oliver',
      'rishi',
      'fred',
      'bruce',
      'junior',
      'tom',
      'ralph',
      'albert',
      'uk english male',
      'english male',
      '#male',
      '-male',
      '_male',
    ];
    return maleHints.some((hint) => s.includes(hint)) && !s.includes('female');
  }

  // Helper to accurately detect if a browser voice is female
  private isVoiceFemale(v: SpeechSynthesisVoice): boolean {
    const s = `${v.name} ${v.voiceURI || ''}`.toLowerCase();
    const femaleHints = [
      'female',
      'samantha',
      'karen',
      'victoria',
      'zira',
      'jenny',
      'ava',
      'allison',
      'moira',
      'veena',
      'heera',
      'fiona',
      'susan',
      'google us english',
      'uk english female',
      '#female',
      '-female',
      '_female',
    ];
    return femaleHints.some((hint) => s.includes(hint)) || !this.isVoiceMale(v);
  }

  // Initialize SpeechSynthesis voice selection with distinctly resolved Female and Male voices
  private initVoice() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoiceList = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      // 1. Resolve Best Female Voice
      const femaleCandidates = voices.filter((v) => this.isVoiceFemale(v));
      const preferredFemaleNames = ['samantha', 'jenny', 'zira', 'karen', 'victoria', 'ava', 'allison', 'google us english'];
      
      const chosenFemale =
        femaleCandidates.find((v) =>
          preferredFemaleNames.some((f) => v.name.toLowerCase().includes(f))
        ) ||
        femaleCandidates.find((v) => v.lang === 'en-US' || v.lang.startsWith('en')) ||
        femaleCandidates[0] ||
        voices.find((v) => v.lang.startsWith('en')) ||
        voices[0];

      // 2. Resolve Best Male Voice
      const maleCandidates = voices.filter((v) => this.isVoiceMale(v));
      let chosenMale: SpeechSynthesisVoice | null = null;
      if (maleCandidates.length > 0) {
        chosenMale =
          maleCandidates.find((v) => v.lang === 'en-US' || v.lang.startsWith('en')) ||
          maleCandidates[0];
      } else {
        // Fallback: If no explicit male voice found in names, pick a different English voice from female
        chosenMale =
          voices.find((v) => v !== chosenFemale && (v.lang === 'en-US' || v.lang.startsWith('en'))) ||
          null;
      }

      this.femaleVoice = chosenFemale || null;
      this.maleVoice = chosenMale;
      this.childVoice = (this.currentPersonaId === 'boy_10' || (this.currentPersonaId as string) === 'teen_boy')
        ? (this.maleVoice || this.femaleVoice)
        : this.femaleVoice;
    };

    updateVoiceList();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoiceList;
    }
  }

  public getActivePersona(): VoicePersona {
    const current = (this.currentPersonaId === 'teen_girl')
      ? 'girl_10'
      : (this.currentPersonaId === 'teen_boy')
      ? 'boy_10'
      : this.currentPersonaId;

    return VOICE_PERSONAS.find((p) => p.id === current) || VOICE_PERSONAS[0];
  }

  public getAllPersonas(): VoicePersona[] {
    return VOICE_PERSONAS;
  }

  public getVoiceAndTone(personaId: VoicePersonaId): {
    voice: SpeechSynthesisVoice | null;
    pitch: number;
    rate: number;
  } {
    const isBoy = personaId === 'boy_10' || (personaId as string) === 'teen_boy';
    const isGirl = personaId === 'girl_10' || (personaId as string) === 'teen_girl';

    if (isBoy) {
      if (this.maleVoice) {
        // Genuine male voice: bright boyish tone
        return { voice: this.maleVoice, pitch: 1.25, rate: 1.05 };
      }
      // If no separate male voice on device, pitch down so boy sounds punchy, deeper, and completely distinct from girl & teacher
      const fallback = this.childVoice || this.femaleVoice;
      return { voice: fallback, pitch: 0.85, rate: 1.04 };
    }

    if (isGirl) {
      // Girl: Very bright, high, cheerful tone
      const voice = this.femaleVoice || this.childVoice;
      return { voice, pitch: 1.55, rate: 1.02 };
    }

    // Teacher (Miss Sarah): Exact original gentle preschool teacher voice
    return { voice: this.femaleVoice, pitch: 1.00, rate: 0.88 };
  }

  public getVoiceForPersona(personaId: VoicePersonaId): SpeechSynthesisVoice | null {
    return this.getVoiceAndTone(personaId).voice;
  }

  public setVoicePersona(id: VoicePersonaId, announce: boolean = false): void {
    const targetId = (id === 'teen_girl') ? 'girl_10' : (id === 'teen_boy') ? 'boy_10' : id;
    if (!VOICE_PERSONAS.some((p) => p.id === targetId)) return;
    this.currentPersonaId = targetId;

    const tone = this.getVoiceAndTone(targetId);
    this.childVoice = tone.voice;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('playroom_voice_persona', targetId);
        window.dispatchEvent(
          new CustomEvent('playroom_voice_changed', { detail: { personaId: targetId } })
        );
      } catch (e) {
        // Storage guard
      }
    }

    if (announce) {
      const persona = this.getActivePersona();
      this.speak(persona.sampleText);
    }
  }

  public previewVoice(id: VoicePersonaId): void {
    const targetId = (id === 'teen_girl') ? 'girl_10' : (id === 'teen_boy') ? 'boy_10' : id;
    const persona = VOICE_PERSONAS.find((p) => p.id === targetId) || this.getActivePersona();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      this.duckBackgroundMusic();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();

      const tone = this.getVoiceAndTone(targetId);
      const utterance = new SpeechSynthesisUtterance(persona.sampleText);
      utterance.rate = tone.rate;
      utterance.pitch = tone.pitch;
      utterance.lang = 'en-US';

      if (tone.voice) {
        utterance.voice = tone.voice;
      }

      const onDone = () => {
        this.restoreBackgroundMusic();
      };
      utterance.onend = onDone;
      utterance.onerror = onDone;

      setTimeout(() => {
        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
          window.speechSynthesis.speak(utterance);
        } catch {
          onDone();
        }
      }, 50);
    } catch {
      this.restoreBackgroundMusic();
    }
  }

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  // --- SUBTLE PRE-SCHOOL BACKGROUND MUSIC SYNTHESIZER ---
  public startBackgroundMusic() {
    if (this.isBgMusicPlaying || !this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isBgMusicPlaying = true;
    this.bgMusicGainNode = ctx.createGain();
    // Default soft volume: 0.035
    const targetGain = this.isDucked ? 0.008 : 0.035;
    this.bgMusicGainNode.gain.setValueAtTime(targetGain, ctx.currentTime);
    this.bgMusicGainNode.connect(ctx.destination);

    // Pentatonic Major gentle lullaby notes (C4, E4, G4, A4, C5, D5, E5, G5)
    const freqs = [261.63, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
    const pattern = [0, 2, 4, 3, 1, 5, 4, 2, 0, 3, 2, 6, 4, 1, 3, 0];
    let noteIdx = 0;

    const playNextNote = () => {
      if (!this.isBgMusicPlaying || !this.bgMusicGainNode || !this.enabled) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        // Warm soft sine/triangle hybrid note for gentle marimba/bell sound
        osc.type = 'triangle';
        const freq = freqs[pattern[noteIdx % pattern.length]];
        osc.frequency.setValueAtTime(freq, now);

        // Gentle envelope
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.25, now + 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(noteGain);
        noteGain.connect(this.bgMusicGainNode);

        osc.start(now);
        osc.stop(now + 1.25);

        noteIdx++;
      } catch {
        // ignore
      }

      this.bgTimerId = setTimeout(playNextNote, 650);
    };

    playNextNote();
  }

  public stopBackgroundMusic() {
    this.isBgMusicPlaying = false;
    if (this.bgTimerId) {
      clearTimeout(this.bgTimerId);
      this.bgTimerId = null;
    }
    if (this.bgMusicGainNode) {
      try {
        this.bgMusicGainNode.disconnect();
      } catch {
        // ignore
      }
      this.bgMusicGainNode = null;
    }
  }

  // Lower bg music when narration/speech is active
  public duckBackgroundMusic() {
    this.isDucked = true;
    if (this.bgMusicGainNode && this.audioCtx) {
      try {
        this.bgMusicGainNode.gain.setValueAtTime(0.008, this.audioCtx.currentTime);
      } catch {
        // ignore
      }
    }
  }

  // Restore bg music when narration finishes
  public restoreBackgroundMusic() {
    this.isDucked = false;
    if (this.bgMusicGainNode && this.audioCtx) {
      try {
        this.bgMusicGainNode.gain.setValueAtTime(0.035, this.audioCtx.currentTime);
      } catch {
        // ignore
      }
    }
  }

  // Play cheerful button click / pop sound
  playPop() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Audio context fallback
    }
  }

  // Play cute cartoon eating / munching sound
  playMunch() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const munches = [
        { freq: 480, endFreq: 340, time: 0, dur: 0.1 },
        { freq: 520, endFreq: 380, time: 0.12, dur: 0.1 },
        { freq: 620, endFreq: 440, time: 0.24, dur: 0.14 },
      ];

      munches.forEach((m) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(m.freq, ctx.currentTime + m.time);
        osc.frequency.exponentialRampToValueAtTime(m.endFreq, ctx.currentTime + m.time + m.dur);

        gain.gain.setValueAtTime(0.22, ctx.currentTime + m.time);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + m.time + m.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + m.time);
        osc.stop(ctx.currentTime + m.time + m.dur);
      });
    } catch {
      // Audio context fallback
    }
  }

  // Play soft sparkle chime / reinforcement music for correct answers
  playSuccess() {
    this.playReinforcementMusic();
  }

  // Play rich upbeat reinforcement music chime on correct answer
  playReinforcementMusic() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Upbeat 5-note ascending major chime arpeggio: C5, E5, G5, C6, E6
      const notes = [
        { freq: 523.25, time: 0, dur: 0.32, gain: 0.22 },
        { freq: 659.25, time: 0.07, dur: 0.34, gain: 0.22 },
        { freq: 783.99, time: 0.14, dur: 0.36, gain: 0.24 },
        { freq: 1046.5, time: 0.21, dur: 0.42, gain: 0.26 },
        { freq: 1318.51, time: 0.28, dur: 0.48, gain: 0.22 },
      ];

      notes.forEach((n) => {
        // Primary warm chime
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.time);

        gain.gain.setValueAtTime(n.gain, ctx.currentTime + n.time);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.time + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + n.time);
        osc.stop(ctx.currentTime + n.time + n.dur);

        // Shimmering bell harmonic layer
        const oscHarmonic = ctx.createOscillator();
        const gainHarmonic = ctx.createGain();

        oscHarmonic.type = 'sine';
        oscHarmonic.frequency.setValueAtTime(n.freq * 2, ctx.currentTime + n.time);

        gainHarmonic.gain.setValueAtTime(n.gain * 0.35, ctx.currentTime + n.time);
        gainHarmonic.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.time + (n.dur * 0.7));

        oscHarmonic.connect(gainHarmonic);
        gainHarmonic.connect(ctx.destination);

        oscHarmonic.start(ctx.currentTime + n.time);
        oscHarmonic.stop(ctx.currentTime + n.time + (n.dur * 0.7));
      });
    } catch {
      // Audio context fallback
    }
  }

  // Play magical star catch glockenspiel chime
  playStarCatch() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Ascending high crystal bell chime: G5, C6, E6, G6
      const chimes = [783.99, 1046.5, 1318.51, 1567.98];
      chimes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.24, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.38);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.4);
      });
    } catch {
      // Audio context fallback
    }
  }

  // Play soft twinkling sparkle sound
  playStarTwinkle() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1174.66, ctx.currentTime); // D6
      osc.frequency.exponentialRampToValueAtTime(1760.0, ctx.currentTime + 0.12); // A6

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio context fallback
    }
  }

  // Play satisfying clean room tidy snap chime
  playTidySnap() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Warm xylophone double-pop: E5 -> A5
      const notes = [659.25, 880.0];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(0.22, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.3);
      });
    } catch {
      // Audio context fallback
    }
  }

  // Play magical sparkle sweep when room is fully cleaned
  playSparkleSweep() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const arpeggio = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      arpeggio.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.4);
      });
    } catch {
      // Audio context fallback
    }
  }

  // Play happy celebration fanfare after activity completion
  playCelebration() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const melody = [523.25, 659.25, 783.99, 880, 1046.5]; // C5, E5, G5, A5, C6
      melody.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1);

        gain.gain.setValueAtTime(0.25, ctx.currentTime + index * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + index * 0.1 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + index * 0.1);
        osc.stop(ctx.currentTime + index * 0.1 + 0.35);
      });
    } catch {
      // Audio context fallback
    }
  }

  // Play gentle, non-scary error sound for incorrect choices
  playError() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // Audio context fallback
    }
  }

  // Play crisp scissors snip / string release sound for kite cutting
  playSnipCut() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // High quick dual snap for scissors snip
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1600, now);
      osc1.frequency.exponentialRampToValueAtTime(800, now + 0.05);

      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.06);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2200, now + 0.04);
      osc2.frequency.exponentialRampToValueAtTime(1100, now + 0.09);

      gain2.gain.setValueAtTime(0.25, now + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.04);
      osc2.stop(now + 0.1);
    } catch {
      // Audio context fallback
    }
  }

  // Play soft wind whoosh as kite flies away upward into the sky
  playKiteFlyAway() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.28);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Audio context fallback
    }
  }

  // Play traffic light switch chime
  playTrafficLightSwitch() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio context fallback
    }
  }

  // Play cute cartoon car beep beep
  playCarHonk() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [0, 0.1].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(580, now + delay);

        gain.gain.setValueAtTime(0.18, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.07);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.07);
      });
    } catch {
      // Audio context fallback
    }
  }

  // Play gentle vehicle brake squeak
  playBrakeStop() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Audio context fallback
    }
  }

  // Play playful sound effect for animal or shape fallback
  playAnimalTone(soundType: string) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (soundType.includes('roar') || soundType.includes('lion')) {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.3);
      } else if (soundType.includes('duck') || soundType.includes('quack')) {
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.setValueAtTime(250, ctx.currentTime + 0.15);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
      }

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio fallback
    }
  }

  // Stop any active text-to-speech synthesis immediately
  stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Fallback
      }
    }
    this.restoreBackgroundMusic();
  }

  /**
   * Speak text using Web Speech API with active Voice Persona (Teen Girl, Teen Boy, or Teacher).
   */
  speak(text: string, onEnd?: () => void) {
    if (!this.enabled) {
      if (onEnd) onEnd();
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        // Duck background music while speaking so narration is crisp and loud
        this.duckBackgroundMusic();

        // Resume if speech synthesis engine is paused or stuck
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        // Cancel previous speech to prevent overlapping or stale audio
        window.speechSynthesis.cancel();

        const activePersona = this.getActivePersona();
        const tone = this.getVoiceAndTone(activePersona.id);
        const utterance = new SpeechSynthesisUtterance(text);

        // Set parameters based on the chosen voice persona and resolved tone
        utterance.rate = tone.rate;
        utterance.pitch = tone.pitch;
        utterance.lang = 'en-US';

        if (tone.voice) {
          utterance.voice = tone.voice;
        }

        let hasCalled = false;
        const triggerEnd = () => {
          this.restoreBackgroundMusic();
          if (!hasCalled) {
            hasCalled = true;
            if (onEnd) onEnd();
          }
        };

        utterance.onend = triggerEnd;
        utterance.onerror = triggerEnd;

        // 50ms delay after cancel() ensures Chrome & WebKit process cancel before queueing speak()
        setTimeout(() => {
          try {
            if (window.speechSynthesis.paused) {
              window.speechSynthesis.resume();
            }
            window.speechSynthesis.speak(utterance);
          } catch {
            triggerEnd();
          }
        }, 50);
      } catch {
        this.restoreBackgroundMusic();
        if (onEnd) onEnd();
      }
    } else {
      if (onEnd) onEnd();
    }
  }

  private songAnimFrame: number | null = null;
  private songStartTime: number = 0;
  private isSongPlaying: boolean = false;

  public resumeContext(): AudioContext | null {
    return this.getContext();
  }

  public unlockMobileAudio(audioElement?: HTMLAudioElement | null) {
    const ctx = this.getContext();
    if (ctx) {
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      try {
        const silentBuffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = silentBuffer;
        source.connect(ctx.destination);
        source.start(0);
      } catch {
        // ignore
      }
    }

    if (audioElement) {
      try {
        audioElement.setAttribute('playsinline', 'true');
        audioElement.setAttribute('webkit-playsinline', 'true');
      } catch {
        // ignore
      }
    }
  }

  public isNurserySongPlaying(): boolean {
    return this.isSongPlaying;
  }

  public getNurserySongElapsed(): number {
    if (!this.isSongPlaying || !this.audioCtx) return 0;
    const elapsed = this.audioCtx.currentTime - this.songStartTime;
    return Number.isFinite(elapsed) && elapsed > 0 ? elapsed : 0;
  }

  private songSourceNode: AudioBufferSourceNode | null = null;
  private cachedAudioBuffer: AudioBuffer | null = null;
  private cachedAudioUrl: string | null = null;

  public async preloadSongBuffer(url: string = '/rhyme.mp3', forceReload: boolean = false) {
    const ctx = this.getContext();
    if (!ctx) return;
    if (this.cachedAudioBuffer && this.cachedAudioUrl === url && !forceReload) return;
    try {
      const res = await fetch(url);
      const arrayBuffer = await res.arrayBuffer();
      this.cachedAudioBuffer = await ctx.decodeAudioData(arrayBuffer);
      this.cachedAudioUrl = url;
    } catch (err) {
      console.warn('Failed to load nursery song buffer:', err);
    }
  }

  async playNurserySong(startFromSec: number = 0, audioUrl?: string, onProgress?: (sec: number) => void, onEnded?: () => void) {
    this.stopNurserySong();
    const ctx = this.getContext();
    if (!ctx) return;

    if (!this.cachedAudioBuffer || (audioUrl && this.cachedAudioUrl !== audioUrl)) {
      await this.preloadSongBuffer(audioUrl || '/rhyme.mp3');
    }

    this.isSongPlaying = true;
    const safeStartSec = Number.isFinite(startFromSec) && startFromSec > 0 ? startFromSec : 0;
    this.songStartTime = ctx.currentTime - safeStartSec;

    if (this.cachedAudioBuffer) {
      try {
        const source = ctx.createBufferSource();
        source.buffer = this.cachedAudioBuffer;
        source.connect(ctx.destination);
        source.start(0, safeStartSec);
        this.songSourceNode = source;

        source.onended = () => {
          if (this.isSongPlaying) {
            this.isSongPlaying = false;
            if (onEnded) onEnded();
          }
        };
      } catch (e) {
        console.warn('Web Audio buffer source start error:', e);
      }
    }

    const totalDuration = this.cachedAudioBuffer ? this.cachedAudioBuffer.duration : 39.0;

    const updateLoop = () => {
      if (!this.isSongPlaying || !this.audioCtx) return;
      const elapsed = this.audioCtx.currentTime - this.songStartTime;
      if (onProgress) onProgress(elapsed);

      if (elapsed >= totalDuration) {
        this.stopNurserySong();
        if (onEnded) onEnded();
      } else {
        this.songAnimFrame = requestAnimationFrame(updateLoop);
      }
    };

    this.songAnimFrame = requestAnimationFrame(updateLoop);
  }

  stopNurserySong() {
    this.isSongPlaying = false;
    if (this.songSourceNode) {
      try {
        this.songSourceNode.stop();
        this.songSourceNode.disconnect();
      } catch {
        // ignore
      }
      this.songSourceNode = null;
    }
    if (this.songAnimFrame) {
      cancelAnimationFrame(this.songAnimFrame);
      this.songAnimFrame = null;
    }
  }
}

export const soundManager = new SoundManager();

