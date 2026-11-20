import 'dotenv/config';
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { WebSocketServer, WebSocket } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// In-memory LRU audio cache (max 450 clips) for instant repeat playback
const MAX_CACHE_ENTRIES = 450;
const ttsCache = new Map<string, { buffer: Buffer; contentType: string }>();

function setCache(key: string, value: { buffer: Buffer; contentType: string }) {
  if (ttsCache.has(key)) {
    ttsCache.delete(key);
  } else if (ttsCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = ttsCache.keys().next().value;
    if (oldestKey) ttsCache.delete(oldestKey);
  }
  ttsCache.set(key, value);
}

async function fetchWithTimeout(
  url: string,
  headers: Record<string, string>,
  timeoutMs = 4500
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { headers, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchMandarinAudio(
  text: string
): Promise<{ buffer: Buffer; contentType: string } | null> {
  const encoded = encodeURIComponent(text);

  const providers: Array<{ url: string; headers: Record<string, string> }> = [
    {
      url: `https://dict.youdao.com/dictvoice?audio=${encoded}&type=2`,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Referer: 'https://dict.youdao.com/',
        Accept: 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8',
      },
    },
    {
      url: `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=zh-CN&q=${encoded}`,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Referer: 'https://translate.google.com/',
        Accept: 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8',
      },
    },
  ];

  for (const provider of providers) {
    try {
      const res = await fetchWithTimeout(provider.url, provider.headers, 4500);
      if (!res.ok) continue;
      const contentType = res.headers.get('content-type') || 'audio/mpeg';
      if (!contentType.includes('audio') && !contentType.includes('octet-stream')) continue;
      const arrayBuf = await res.arrayBuffer();
      if (arrayBuf.byteLength < 256) continue;
      return { buffer: Buffer.from(arrayBuf), contentType: 'audio/mpeg' };
    } catch {
      // Try next provider
    }
  }

  return null;
}

const ALLOWED_VOICES = new Set(['Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir']);

function buildLiveTutorInstruction(
  lang: 'ar' | 'en',
  topic: string,
  unitFocus: string
): string {
  const supportLang = lang === 'ar' ? 'Arabic' : 'English';

  let scenarioDesc = 'Free daily conversation using HSK 1 Mandarin vocabulary (greetings, weather, daily life, hobbies, food).';
  if (topic === 'cafe') {
    scenarioDesc = 'Roleplay a friendly waiter/barista at a Chinese café or restaurant. Practice ordering tea, water, rice, fruit, and asking prices.';
  } else if (topic === 'intro') {
    scenarioDesc = 'Roleplay meeting a new friend in Beijing. Practice names, nationalities, age, family members, and studying/working.';
  } else if (topic === 'time') {
    scenarioDesc = 'Roleplay making daily plans. Practice telling time, days of the week, dates, and meeting tomorrow or today.';
  } else if (topic === 'unit' && unitFocus) {
    scenarioDesc = `Focus specifically on practicing this HSK 1 unit vocabulary in natural daily sentences: ${unitFocus}.`;
  }

  return [
    'You are an encouraging, patient, native-speaking Mandarin Chinese (HSK 1 level) daily conversation tutor.',
    `Scenario: ${scenarioDesc}`,
    `Support language for brief explanations or gentle corrections: ${supportLang}.`,
    'Guidelines:',
    '- Speak clearly at a natural beginner-friendly pace primarily in simple HSK 1 Mandarin Chinese.',
    '- Keep each spoken response short (1 to 3 simple sentences) and end with a friendly follow-up question in simple Mandarin so the learner keeps practicing.',
    `- If the learner makes a mistake, pauses confused, or asks in ${supportLang}, briefly and warmly explain in ${supportLang} and immediately give the simple Mandarin phrase to repeat.`,
    '- Never overwhelm the beginner with advanced HSK 3+ vocabulary.',
  ].join('\n');
}

function getGeminiClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, cacheSize: ttsCache.size });
  });

  app.get('/api/tts', async (req, res) => {
    const raw = typeof req.query.text === 'string' ? req.query.text : '';
    const clean = raw.replace(/\s+/g, ' ').trim().slice(0, 120);

    if (!clean) {
      res.status(400).json({ error: 'Missing text parameter' });
      return;
    }

    const cached = ttsCache.get(clean);
    if (cached) {
      res.setHeader('Content-Type', cached.contentType);
      res.setHeader('Content-Length', cached.buffer.length);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('X-TTS-Cache', 'HIT');
      res.send(cached.buffer);
      return;
    }

    const audio = await fetchMandarinAudio(clean);
    if (!audio) {
      res.status(502).json({ error: 'Upstream TTS unavailable' });
      return;
    }

    setCache(clean, audio);
    res.setHeader('Content-Type', audio.contentType);
    res.setHeader('Content-Length', audio.buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('X-TTS-Cache', 'MISS');
    res.send(audio.buffer);
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distDir)) {
      app.use(express.static(distDir));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distDir, 'index.html'));
      });
    }
  }

  const httpServer = http.createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (req, socket, head) => {
    try {
      const parsed = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
      if (parsed.pathname === '/live') {
        wss.handleUpgrade(req, socket, head, (ws) => {
          wss.emit('connection', ws, req);
        });
      }
    } catch {
      socket.destroy();
    }
  });

  wss.on('connection', async (clientWs: WebSocket, req) => {
    const sendJson = (payload: Record<string, unknown>) => {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify(payload));
      }
    };

    if (!process.env.GEMINI_API_KEY) {
      sendJson({
        type: 'error',
        message: 'GEMINI_API_KEY is not configured. Please check Settings > Secrets.',
      });
      clientWs.close();
      return;
    }

    let lang: 'ar' | 'en' = 'ar';
    let topic = 'daily';
    let voice = 'Zephyr';
    let unitFocus = '';

    try {
      const parsed = new URL(req.url || '/live', `http://${req.headers.host || 'localhost'}`);
      lang = parsed.searchParams.get('lang') === 'en' ? 'en' : 'ar';
      topic = (parsed.searchParams.get('topic') || 'daily').slice(0, 32);
      const requestedVoice = parsed.searchParams.get('voice') || 'Zephyr';
      if (ALLOWED_VOICES.has(requestedVoice)) voice = requestedVoice;
      unitFocus = (parsed.searchParams.get('unitFocus') || '').slice(0, 400);
    } catch {
      // keep defaults
    }

    let clientClosed = false;
    let liveSession: Awaited<ReturnType<GoogleGenAI['live']['connect']>> | null = null;

    const ai = getGeminiClient();

    const sessionPromise = ai.live
      .connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: buildLiveTutorInstruction(lang, topic, unitFocus),
        },
        callbacks: {
          onopen: () => {
            sendJson({ type: 'ready' });
          },
          onmessage: (message: LiveServerMessage) => {
            const content = message.serverContent;
            if (content?.inputTranscription?.text) {
              sendJson({ type: 'inputTranscript', text: content.inputTranscription.text });
            }
            if (content?.outputTranscription?.text) {
              sendJson({ type: 'outputTranscript', text: content.outputTranscription.text });
            }
            for (const part of content?.modelTurn?.parts ?? []) {
              if (part.inlineData?.data) {
                sendJson({ type: 'audio', audio: part.inlineData.data });
              }
            }
            if (content?.interrupted) {
              sendJson({ type: 'interrupted' });
            }
            if (content?.turnComplete) {
              sendJson({ type: 'turnComplete' });
            }
          },
          onerror: (err: unknown) => {
            const msg =
              err instanceof Error
                ? err.message
                : 'Gemini Live connection error occurred.';
            sendJson({ type: 'error', message: msg });
          },
          onclose: (ev: { reason?: string }) => {
            if (!clientClosed) {
              sendJson({ type: 'closed', reason: ev?.reason || '' });
            }
          },
        },
      })
      .then((sess) => {
        liveSession = sess;
        if (clientClosed) {
          sess.close();
        }
        return sess;
      })
      .catch((err: unknown) => {
        const msg =
          err instanceof Error
            ? err.message
            : 'Unable to connect to Gemini Live API.';
        sendJson({ type: 'error', message: msg });
        return null;
      });

    clientWs.on('message', async (raw) => {
      try {
        const data = JSON.parse(raw.toString()) as { audio?: string; text?: string };
        const sess = liveSession ?? (await sessionPromise);
        if (!sess || clientClosed) return;

        if (typeof data.audio === 'string' && data.audio.length > 0) {
          sess.sendRealtimeInput({
            audio: { data: data.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        } else if (typeof data.text === 'string' && data.text.trim().length > 0) {
          sess.sendRealtimeInput({
            text: data.text.trim().slice(0, 1000),
          });
        }
      } catch {
        // Ignore malformed frames
      }
    });

    clientWs.on('close', () => {
      clientClosed = true;
      if (liveSession) {
        try {
          liveSession.close();
        } catch {
          // ignore
        }
      } else {
        sessionPromise.then((sess) => {
          try {
            sess?.close();
          } catch {
            // ignore
          }
        });
      }
    });
  });

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`HSK 1 Complete Studio server listening on http://localhost:${PORT}`);
  });
}

startServer();
