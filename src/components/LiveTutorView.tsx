import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Send,
  Volume2,
  AlertCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { HSK1_WORDS, UNITS } from '../data/hsk1Data';
import { UiLang } from './TopBar';
import { sfx } from '../utils/sfxEngine';
import { audioEngine } from '../utils/audioEngine';

interface LiveTutorViewProps {
  lang: UiLang;
  showPinyin: boolean;
  onAwardXp: (amount: number, toastMsg?: string) => void;
  defaultUnitId?: number;
}

type TopicId = 'daily' | 'cafe' | 'intro' | 'time' | 'unit';
type VoiceName = 'Zephyr' | 'Kore' | 'Puck' | 'Charon' | 'Fenrir';
type ConnectionState = 'idle' | 'connecting' | 'connected' | 'error';

interface TranscriptEntry {
  id: string;
  role: 'user' | 'ai';
  text: string;
  finalized: boolean;
}

const TOPICS: Array<{
  id: TopicId;
  en: string;
  ar: string;
  descEn: string;
  descAr: string;
}> = [
  {
    id: 'daily',
    en: 'Daily Free Talk',
    ar: 'محادثة يومية حرة',
    descEn: 'Everyday greetings, weather, mood, and simple routine.',
    descAr: 'تحيات يومية، الطقس، الحال، والروتين اليومي البسيط.',
  },
  {
    id: 'cafe',
    en: 'Café & Ordering',
    ar: 'المقهى والطلب',
    descEn: 'Order tea, coffee, fruit, rice, and ask prices.',
    descAr: 'طلب الشاي، الماء، الطعام، الفاكهة، والسؤال عن السعر.',
  },
  {
    id: 'intro',
    en: 'Intro & Family',
    ar: 'التعارف والعائلة',
    descEn: 'Talk about your name, country, family, and study.',
    descAr: 'التعريف بالاسم والبلد والعائلة والدراسة أو العمل.',
  },
  {
    id: 'time',
    en: 'Time & Plans',
    ar: 'الوقت والمواعيد',
    descEn: 'Tell time, days of the week, and tomorrow plans.',
    descAr: 'السؤال عن الساعة والأيام وترتيب مواعيد الغد.',
  },
  {
    id: 'unit',
    en: 'Unit Vocabulary Focus',
    ar: 'تطبيق كلمات وحدة محددة',
    descEn: 'Practice words from any specific HSK 1 unit in speech.',
    descAr: 'تدرّب صوتياً على مفردات أي وحدة تختارها من ١ إلى ١٢.',
  },
];

const VOICES: Array<{ id: VoiceName; en: string; ar: string }> = [
  { id: 'Zephyr', en: 'Zephyr · Warm', ar: 'Zephyr · دافئ' },
  { id: 'Kore', en: 'Kore · Clear', ar: 'Kore · واضح' },
  { id: 'Puck', en: 'Puck · Friendly', ar: 'Puck · ودود' },
  { id: 'Charon', en: 'Charon · Calm', ar: 'Charon · هادئ' },
  { id: 'Fenrir', en: 'Fenrir · Deep', ar: 'Fenrir · عميق' },
];

const STARTER_PHRASES = [
  {
    h: '你好！我想练习中文。',
    p: 'Nǐ hǎo! Wǒ xiǎng liànxí Zhōngwén.',
    en: 'Hello! I want to practice Chinese.',
    ar: 'مرحباً! أريد ممارسة اللغة الصينية.',
  },
  {
    h: '今天天气怎么样？',
    p: 'Jīntiān tiānqì zěnmeyàng?',
    en: 'How is the weather today?',
    ar: 'كيف حال الطقس اليوم؟',
  },
  {
    h: '我想喝茶，多少钱？',
    p: 'Wǒ xiǎng hē chá, duōshao qián?',
    en: 'I would like to drink tea, how much is it?',
    ar: 'أريد شرب الشاي، كم السعر؟',
  },
  {
    h: '请问，现在几点了？',
    p: 'Qǐngwèn, xiànzài jǐ diǎn le?',
    en: 'Excuse me, what time is it now?',
    ar: 'من فضلك، كم الساعة الآن؟',
  },
];

