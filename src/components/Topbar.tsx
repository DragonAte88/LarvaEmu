import React from 'react';
import { Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Topbar = () => {
  return (
    <div className="h-16 w-full glass border-b border-white/5 flex items-center justify-between px-6 z-10 sticky top-0" style={{ WebkitAppRegion: 'drag' } as any}>
      <div className="flex-1" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50" size={18} />
          <input 
            type="text" 
            placeholder="Search movies, TV shows, anime, actors..." 
            className="w-full bg-surface/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative p-2 text-text hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(102,252,241,0.8)]"></span>
        </motion.button>
      </div>
    </div>
  );
};

export default Topbar;
