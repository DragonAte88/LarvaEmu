import React from 'react';
import { Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Topbar = () => {
  return (
    <div className="h-24 w-full flex items-center justify-between px-8 z-20 sticky top-0 bg-background/50 backdrop-blur-2xl border-b border-white/5">
      <div className="flex-1 max-w-2xl">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative flex items-center bg-surface/80 border border-white/10 rounded-full px-4 py-3 shadow-inner">
            <Search className="text-primary/70" size={20} />
            <input 
              type="text" 
              placeholder="Search anime, movies, series..." 
              className="w-full bg-transparent border-none pl-4 text-sm text-white placeholder:text-text-muted focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 ml-8">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative p-2.5 text-text-muted hover:text-white bg-surface/50 rounded-full border border-white/5 transition-all hover:border-primary/50 hover:shadow-[0_0_15px_rgba(0,255,204,0.3)]">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_rgba(0,255,204,1)] animate-pulse"></span>
        </motion.button>
      </div>
    </div>
  );
};

export default Topbar;
