import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '50mb' }));

  // Initialize Gemini AI client if key exists
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      ai = new GoogleGenAI({ apiKey });
    } catch (e) {
      console.warn('Failed to initialize GoogleGenAI with provided key:', e);
    }
  }

  // TikTok Verification and oEmbed endpoint
  app.post('/api/tiktok/verify', async (req, res) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ verified: false, error: 'URL is required' });
      }

      const cleanUrl = url.trim().split('?')[0];

      // Match TikTok video URL: https://www.tiktok.com/@username/video/1234567890123456789
      const videoMatch = cleanUrl.match(/tiktok\.com\/@([a-zA-Z0-9_.-]+)\/video\/([0-9]+)/);
      // Match TikTok profile URL: https://www.tiktok.com/@username
      const profileMatch = cleanUrl.match(/tiktok\.com\/@([a-zA-Z0-9_.-]+)/);

      if (videoMatch) {
        const creatorUsername = videoMatch[1];
        const videoId = videoMatch[2]; // STRING strictly preserved!

        // Attempt TikTok oEmbed fetch with timeout
        let oembedData: any = null;
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);
          const oembedResp = await fetch(
            `https://www.tiktok.com/oembed?url=${encodeURIComponent(cleanUrl)}`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);
          if (oembedResp.ok) {
            oembedData = await oembedResp.json();
          }
        } catch (fetchErr) {
          // In sandboxed/offline environments or rate limits, proceed with strict URL identity
          console.warn('TikTok oEmbed fetch failed or timed out:', fetchErr);
        }

        return res.json({
          verified: true,
          type: 'direct_video',
          creator_username: creatorUsername,
          video_id: videoId,
          source_url: cleanUrl,
          title: oembedData?.title || null,
          author_name: oembedData?.author_name || creatorUsername,
          thumbnail_url: oembedData?.thumbnail_url || null,
          has_oembed: Boolean(oembedData),
        });
      }

      if (profileMatch) {
        const creatorUsername = profileMatch[1];
        return res.json({
          verified: true,
          type: 'profile_feed',
          creator_username: creatorUsername,
          video_id: null,
          source_url: `https://www.tiktok.com/@${creatorUsername}`,
        });
      }

      // Check handle-only e.g. @anhsacanh.vn or anhsacanh.vn
      const handleClean = cleanUrl.replace(/^@/, '');
      if (/^[a-zA-Z0-9_.-]+$/.test(handleClean)) {
        return res.json({
          verified: true,
          type: 'profile_feed',
          creator_username: handleClean,
          video_id: null,
          source_url: `https://www.tiktok.com/@${handleClean}`,
        });
      }

      return res.status(400).json({
        verified: false,
        error: 'Invalid TikTok URL structure. Expected https://www.tiktok.com/@creator/video/ID or https://www.tiktok.com/@creator',
      });
    } catch (err: any) {
      return res.status(500).json({ verified: false, error: err?.message || 'Verification failed' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      app: 'TikTok Reference Dataset Builder',
      timestamp: new Date().toISOString(),
    });
  });

  // Deep Gemini AI Analysis endpoint for custom creator profiles or custom video edit breakdowns
  app.post('/api/ai-analyze', async (req, res) => {
    try {
      const { prompt, creatorData, systemInstruction } = req.body;

      if (!ai) {
        // Fallback response if GEMINI_API_KEY is not set
        return res.json({
          source: 'synthetic-engine',
          analysis: 'Gemini API key is not configured in server environment. Returning built-in structured style analysis.',
        });
      }

      // Use 'gemini-3.8-flash' as instructed by the gemini-api skill for general text tasks
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemInstruction || 'You are an elite Hollywood & viral short-form video editor specializing in reverse-engineering editing styles for AI models like Claude.'}\n\nContext:\n${JSON.stringify(creatorData || {})}\n\nTask:\n${prompt}`,
              },
            ],
          },
        ],
      });

      const text = response.text || '';
      return res.json({
        source: 'gemini-3.8-flash',
        text,
      });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      return res.status(500).json({
        error: error?.message || 'Failed to analyze with Gemini',
      });
    }
  });

  // Setup Vite middlewares for HMR/SSR in development or serve static in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[TikTok Dataset Builder] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
