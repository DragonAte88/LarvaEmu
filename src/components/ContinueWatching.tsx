import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { api } from '../api';

interface HistoryItem {
  id: string;
  title: string;
  type: string;
  season?: number;
  episode?: number;
  progress_ms: number;
  total_ms: number;
  provider: string;
  last_watched: string;
}

const ContinueWatching = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const items = await api.getHistory();
      if (items) {
        setHistory(items);
      }
    };
    fetchHistory();
  }, []);

  if (history.length === 0) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-primary">Continue Watching</h2>
        <div className="text-text/50 italic">Your watch history is empty. Start watching to see titles here.</div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-primary">Continue Watching</h2>
      <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
        {history.map((item) => {
          const progressPercent = item.total_ms > 0 ? (item.progress_ms / item.total_ms) * 100 : 0;
          
          return (
            <motion.div 
              key={item.id} 
              whileHover={{ scale: 1.05 }}
              className="snap-start flex-none w-72 aspect-video rounded-xl bg-surface/50 border border-white/5 overflow-hidden relative cursor-pointer shadow-lg group"
            >
              {/* Fake backdrop image */}
              <div className="absolute inset-0 bg-surface/80 flex items-center justify-center">
                <Play className="text-white/30 group-hover:text-primary transition-colors" size={48} />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 flex flex-col justify-end p-4">
                <span className="text-white font-bold">{item.title}</span>
                <span className="text-text/70 text-sm">
                  {item.type === 'tv' ? `S${item.season} E${item.episode}` : 'Movie'}
                </span>
                
                {/* Progress bar */}
                <div className="w-full h-1 bg-white/20 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ContinueWatching;
