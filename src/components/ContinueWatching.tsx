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
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
        className="mb-14"
      >
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Continue Watching</h2>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
        </div>
        <div className="w-full h-32 rounded-2xl border border-white/5 bg-surface/30 flex items-center justify-center">
          <span className="text-white/40 font-medium">Your watch history is empty. Start watching to see titles here.</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-14"
    >
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Continue Watching</h2>
        <div className="h-[2px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory hide-scrollbar group/slider">
        {history.map((item) => {
          const progressPercent = item.total_ms > 0 ? (item.progress_ms / item.total_ms) * 100 : 0;
          
          return (
            <motion.div 
              key={item.id} 
              whileHover={{ scale: 1.05, y: -10 }}
              className="snap-start flex-none w-[320px] aspect-video rounded-2xl bg-surface border border-white/10 overflow-hidden relative cursor-pointer shadow-xl transition-all duration-300 hover:shadow-[0_20px_40px_rgba(168,85,247,0.15)] hover:border-accent/50 group"
            >
              {/* Fake backdrop image */}
              <div className="absolute inset-0 bg-surface/80 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] mix-blend-overlay"></div>
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <Play className="text-white group-hover:text-primary fill-current ml-1" size={24} />
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10 flex flex-col justify-end p-5">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <span className="text-white font-bold text-lg leading-tight block drop-shadow-md">{item.title}</span>
                    <span className="text-primary font-medium text-xs uppercase tracking-wider">
                      {item.type === 'tv' ? `S${item.season} E${item.episode}` : 'Movie'}
                    </span>
                  </div>
                  <span className="text-white/50 text-xs font-mono">{Math.round(progressPercent)}%</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative"
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/50 blur-sm"></div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ContinueWatching;
