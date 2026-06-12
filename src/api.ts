import axios from 'axios';

const API_BASE = 'http://localhost:5173/api';

export const api = {
  // History
  getHistory: async () => {
    const res = await axios.get(`${API_BASE}/history`);
    return res.data;
  },
  addHistory: async (title: string, url: string, quality: string, time: number, duration: number) => {
    await axios.post(`${API_BASE}/history`, { title, url, quality, time, duration });
  },

  // Watchlist
  getWatchlist: async () => {
    const res = await axios.get(`${API_BASE}/watchlist`);
    return res.data;
  },
  addToWatchlist: async (title: string, poster: string) => {
    await axios.post(`${API_BASE}/watchlist`, { title, poster, action: 'add' });
  },
  removeFromWatchlist: async (title: string) => {
    await axios.post(`${API_BASE}/watchlist`, { title, action: 'remove' });
  },

  // Settings
  getSetting: async (key: string) => {
    const res = await axios.get(`${API_BASE}/settings/${key}`);
    return res.data.value;
  },
  setSetting: async (key: string, value: string) => {
    await axios.post(`${API_BASE}/settings`, { key, value });
  },

  // Downloads
  getDownloadQueue: async () => {
    const res = await axios.get(`${API_BASE}/downloads`);
    return res.data;
  },
  addDownload: async (title: string, url: string, quality: string) => {
    await axios.post(`${API_BASE}/downloads`, { title, url, quality });
  },

  // Global Search
  search: async (query: string) => {
    const res = await axios.get(`${API_BASE}/search`, { params: { q: query } });
    return res.data;
  }
};
