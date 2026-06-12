import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Key } from 'lucide-react';
import { api } from '../api';

const Settings = () => {
  const [tmdbKey, setTmdbKey] = useState('');
  const [openSubtitlesKey, setOpenSubtitlesKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load settings from backend API
    const loadSettings = async () => {
      const tmdb = await api.getSetting('TMDB_API_KEY');
      const os = await api.getSetting('OPENSUBTITLES_API_KEY');
      if (tmdb) setTmdbKey(tmdb);
      if (os) setOpenSubtitlesKey(os);
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await api.setSetting('TMDB_API_KEY', tmdbKey);
    await api.setSetting('OPENSUBTITLES_API_KEY', openSubtitlesKey);
    setTimeout(() => setIsSaving(false), 500);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>

      <div className="bg-surface/50 border border-white/10 rounded-2xl p-8 mb-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <Key className="text-primary" size={24} />
          <h2 className="text-2xl font-bold text-white">API Keys</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text mb-2">TMDB API Key (v3 auth)</label>
            <input 
              type="password" 
              value={tmdbKey}
              onChange={(e) => setTmdbKey(e.target.value)}
              placeholder="Enter your TMDB API Key"
              className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            />
            <p className="text-xs text-text/60 mt-2">Required for fetching movie posters, cast details, and episodes.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">OpenSubtitles API Key</label>
            <input 
              type="password" 
              value={openSubtitlesKey}
              onChange={(e) => setOpenSubtitlesKey(e.target.value)}
              placeholder="Enter your OpenSubtitles API Key"
              className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            />
            <p className="text-xs text-text/60 mt-2">Required for automatic subtitle fetching and translations.</p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-primary text-background px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
          >
            <Save size={20} />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