function resampleFloat32(
  input: Float32Array,
  fromRate: number,
  toRate: number
): Float32Array {
  if (fromRate === toRate) return input;
  const ratio = fromRate / toRate;
  const outputLen = Math.max(1, Math.round(input.length / ratio));
  const output = new Float32Array(outputLen);
  for (let i = 0; i < outputLen; i++) {
    const srcIdx = i * ratio;
    const idxLow = Math.floor(srcIdx);
    const idxHigh = Math.min(idxLow + 1, input.length - 1);
    const frac = srcIdx - idxLow;
    output[i] = input[idxLow] * (1 - frac) + input[idxHigh] * frac;
  }
  return output;
}

function float32ToBase64Pcm16(samples: Float32Array): string {
  const buffer = new ArrayBuffer(samples.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(i * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
  }
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64Pcm16ToFloat32(base64: string): Float32Array {
  const binary = atob(base64);
  const byteLen = binary.length;
  const bytes = new Uint8Array(byteLen);
  for (let i = 0; i < byteLen; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const view = new DataView(bytes.buffer);
  const sampleCount = Math.floor(byteLen / 2);
  const float32 = new Float32Array(sampleCount);
  for (let i = 0; i < sampleCount; i++) {
    float32[i] = view.getInt16(i * 2, true) / 32768.0;
  }
  return float32;
}

export const LiveTutorView: React.FC<LiveTutorViewProps> = ({
  lang,
  showPinyin,
  onAwardXp,
  defaultUnitId = 1,
}) => {
  const [topic, setTopic] = useState<TopicId>('daily');
  const [selectedUnitId, setSelectedUnitId] = useState<number>(defaultUnitId || 1);
  const [voice, setVoice] = useState<VoiceName>('Zephyr');
  const [connState, setConnState] = useState<ConnectionState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [textInput, setTextInput] = useState('');

  const wsRef = useRef<WebSocket | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const isMutedRef = useRef<boolean>(false);
  const turnCountRef = useRef<number>(0);
  const xpAwardedRef = useRef<boolean>(false);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [transcript]);

  const stopPlaybackQueue = useCallback(() => {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch {
        // ignore
      }
    });
    activeSourcesRef.current.clear();
    nextStartTimeRef.current = 0;
    setIsAiSpeaking(false);
  }, []);

  const cleanupResources = useCallback(() => {
    stopPlaybackQueue();

    if (processorRef.current) {
      try {
        processorRef.current.onaudioprocess = null;
        processorRef.current.disconnect();
      } catch {
        // ignore
      }
      processorRef.current = null;
    }

    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch {
        // ignore
      }
      sourceNodeRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }

    if (inputCtxRef.current) {
      inputCtxRef.current.close().catch(() => {});
      inputCtxRef.current = null;
    }

    if (outputCtxRef.current) {
      outputCtxRef.current.close().catch(() => {});
      outputCtxRef.current = null;
    }

    if (wsRef.current) {
      try {
        if (
          wsRef.current.readyState === WebSocket.OPEN ||
          wsRef.current.readyState === WebSocket.CONNECTING
        ) {
          wsRef.current.close();
        }
      } catch {
        // ignore
      }
      wsRef.current = null;
    }

    setMicLevel(0);
  }, [stopPlaybackQueue]);

  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, [cleanupResources]);

  const appendTranscriptDelta = useCallback(
    (role: 'user' | 'ai', delta: string) => {
      if (!delta) return;
      setTranscript((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.role === role && !last.finalized) {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...last,
            text: last.text + delta,
          };
          return updated;
        }
        return [
          ...prev,
          {
            id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            role,
            text: delta,
            finalized: false,
          },
        ];
      });
    },
    []
  );

  const finalizeOpenTurns = useCallback(() => {
    setTranscript((prev) => {
      let changed = false;
      const next = prev.map((entry) => {
        if (!entry.finalized) {
          changed = true;
          return { ...entry, finalized: true };
        }
        return entry;
      });
      return changed ? next : prev;
    });
  }, []);

  const playPcm24Chunk = useCallback((base64Audio: string) => {
    const ctx = outputCtxRef.current;
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const floatSamples = base64Pcm16ToFloat32(base64Audio);
    if (floatSamples.length === 0) return;

    const buffer = ctx.createBuffer(1, floatSamples.length, 24000);
    buffer.getChannelData(0).set(floatSamples);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    const now = ctx.currentTime;
    const startAt = Math.max(now, nextStartTimeRef.current);
    source.start(startAt);
    nextStartTimeRef.current = startAt + buffer.duration;

    activeSourcesRef.current.add(source);
    setIsAiSpeaking(true);

    source.onended = () => {
      activeSourcesRef.current.delete(source);
      if (activeSourcesRef.current.size === 0) {
        setIsAiSpeaking(false);
      }
    };
  }, []);

  const startSession = async () => {
    if (connState === 'connecting' || connState === 'connected') return;

    audioEngine.stop();
    sfx.play('click');
    setErrorMsg(null);
    setConnState('connecting');
    setIsMuted(false);
    isMutedRef.current = false;
    turnCountRef.current = 0;
    xpAwardedRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const InputAudioCtx = window.AudioContext;
      const inputCtx = new InputAudioCtx({ sampleRate: 16000 });
      const outputCtx = new InputAudioCtx({ sampleRate: 24000 });
      await inputCtx.resume();
      await outputCtx.resume();
      inputCtxRef.current = inputCtx;
      outputCtxRef.current = outputCtx;

      const unitObj = UNITS.find((u) => u.id === selectedUnitId);
      const unitWords = HSK1_WORDS.filter((w) => w.u === selectedUnitId)
        .slice(0, 14)
        .map((w) => w.h)
        .join(', ');
      const unitFocus =
        topic === 'unit' && unitObj
          ? `${unitObj.titleEn} (${unitWords})`
          : '';

      const params = new URLSearchParams({
        lang,
        topic,
        voice,
      });
      if (unitFocus) params.set('unitFocus', unitFocus);

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live?${params.toString()}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        const silentGain = inputCtx.createGain();
        silentGain.gain.value = 0;

        sourceNodeRef.current = source;
        processorRef.current = processor;

        source.connect(processor);
        processor.connect(silentGain);
        silentGain.connect(inputCtx.destination);

        processor.onaudioprocess = (ev) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          const rawData = ev.inputBuffer.getChannelData(0);

          if (isMutedRef.current) {
            setMicLevel(0);
            return;
          }

          let sumSq = 0;
          for (let i = 0; i < rawData.length; i += 8) {
            sumSq += rawData[i] * rawData[i];
          }
          const rms = Math.sqrt(sumSq / Math.max(1, rawData.length / 8));
          setMicLevel(Math.min(1, rms * 6));

          const pcm16k = resampleFloat32(rawData, inputCtx.sampleRate, 16000);
          const base64 = float32ToBase64Pcm16(pcm16k);
          ws.send(JSON.stringify({ audio: base64 }));
        };
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as {
            type?: string;
            audio?: string;
            text?: string;
            message?: string;
          };

          if (msg.type === 'ready') {
            setConnState('connected');
            sfx.play('tab');
            // Prompt the tutor to greet the learner right away in Mandarin
            ws.send(
              JSON.stringify({
                text:
                  lang === 'ar'
                    ? 'مرحباً! ابدأ المحادثة معي باللغة الصينية المبسطة (HSK 1).'
                    : 'Hello! Please start our simple HSK 1 Mandarin conversation.',
              })
            );
          } else if (msg.type === 'audio' && msg.audio) {
            playPcm24Chunk(msg.audio);
          } else if (msg.type === 'inputTranscript' && msg.text) {
            appendTranscriptDelta('user', msg.text);
          } else if (msg.type === 'outputTranscript' && msg.text) {
            appendTranscriptDelta('ai', msg.text);
          } else if (msg.type === 'interrupted') {
            stopPlaybackQueue();
            finalizeOpenTurns();
          } else if (msg.type === 'turnComplete') {
            finalizeOpenTurns();
            turnCountRef.current += 1;
            if (turnCountRef.current >= 2 && !xpAwardedRef.current) {
              xpAwardedRef.current = true;
              onAwardXp(
                25,
                lang === 'ar'
                  ? '+25 نقطة! ممارسة محادثة مباشرة ممتازة'
                  : '+25 XP! Great live Mandarin speaking practice'
              );
            }
          } else if (msg.type === 'error') {
            setErrorMsg(
              msg.message ||
                (lang === 'ar'
                  ? 'تعذر الاتصال بخدمة المحادثة المباشرة.'
                  : 'Unable to connect to Gemini Live service.')
            );
            setConnState('error');
            cleanupResources();
          } else if (msg.type === 'closed') {
            setConnState((prev) => (prev === 'error' ? 'error' : 'idle'));
            cleanupResources();
          }
        } catch {
          // ignore malformed messages
        }
      };

      ws.onerror = () => {
        setErrorMsg(
          lang === 'ar'
            ? 'حدث خطأ في اتصال الصوت المباشر. يرجى المحاولة مرة أخرى.'
            : 'Live audio WebSocket connection failed. Please try again.'
        );
        setConnState('error');
        cleanupResources();
      };

      ws.onclose = () => {
        setConnState((prev) => (prev === 'error' ? 'error' : 'idle'));
        cleanupResources();
      };
    } catch (err) {
      const msg =
        err instanceof Error && err.name === 'NotAllowedError'
          ? lang === 'ar'
            ? 'يرجى السماح بالوصول إلى الميكروفون لبدء المحادثة الصوتية المباشرة.'
            : 'Please allow microphone access in your browser to start the live voice conversation.'
          : lang === 'ar'
            ? 'تعذر تشغيل الميكروفون. تأكد من توصيل الميكروفون ثم أعد المحاولة.'
            : 'Could not start microphone capture. Please check your audio device.';
      setErrorMsg(msg);
      setConnState('error');
      cleanupResources();
    }
  };

  const endSession = () => {
    sfx.play('click');
    finalizeOpenTurns();
    cleanupResources();
    setConnState('idle');
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    isMutedRef.current = next;
    sfx.play('toggle');
  };

  const sendTextTurn = (phrase: string) => {
    const clean = phrase.trim();
    if (!clean || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    sfx.play('click');
    finalizeOpenTurns();
    setTranscript((prev) => [
      ...prev,
      {
        id: `user-txt-${Date.now()}`,
        role: 'user',
        text: clean,
        finalized: true,
      },
    ]);
    wsRef.current.send(JSON.stringify({ text: clean }));
    setTextInput('');
  };

  const activeTopic = TOPICS.find((t) => t.id === topic) || TOPICS[0];

  const statusText =
    connState === 'connecting'
      ? lang === 'ar'
        ? 'جاري الاتصال بالمعلم الصيني...'
        : 'Connecting to Live AI Tutor...'
      : connState === 'connected'
        ? isAiSpeaking
          ? lang === 'ar'
            ? 'المعلم يتحدث الآن...'
            : 'Tutor is speaking...'
          : isMuted
            ? lang === 'ar'
              ? 'الميكروفون مكتوم'
              : 'Microphone muted'
            : lang === 'ar'
              ? 'متصل — تحدث الآن بالصينية أو بلغتك'
              : 'Live — Speak in Mandarin or your language'
        : connState === 'error'
          ? lang === 'ar'
            ? 'تعذر الاتصال'
            : 'Connection error'
          : lang === 'ar'
            ? 'جاهز للمحادثة اليومية المباشرة'
            : 'Ready for Daily Voice Practice';

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-settle" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Zone: Live Voice Stage & Scenario Configuration */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-6">
          <div className="space-y-5">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {lang === 'ar'
                    ? 'محادثة صوتية فورية · Gemini Live'
                    : 'Real-Time Voice Practice · Gemini Live'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {lang === 'ar'
                  ? 'المعلم الصيني المباشر'
                  : 'Live Mandarin Conversation Tutor'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {lang === 'ar' ? activeTopic.descAr : activeTopic.descEn}
              </p>
            </div>

            {/* Topic Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                {lang === 'ar' ? 'موضوع الممارسة اليومية' : 'Daily Practice Topic'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5">
                {TOPICS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={connState === 'connected' || connState === 'connecting'}
                    onClick={() => {
                      sfx.play('click');
                      setTopic(item.id);
                    }}
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                      lang === 'ar' ? 'text-right' : 'text-left'
                    } ${
                      topic === item.id
                        ? 'bg-red-50 dark:bg-red-950/40 border-red-600 text-red-800 dark:text-red-300'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {lang === 'ar' ? item.ar : item.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Unit Picker when Unit Focus is chosen */}
            {topic === 'unit' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {lang === 'ar' ? 'اختر الوحدة للتدريب عليها' : 'Select HSK 1 Unit'}
                </label>
                <select
                  disabled={connState === 'connected' || connState === 'connecting'}
                  value={selectedUnitId}
                  onChange={(e) => {
                    sfx.play('click');
                    setSelectedUnitId(Number(e.target.value));
                  }}
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-600"
                >
                  {UNITS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {lang === 'ar' ? u.titleAr : u.titleEn}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Tutor Voice Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                {lang === 'ar' ? 'صوت المعلم' : 'Tutor Voice'}
              </label>
              <select
                disabled={connState === 'connected' || connState === 'connecting'}
                value={voice}
                onChange={(e) => {
                  sfx.play('click');
                  setVoice(e.target.value as VoiceName);
                }}
                className="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-600"
              >
                {VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {lang === 'ar' ? v.ar : v.en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Live Voice Visualizer & Call Controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                    connState === 'connected'
                      ? isAiSpeaking
                        ? 'bg-teal-700 text-white'
                        : 'bg-red-700 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                  style={
                    connState === 'connected' && !isAiSpeaking && !isMuted
                      ? { transform: `scale(${1 + micLevel * 0.22})` }
                      : undefined
                  }
                >
                  {isAiSpeaking ? (
                    <Volume2 className="w-5 h-5" aria-hidden="true" />
                  ) : isMuted ? (
                    <MicOff className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Mic className="w-5 h-5" aria-hidden="true" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {statusText}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono-tabular">
                    {connState === 'connected'
                      ? lang === 'ar'
                        ? '١٦ كيلوهرتز إدخال · ٢٤ كيلوهرتز إخراج'
                        : '16kHz Mic · 24kHz Voice'
                      : lang === 'ar'
                        ? 'اضغط بدء لفتح الميكروفون'
                        : 'Press Start to open live voice'}
                  </div>
                </div>
              </div>

              {connState === 'connected' && (
                <div className="flex items-end gap-1 h-6 shrink-0" aria-hidden="true">
                  {[0.35, 0.75, 1.0, 0.6].map((mult, idx) => {
                    const heightPct = isAiSpeaking
                      ? 40 + ((idx * 23) % 60)
                      : Math.max(20, Math.round(micLevel * 100 * mult));
                    return (
                      <span
                        key={idx}
                        className={`w-1 rounded-full transition-all duration-75 ${
                          isAiSpeaking ? 'bg-teal-600 dark:bg-teal-400' : 'bg-red-600 dark:bg-red-400'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2.5">
              {connState !== 'connected' && connState !== 'connecting' ? (
                <button
                  type="button"
                  onClick={startSession}
                  className="w-full min-h-[46px] px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <PhoneCall className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>
                    {lang === 'ar'
                      ? 'بدء المحادثة الصوتية المباشرة'
                      : 'Start Live Voice Conversation'}
                  </span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={connState === 'connecting'}
                    onClick={toggleMute}
                    className={`flex-1 min-h-[44px] px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50 ${
                      isMuted
                        ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-800 dark:text-amber-300'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {isMuted ? (
                      <MicOff className="w-4 h-4 shrink-0" aria-hidden="true" />
                    ) : (
                      <Mic className="w-4 h-4 shrink-0" aria-hidden="true" />
                    )}
                    <span>
                      {isMuted
                        ? lang === 'ar'
                          ? 'إلغاء الكتم'
                          : 'Unmute'
                        : lang === 'ar'
                          ? 'كتم الميكروفون'
                          : 'Mute'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={endSession}
                    className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-red-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-red-600 dark:hover:text-white text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <PhoneOff className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{lang === 'ar' ? 'إنهاء المحادثة' : 'End Call'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Zone: Live Transcript + Starter Phrases + Text Fallback */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-4 min-h-[520px]">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
              <MessageSquare className="w-4 h-4 text-red-700 dark:text-red-400" aria-hidden="true" />
              <span>
                {lang === 'ar' ? 'النص المباشر للمحادثة' : 'Live Conversation Transcript'}
              </span>
            </div>
            {transcript.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  sfx.play('click');
                  setTranscript([]);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-red-700 dark:text-slate-400 dark:hover:text-red-400 cursor-pointer"
              >
                {lang === 'ar' ? 'مسح السجل' : 'Clear'}
              </button>
            )}
          </div>

          {/* Scrollable Transcript Feed */}
          <div className="flex-1 overflow-y-auto space-y-3 py-2 max-h-[360px] pr-1">
            {transcript.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-8 px-4 space-y-3">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === 'ar'
                    ? 'ابدأ المحادثة الصوتية وتكلّم بحرية مع المعلم الصيني'
                    : 'Start the voice session and speak naturally with your Mandarin tutor'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                  {lang === 'ar'
                    ? 'سيسمعك الذكاء الاصطناعي ويرد عليك صوتياً بمستوى HSK 1 مع عرض النص هنا فورياً. يمكنك أيضاً استخدام الجمل الجاهزة بالأسفل.'
                    : 'Your tutor listens and responds in real-time voice at HSK 1 level with live transcription here. You can also tap any starter phrase below.'}
                </p>
              </div>
            ) : (
              transcript.map((item) => (
                <div
                  key={item.id}
                  className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      item.role === 'user'
                        ? 'bg-red-700 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    <div className="text-[10px] font-bold opacity-75 mb-1">
                      {item.role === 'user'
                        ? lang === 'ar'
                          ? 'أنت'
                          : 'You'
                        : lang === 'ar'
                          ? 'المعلم الصيني'
                          : 'Mandarin Tutor'}
                    </div>
                    <div className="whitespace-pre-wrap break-words font-hanzi">
                      {item.text}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>

          {/* HSK 1 Starter Prompts + Text Input */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {lang === 'ar'
                  ? 'جمل مساعدة سريعة (جرب نطقها أو اضغط لإرسالها أثناء المكالمة):'
                  : 'Quick HSK 1 Starters (say them aloud or click to send during a call):'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STARTER_PHRASES.map((phrase, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={connState !== 'connected'}
                    onClick={() => sendTextTurn(phrase.h)}
                    className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-red-600 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                      lang === 'ar' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div className="text-sm font-bold font-hanzi text-slate-900 dark:text-slate-100">
                      {phrase.h}
                    </div>
                    {showPinyin && (
                      <div className="text-[11px] font-mono-tabular text-red-700 dark:text-red-400">
                        {phrase.p}
                      </div>
                    )}
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      {lang === 'ar' ? phrase.ar : phrase.en}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendTextTurn(textInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                disabled={connState !== 'connected'}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={
                  connState === 'connected'
                    ? lang === 'ar'
                      ? 'اكتب رسالة أو سؤالاً للمعلم أثناء المكالمة...'
                      : 'Type a Chinese phrase or question during the call...'
                    : lang === 'ar'
                      ? 'ابدأ المكالمة الصوتية أولاً لتتمكن من الإرسال...'
                      : 'Start the live call first to send messages...'
                }
                className="flex-1 min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-red-600 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={connState !== 'connected' || !textInput.trim()}
                aria-label={lang === 'ar' ? 'إرسال' : 'Send'}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{lang === 'ar' ? 'إرسال' : 'Send'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
