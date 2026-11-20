import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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

async function fetchWithTimeout(url: string, headers: Record<string, string>, timeoutMs = 4500): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { headers, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchMandarinAudio(text: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  const encoded = encodeURIComponent(text);

  // Provider 1: Youdao Mandarin Voice (natural native speaker)
  const providers: Array<{ url: string; headers: Record<string, string> }> = [
    {
      url: `https://dict.youdao.com/dictvoice?audio=${encoded}&type=2`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Referer: 'https://dict.youdao.com/',
        Accept: 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8',
      },
    },
    {
      url: `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=zh-CN&q=${encoded}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HSK 1 Complete Studio server listening on http://localhost:${PORT}`);
  });
}

startServer();
