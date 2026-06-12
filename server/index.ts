import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { initDatabase, dbAPI } from './database';
import { downloadManager } from './downloadManager';

const app = express();
const PORT = 34567; // Reuse the media server port

app.use(cors());
app.use(express.json());

// Initialize SQLite database
initDatabase();

// ==========================================
// Database API Routes
// ==========================================
app.get('/api/history', (req, res) => {
  res.json(dbAPI.getHistory());
});

app.post('/api/history', (req, res) => {
  const { title, url, quality, time, duration } = req.body;
  dbAPI.addHistory(title, url, quality, time, duration);
  res.json({ success: true });
});

app.get('/api/watchlist', (req, res) => {
  res.json(dbAPI.getWatchlist());
});

app.post('/api/watchlist', (req, res) => {
  const { title, poster, action } = req.body;
  if (action === 'add') {
    dbAPI.addToWatchlist(title, poster);
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
  downloadManager.addDownload(title, url, quality);
  res.json({ success: true });
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
