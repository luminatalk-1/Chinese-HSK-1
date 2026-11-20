export type AudioEngineStatus = 'idle' | 'loading' | 'playing' | 'fallback';

export interface SpeakOptions {
  pinyin?: string;
  key?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onEngineUsed?: (engine: 'tts-proxy' | 'web-speech' | 'tone-synth') => void;
}

/**
 * Extracts Mandarin tone numbers (1, 2, 3, 4, 0) from Pinyin string
 * and applies standard 3rd-tone sandhi (3 + 3 -> 2 + 3).
 */
export function extractTonesFromPinyin(pinyin?: string): number[] {
  if (!pinyin) return [1];
  const toneMap: Record<string, number> = {
    ā: 1, ē: 1, ī: 1, ō: 1, ū: 1, ǖ: 1,
    á: 2, é: 2, í: 2, ó: 2, ú: 2, ǘ: 2,
    ǎ: 3, ě: 3, ǐ: 3, ǒ: 3, ǔ: 3, ǚ: 3,
    à: 4, è: 4, ì: 4, ò: 4, ù: 4, ǜ: 4,
  };

  const syllables = pinyin
    .toLowerCase()
    .replace(/[!?.,。？！—，]/g, ' ')
    .trim()
    .split(/[\s'’]+/)
    .filter(Boolean);

  const tones = syllables.map((syl) => {
    for (const ch of syl) {
      if (toneMap[ch]) return toneMap[ch];
    }
    return 0;
  });

  // Apply 3rd + 3rd tone sandhi
  for (let i = 0; i < tones.length - 1; i++) {
    if (tones[i] === 3 && tones[i + 1] === 3) {
      tones[i] = 2;
    }
  }

  return tones.length > 0 ? tones : [1];
}

type Listener = (activeKey: string | null) => void;

class MandarinAudioEngine {
  private currentAudio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private blobCache = new Map<string, string>();
  private rate = 1.0;
  private volume = 1.0;
  private activeKey: string | null = null;
  private safetyTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners = new Set<Listener>();
  private voicesLoaded = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.voicesLoaded = true;
      };
    }
  }

  public subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private setActiveKey(key: string | null) {
    this.activeKey = key;
    this.listeners.forEach((fn) => fn(key));
  }

  public getActiveKey(): string | null {
    return this.activeKey;
  }

  public setRate(newRate: number) {
    this.rate = Math.max(0.6, Math.min(1.35, newRate));
    if (this.currentAudio) {
      this.currentAudio.playbackRate = this.rate;
    }
  }

  public getRate(): number {
    return this.rate;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public stop() {
    if (this.safetyTimer) {
      clearTimeout(this.safetyTimer);
      this.safetyTimer = null;
    }
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    this.setActiveKey(null);
  }

  /**
   * Preloads Mandarin MP3 via backend proxy into local Blob URL cache for 0ms quiz playback
   */
  public async preload(hanzi: string): Promise<void> {
    const clean = hanzi.replace(/[。？！，、？!,.—\s]+/g, ' ').trim();
    if (!clean || this.blobCache.has(clean)) return;
    try {
      const res = await fetch(`/api/tts?text=${encodeURIComponent(clean)}`);
      if (!res.ok) return;
      const blob = await res.blob();
      if (blob.size > 200) {
        this.blobCache.set(clean, URL.createObjectURL(blob));
      }
    } catch {
      // silent preload failure
    }
  }

  /**
   * Speaks Mandarin Chinese synchronously on user click, cascading through:
   * 1) Cached Blob URL or Express /api/tts MP3 stream
   * 2) Web Speech API (zh-CN)
   * 3) Formant-filtered Pinyin Tone Contour Synthesizer
   */
  public async speak(hanzi: string, options: SpeakOptions = {}): Promise<void> {
    if (!hanzi) return;
    this.stop();

    const cleanText = hanzi.replace(/[。？！，、？!,.—]/g, ' ').replace(/\s+/g, ' ').trim() || hanzi;
    const playKey = options.key || hanzi;

    this.setActiveKey(playKey);
    options.onStart?.();

    const maxDuration = Math.max(2200, cleanText.length * 750);
    this.safetyTimer = setTimeout(() => {
      if (this.activeKey === playKey) {
        this.setActiveKey(null);
        options.onEnd?.();
      }
    }, maxDuration);

    const finish = () => {
      if (this.safetyTimer) {
        clearTimeout(this.safetyTimer);
        this.safetyTimer = null;
      }
      if (this.activeKey === playKey) {
        this.setActiveKey(null);
      }
      options.onEnd?.();
    };

    // Layer 1: Cached Blob or Backend /api/tts Proxy
    try {
      let srcUrl = this.blobCache.get(cleanText);
      if (!srcUrl) {
        const res = await fetch(`/api/tts?text=${encodeURIComponent(cleanText)}`);
        if (res.ok) {
          const blob = await res.blob();
          if (blob.size > 200) {
            srcUrl = URL.createObjectURL(blob);
            this.blobCache.set(cleanText, srcUrl);
          }
        }
      }

      if (srcUrl && this.activeKey === playKey) {
        const audio = new Audio(srcUrl);
        this.currentAudio = audio;
        audio.playbackRate = this.rate;
        audio.volume = this.volume;

        const played = await new Promise<boolean>((resolve) => {
          audio.onended = () => {
            finish();
            resolve(true);
          };
          audio.onerror = () => resolve(false);
          audio.play()
            .then(() => {
              options.onEngineUsed?.('tts-proxy');
            })
            .catch(() => resolve(false));
        });

        if (played) return;
      }
    } catch {
      // Fall through to Layer 2
    }

    if (this.activeKey !== playKey) return;

    // Layer 2: Web Speech API (zh-CN)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      const zhVoice =
        voices.find((v) => v.lang.toLowerCase() === 'zh-cn') ||
        voices.find((v) => v.lang.toLowerCase().startsWith('zh')) ||
        (this.voicesLoaded ? null : undefined);

      if (zhVoice !== null) {
        const spoke = await new Promise<boolean>((resolve) => {
          try {
            const utter = new SpeechSynthesisUtterance(cleanText);
            utter.lang = 'zh-CN';
            utter.rate = this.rate === 0.75 ? 0.72 : this.rate > 1 ? 1.08 : 0.92;
            utter.volume = this.volume;
            if (zhVoice) utter.voice = zhVoice;

            let settled = false;
            utter.onstart = () => {
              options.onEngineUsed?.('web-speech');
            };
            utter.onend = () => {
              if (settled) return;
              settled = true;
              finish();
              resolve(true);
            };
            utter.onerror = () => {
              if (settled) return;
              settled = true;
              resolve(false);
            };

            window.speechSynthesis.speak(utter);

            // Guard against browsers where speechSynthesis silently hangs without firing onstart
            setTimeout(() => {
              if (!settled && !window.speechSynthesis.speaking) {
                settled = true;
                resolve(false);
              }
            }, 600);
          } catch {
            resolve(false);
          }
        });

        if (spoke) return;
      }
    }

    if (this.activeKey !== playKey) return;

    // Layer 3: Formant-filtered Pinyin Tone Contour Synthesizer
    const tones = extractTonesFromPinyin(options.pinyin);
    options.onEngineUsed?.('tone-synth');
    await this.playToneContour(tones.slice(0, 6));
    finish();
  }

  /**
   * Plays authentic vocal-like Mandarin pitch contours (5-5, 3-5, 2-1-4, 5-1, neutral)
   */
  public playToneContour(tones: number[]): Promise<void> {
    return new Promise((resolve) => {
      try {
        if (typeof window === 'undefined') {
          resolve();
          return;
        }
        if (!this.audioCtx) {
          const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (!Ctx) {
            resolve();
            return;
          }
          this.audioCtx = new Ctx();
        }
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().catch(() => {});
        }

        const ctx = this.audioCtx;
        const now = ctx.currentTime + 0.02;
        const dur = this.rate === 0.75 ? 0.42 : 0.30;
        const gap = this.rate === 0.75 ? 0.40 : 0.28;

        tones.forEach((tone, idx) => {
          const t0 = now + idx * gap;
          const t1 = t0 + dur;

          const osc = ctx.createOscillator();
          const formant = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          formant.type = 'bandpass';
          formant.frequency.setValueAtTime(750, t0);
          formant.Q.value = 2.2;

          if (tone === 1) {
            osc.frequency.setValueAtTime(320, t0);
            osc.frequency.linearRampToValueAtTime(320, t1);
          } else if (tone === 2) {
            osc.frequency.setValueAtTime(215, t0);
            osc.frequency.exponentialRampToValueAtTime(335, t1);
          } else if (tone === 3) {
            osc.frequency.setValueAtTime(215, t0);
            osc.frequency.exponentialRampToValueAtTime(155, t0 + dur * 0.52);
            osc.frequency.exponentialRampToValueAtTime(240, t1);
          } else if (tone === 4) {
            osc.frequency.setValueAtTime(355, t0);
            osc.frequency.exponentialRampToValueAtTime(160, t1);
          } else {
            osc.frequency.setValueAtTime(235, t0);
            osc.frequency.linearRampToValueAtTime(205, t0 + dur * 0.65);
          }

          const peak = 0.26 * this.volume;
          gain.gain.setValueAtTime(0.0001, t0);
          gain.gain.linearRampToValueAtTime(peak, t0 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, t1);

          osc.connect(formant);
          formant.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t0);
          osc.stop(t1 + 0.02);
        });

        setTimeout(resolve, (tones.length * gap + dur) * 1000 + 60);
      } catch {
        resolve();
      }
    });
  }
}

export const audioEngine = new MandarinAudioEngine();
