import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ContinueWatching from '../components/ContinueWatching';
import { api } from '../api';
import { Play, Info } from 'lucide-react';

const Home = () => {
  const [watchlistCount, setWatchlistCount] = useState(0);

  useEffect(() => {
    api.getWatchlist().then((list: any[]) => setWatchlistCount(list.length));
  }, []);

  const sections = [
    { title: 'Trending Now', items: [1, 2, 3, 4, 5, 6, 7] },
    { title: 'New Releases', items: [8, 9, 10, 11, 12, 13, 14] },
    { title: 'Because You Watched Inception', items: [15, 16, 17, 18, 19, 20, 21] },
  ];

  return (
    <div className="max-w-[1600px] mx-auto pb-20 mt-4">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full h-[600px] rounded-3xl mb-16 relative overflow-hidden group shadow-2xl shadow-primary/10"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent z-10"></div>
        
        {/* Placeholder for Hero Backdrop with abstract pattern */}
        <div className="absolute inset-0 bg-surface/80">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #00ffcc 0%, transparent 50%), radial-gradient(circle at 80% 20%, #a855f7 0%, transparent 40%)' }}></div>
        </div>
        
        <div className="absolute bottom-0 left-0 p-12 z-20 w-full max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20">MOVIE</span>
              <span className="px-3 py-1 bg-primary/20 backdrop-blur-md rounded-full text-xs font-bold text-primary border border-primary/30">#1 TRENDING</span>
            </div>
            <h1 className="text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">Interstellar</h1>
            <p className="text-lg text-white/80 max-w-xl mb-10 leading-relaxed drop-shadow-md">
              A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.
            </p>
            <div className="flex gap-5">
              <button 
                className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                onClick={() => {
                  api.updateHistory({
                    title: 'Interstellar',
                    url: 'Neon',
                    quality: '1080p',
                    time: 1200000,
                    duration: 10140000
                  });
                  alert('Mock history added! Refresh page to see Continue Watching.');
                }}
              >
                <Play size={20} className="fill-current" /> Play Now
              </button>
              <button className="flex items-center gap-2 px-8 py-4 bg-surface/30 border border-white/20 text-white rounded-full font-bold hover:bg-white/10 transition-all backdrop-blur-xl hover:border-white/40">
                <Info size={20} /> More Info
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <ContinueWatching />

      {/* Dynamic Sections */}
      {sections.map((section, index) => (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          key={index} 
          className="mb-14"
        >
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">{section.title}</h2>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory hide-scrollbar group/slider">
            {section.items.map((item) => (
              <motion.div 
                key={item} 
                whileHover={{ scale: 1.05, y: -10 }}
                className="snap-start flex-none w-[220px] aspect-[2/3] rounded-2xl bg-surface border border-white/10 overflow-hidden relative cursor-pointer shadow-xl transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,255,204,0.15)] hover:border-primary/50 group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  <span className="text-white font-black text-lg mb-1 drop-shadow-md">Title {item}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold text-xs">98% Match</span>
                    <span className="text-white/60 text-xs">2026</span>
                  </div>
                </div>
                <div className="w-full h-full bg-surface/80 flex items-center justify-center text-white/10 font-bold tracking-widest uppercase text-sm group-hover:scale-110 transition-transform duration-700">
                  Poster
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Home;
