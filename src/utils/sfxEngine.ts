export type SfxName =
  | 'click'
  | 'tab'
  | 'toggle'
  | 'tilePick'
  | 'tileRemove'
  | 'flip'
  | 'correct'
  | 'streak'
  | 'wrong'
  | 'mastered'
  | 'complete'
  | 'heartLost';

class StudioSfxEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private enabled = true;
  private volume = 0.72;

  private ensureCtx(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.enabled ? this.volume : 0, this.ctx.currentTime, 0.015);
    }
    return this.ctx;
  }

  public unlock() {
    this.ensureCtx();
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(val ? this.volume : 0, this.ctx.currentTime, 0.015);
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain && this.enabled) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.015);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Plays a harmonic note with gentle low-pass warmth and clean ADSR envelope
   */
  private playTone(
    freq: number,
    startOffset: number,
    duration: number,
    options: {
      type?: OscillatorType;
      gain?: number;
      endFreq?: number;
      filterFreq?: number;
      attack?: number;
    } = {}
  ) {
    const ctx = this.ensureCtx();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime + startOffset;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const env = ctx.createGain();

    osc.type = options.type || 'sine';
    osc.frequency.setValueAtTime(freq, now);
    if (options.endFreq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, options.endFreq), now + duration);
    }

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(options.filterFreq || 3200, now);

    const peak = options.gain ?? 0.22;
    const attack = options.attack ?? 0.008;

    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(peak, now + attack);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.03);
  }

  /**
   * Filtered noise burst for tactile card swish / wood transient
   */
  private playNoiseSwish(duration = 0.12, centerFreq = 1200, gainPeak = 0.09) {
    const ctx = this.ensureCtx();
    if (!ctx || !this.masterGain) return;

    const sampleCount = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(centerFreq * 0.7, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(centerFreq * 1.4, ctx.currentTime + duration);
    filter.Q.value = 1.6;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, ctx.currentTime);
    env.gain.linearRampToValueAtTime(gainPeak, ctx.currentTime + duration * 0.28);
    env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    src.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);

    src.start();
  }

  public play(name: SfxName, stepIndex = 0) {
    if (!this.enabled) return;

    switch (name) {
      case 'click': {
        // Subtle crisp studio tap
        this.playTone(680, 0, 0.055, { type: 'sine', gain: 0.11, endFreq: 420, attack: 0.003 });
        break;
      }

      case 'tab': {
        // Warm bamboo dual-tap
        this.playTone(440, 0, 0.07, { type: 'triangle', gain: 0.1, filterFreq: 1800 });
        this.playTone(660, 0.025, 0.08, { type: 'sine', gain: 0.09 });
        break;
      }

      case 'toggle': {
        this.playTone(520, 0, 0.06, { type: 'sine', gain: 0.12, endFreq: 680 });
        break;
      }

      case 'tilePick': {
        // Pentatonic ascending marimba step (C5, D5, E5, G5, A5, C6)
        const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
        const freq = scale[stepIndex % scale.length];
        this.playTone(freq, 0, 0.16, { type: 'triangle', gain: 0.18, filterFreq: 2600 });
        this.playTone(freq * 2, 0, 0.08, { type: 'sine', gain: 0.06 });
        break;
      }

      case 'tileRemove': {
        // Soft descending woodblock pop
        this.playTone(440, 0, 0.09, { type: 'triangle', gain: 0.14, endFreq: 290, filterFreq: 1600 });
        break;
      }

      case 'flip': {
        // Smooth tactile card flip swish + light chime
        this.playNoiseSwish(0.11, 1400, 0.08);
        this.playTone(587.33, 0.02, 0.09, { type: 'sine', gain: 0.08, endFreq: 783.99 });
        break;
      }

      case 'correct': {
        // Warm major 9th chime (C5 -> E5 -> G5 -> D6 shimmer)
        this.playTone(523.25, 0, 0.24, { type: 'triangle', gain: 0.18, filterFreq: 2800 });
        this.playTone(659.25, 0.06, 0.26, { type: 'sine', gain: 0.18 });
        this.playTone(783.99, 0.12, 0.34, { type: 'sine', gain: 0.2 });
        this.playTone(1174.66, 0.17, 0.38, { type: 'sine', gain: 0.08 });
        break;
      }

      case 'streak': {
        // Celebratory pentatonic shimmer arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
        notes.forEach((f, idx) => {
          this.playTone(f, idx * 0.055, 0.32, { type: 'sine', gain: 0.16 });
        });
        break;
      }

      case 'wrong': {
        // Gentle, non-harsh muted marimba double-thud
        this.playTone(233.08, 0, 0.15, { type: 'triangle', gain: 0.17, endFreq: 196, filterFreq: 900 });
        this.playTone(185.0, 0.1, 0.22, { type: 'triangle', gain: 0.16, endFreq: 155, filterFreq: 800 });
        break;
      }

      case 'heartLost': {
        this.playTone(311.13, 0, 0.18, { type: 'sine', gain: 0.16, endFreq: 174.61 });
        this.playTone(220, 0.08, 0.24, { type: 'triangle', gain: 0.14, endFreq: 146.83, filterFreq: 900 });
        break;
      }

      case 'mastered': {
        // Bright jade bell + harmonic sparkle
        this.playTone(659.25, 0, 0.26, { type: 'sine', gain: 0.18 });
        this.playTone(987.77, 0.07, 0.34, { type: 'sine', gain: 0.16 });
        this.playTone(1318.51, 0.14, 0.42, { type: 'sine', gain: 0.14 });
        break;
      }

      case 'complete': {
        // Full uplifting Chinese pentatonic fanfare (C5 D5 E5 G5 A5 C6)
        const fanfare = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
        fanfare.forEach((f, idx) => {
          this.playTone(f, idx * 0.075, idx === fanfare.length - 1 ? 0.65 : 0.26, {
            type: idx % 2 === 0 ? 'triangle' : 'sine',
            gain: idx === fanfare.length - 1 ? 0.22 : 0.16,
            filterFreq: 3400,
          });
        });
        this.playTone(523.25, 0.38, 0.65, { type: 'sine', gain: 0.12 });
        break;
      }
    }
  }
}

export const sfx = new StudioSfxEngine();
