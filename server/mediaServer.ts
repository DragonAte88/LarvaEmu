import express from 'express';
import cors from 'cors';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';

const mediaServer = express();
const PORT = 34567; // Local streaming port

mediaServer.use(cors());

export const startMediaServer = () => {
  const downloadsDir = path.join(app.getPath('videos'), 'MediaUniverse');

  // Serve static files from the downloads directory
  mediaServer.use('/stream', express.static(downloadsDir));

  // API to list downloaded files
  mediaServer.get('/library', (req, res) => {
    try {
      const files = fs.readdirSync(downloadsDir).filter(f => f.endsWith('.mp4'));
      res.json(files.map(f => ({
        filename: f,
        url: `http://localhost:${PORT}/stream/${f}`
      })));
    } catch (err) {
      res.status(500).json({ error: 'Library unavailable' });
    }
  });

  mediaServer.listen(PORT, () => {
    console.log(`[MediaServer] Streaming engine running on http://localhost:${PORT}`);
  });
};
