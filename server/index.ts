import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { initDatabase, dbAPI } from './database.js';
import { downloadManager } from './downloadManager.js';
import { searchWCO } from './scrapers/wcotv.js';
import { extractStream } from './extractors/index.js';
import { fetchSubtitles } from './subtitles.js';

const app = express();
const PORT = 5173;

app.use(cors());
app.use(express.json());

// Serve React Frontend
app.use(express.static(path.join(process.cwd(), 'dist')));

// Initialize SQLite database
initDatabase();

// ==========================================
// Global Search API Route
// ==========================================
app.get('/api/search', async (req, res) => {
  const query = req.query.q as string;
  if (!query) {
    return res.json([]);
  }
  
  // Here we can aggregate multiple scrapers if needed.
  // For now, we search WCO
  const results = await searchWCO(query);
  res.json(results);
});

// ==========================================
// Database API Routes
// ==========================================
app.get('/api/history', (req, res) => {
  res.json(dbAPI.getHistory());
});

app.post('/api/history', (req, res) => {
  const { title, url, quality, time, duration } = req.body;
  dbAPI.updateHistory({
    id: title,
    title,
    type: 'video',
    season: null,
    episode: null,
    progress_ms: time,
    total_ms: duration,
    provider: url
  });
  res.json({ success: true });
});

app.get('/api/watchlist', (req, res) => {
  res.json(dbAPI.getWatchlist());
});

app.post('/api/watchlist', (req, res) => {
  const { title, poster, action } = req.body;
  if (action === 'add') {
    dbAPI.addToWatchlist({
      id: title,
      title,
      type: 'video',
      poster_path: poster
    });
  } else if (action === 'remove') {
    dbAPI.removeFromWatchlist(title);
  }
  res.json({ success: true });
});

app.get('/api/settings/:key', (req, res) => {
  res.json({ value: dbAPI.getSetting(req.params.key) });
});

app.post('/api/settings', (req, res) => {
  const { key, value } = req.body;
  dbAPI.setSetting(key, value);
  res.json({ success: true });
});

// ==========================================
// Download API Routes
// ==========================================
app.get('/api/downloads', (req, res) => {
  res.json(downloadManager.getQueue());
});

app.post('/api/downloads', (req, res) => {
  const { title, url, quality } = req.body;
  downloadManager.addJob(title, url, quality);
  res.json({ success: true });
});

// ==========================================
// Raw Stream Extractor API Route
// ==========================================

app.post('/api/extract', async (req, res) => {
  const { url, providerId } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const streamInfo = await extractStream(url, providerId);
    if (streamInfo) {
      res.json(streamInfo);
    } else {
      res.status(404).json({ error: 'Stream not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Extraction failed' });
  }
});

// ==========================================
// OpenSubtitles API Route
// ==========================================

app.get('/api/subtitles', async (req, res) => {
  const { tmdbId, type, season, episode } = req.query;
  if (!tmdbId || !type) {
    return res.status(400).json({ error: 'tmdbId and type are required' });
  }

  try {
    const subs = await fetchSubtitles(
      tmdbId as string, 
      type as 'movie' | 'tv', 
      season ? parseInt(season as string) : undefined, 
      episode ? parseInt(episode as string) : undefined
    );
    res.json(subs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subtitles' });
  }
});

// ==========================================
// Media Server (Offline Streaming)
// ==========================================
const userHomeDir = process.env.USERPROFILE || process.env.HOME || '';
const downloadFolder = path.join(userHomeDir, 'Videos', 'MediaUniverse');

app.get('/library', (req, res) => {
  if (!fs.existsSync(downloadFolder)) {
    return res.json([]);
  }
  const files = fs.readdirSync(downloadFolder)
    .filter(file => file.endsWith('.mp4'))
    .map(file => ({
      filename: file,
      url: `http://localhost:${PORT}/library/${encodeURIComponent(file)}`
    }));
  res.json(files);
});

app.use('/library', express.static(downloadFolder));

// Start server
app.listen(PORT, () => {
  console.log(`[Media Universe] Backend API running at http://localhost:${PORT}`);
});
