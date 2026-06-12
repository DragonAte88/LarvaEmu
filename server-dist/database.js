import Database from 'better-sqlite3';
import path from 'path';
// Store DB in the project root for self-hosting (or a specific data folder)
const dbPath = path.join(process.cwd(), 'database.sqlite');
let db;
export const initDatabase = () => {
    try {
        db = new Database(dbPath, { verbose: console.log });
        console.log('[Database] Connected to SQLite database at:', dbPath);
        // Create Tables
        db.exec(`
      CREATE TABLE IF NOT EXISTS watchlist (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        poster_path TEXT,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS viewing_history (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        season INTEGER,
        episode INTEGER,
        progress_ms INTEGER DEFAULT 0,
        total_ms INTEGER DEFAULT 0,
        provider TEXT,
        last_watched DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
        console.log('[Database] Tables initialized successfully.');
    }
    catch (err) {
        console.error('[Database] Failed to initialize SQLite database:', err);
    }
};
// CRUD Operations exposed to IPC
export const dbAPI = {
    // Watchlist
    getWatchlist: () => {
        return db.prepare('SELECT * FROM watchlist ORDER BY added_at DESC').all();
    },
    addToWatchlist: (item) => {
        const stmt = db.prepare('INSERT OR REPLACE INTO watchlist (id, title, type, poster_path) VALUES (?, ?, ?, ?)');
        return stmt.run(item.id, item.title, item.type, item.poster_path);
    },
    removeFromWatchlist: (id) => {
        const stmt = db.prepare('DELETE FROM watchlist WHERE id = ?');
        return stmt.run(id);
    },
    // History
    getHistory: () => {
        return db.prepare('SELECT * FROM viewing_history ORDER BY last_watched DESC LIMIT 50').all();
    },
    updateHistory: (item) => {
        const stmt = db.prepare(`
      INSERT OR REPLACE INTO viewing_history 
      (id, title, type, season, episode, progress_ms, total_ms, provider, last_watched) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
        return stmt.run(item.id, item.title, item.type, item.season, item.episode, item.progress_ms, item.total_ms, item.provider);
    },
    // Settings
    getSetting: (key) => {
        const row = db.prepare('SELECT value FROM user_settings WHERE key = ?').get(key);
        return row ? row.value : null;
    },
    setSetting: (key, value) => {
        const stmt = db.prepare('INSERT OR REPLACE INTO user_settings (key, value) VALUES (?, ?)');
        return stmt.run(key, value);
    }
};
