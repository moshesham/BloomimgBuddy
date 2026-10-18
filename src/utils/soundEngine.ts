/**
 * Calm Procedural Sound Engine using Native Web Audio API
 * Provides low-stimulus acoustic feedback and peaceful ambient soundscapes.
 * Completely self-contained: requires zero external audio files.
 */

class CalmSoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private ambientSourceNodes: AudioNode[] = [];
  private currentSoundscape: string = 'none';
  private isMuted: boolean = false;
  private volume: number = 0.4;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        this.ambientGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Tactile soft wood click for button taps and manipulative tokens
   */
  public playSoftTap() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // Audio context might be restricted
    }
  }

  /**
   * Gentle, soothing harmonic chime (pentatonic scale note) on positive step
   */
  public playHarmonicChime(noteIndex = 0) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      // Pentatonic scale (C4, D4, E4, G4, A4, C5, D5)
      const freqs = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33];
      const freq = freqs[noteIndex % freqs.length];

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Warm overtone for acoustic fullness
      const overtone = this.ctx.createOscillator();
      const overtoneGain = this.ctx.createGain();
      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(freq * 2, now);
      overtoneGain.gain.setValueAtTime(0.04, now);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      // Soft envelope: 40ms attack, 900ms smooth release
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      osc.connect(gain);
      gain.connect(this.masterGain);

      overtone.connect(overtoneGain);
      overtoneGain.connect(this.masterGain);

      osc.start(now);
      overtone.start(now);

      osc.stop(now + 1.0);
      overtone.stop(now + 1.0);
    } catch {
      // Ignore audio interruptions
    }
  }

  /**
   * Continuous procedural ambient soundscapes
   */
  public setAmbientSoundscape(type: 'none' | 'gentle_rain' | 'forest_breeze' | 'singing_bowl') {
    if (this.currentSoundscape === type) return;
    this.stopAmbient();
    this.currentSoundscape = type;

    if (type === 'none' || this.isMuted) return;

    try {
      this.initContext();
      if (!this.ctx || !this.ambientGain) return;

      if (type === 'gentle_rain') {
        this.startGentleRain();
      } else if (type === 'forest_breeze') {
        this.startForestBreeze();
      } else if (type === 'singing_bowl') {
        this.startSingingBowlDrone();
      }
    } catch {
      // Audio autoplay policy
    }
  }

  private stopAmbient() {
    this.ambientSourceNodes.forEach((node) => {
      try {
        if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          (node as AudioScheduledSourceNode).stop();
        }
        node.disconnect();
      } catch {
        // Disconnect safely
      }
    });
    this.ambientSourceNodes = [];
  }

  private startGentleRain() {
    if (!this.ctx || !this.ambientGain) return;

    // Generate 3 seconds of white noise and loop it through a soft bandpass filter
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise approximation
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 1.8;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    // Filter to simulate soft raindrops hitting leaves
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientGain);

    whiteNoise.start();
    this.ambientSourceNodes.push(whiteNoise, filter, gain);
  }

  private startForestBreeze() {
    if (!this.ctx || !this.ambientGain) return;

    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    // LFO to slowly modulate wind frequency
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime); // 0.15 Hz swell
    lfoGain.gain.setValueAtTime(80, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientGain);

    noise.start();
    lfo.start();
    this.ambientSourceNodes.push(noise, filter, lfo, lfoGain, gain);
  }

  private startSingingBowlDrone() {
    if (!this.ctx || !this.ambientGain) return;

    // Warm peaceful singing bowl harmonic pair (174 Hz Solfeggio / F3 calm tone)
    const baseFreq = 174.61;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    gain1.gain.setValueAtTime(0.08, this.ctx.currentTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq * 1.5, this.ctx.currentTime); // fifth overtone
    gain2.gain.setValueAtTime(0.04, this.ctx.currentTime);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(this.ambientGain);
    gain2.connect(this.ambientGain);

    osc1.start();
    osc2.start();
    this.ambientSourceNodes.push(osc1, osc2, gain1, gain2);
  }
}

export const calmSound = new CalmSoundEngine();
