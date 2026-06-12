import React from 'react';
import { motion } from 'framer-motion';
import ContinueWatching from '../components/ContinueWatching';

const Home = () => {
  const sections = [
    { title: 'Trending Now', items: [1, 2, 3, 4, 5] },
    { title: 'New Releases', items: [6, 7, 8, 9, 10] },
    { title: 'Because You Watched Inception', items: [11, 12, 13, 14, 15] },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-96 rounded-2xl bg-surface/50 mb-12 border border-white/5 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10"></div>
        {/* Placeholder for Hero Backdrop */}
        <div className="absolute inset-0 flex items-center justify-center text-white/10 text-4xl font-black uppercase tracking-[0.5em] bg-surface/80">
          Hero Banner
        </div>
        <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
          <h1 className="text-5xl font-bold text-white mb-4">Interstellar</h1>
          <p className="text-text max-w-2xl mb-6">A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.</p>
          <div className="flex gap-4">
            <button 
              className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              onClick={() => {
                window.electronAPI.updateHistory({
                  id: 'tt0816692',
                  title: 'Interstellar',
                  type: 'movie',
                  progress_ms: 1200000, // 20 mins
                  total_ms: 10140000,
                  provider: 'Neon'
                });
                alert('Mock history added! Refresh page to see Continue Watching.');
              }}
            >
              Play Now (Add to History)
            </button>
            <button className="px-8 py-3 bg-surface/50 border border-white/10 text-white rounded-full font-bold hover:bg-surface transition-colors backdrop-blur-md">More Info</button>
          </div>
        </div>
      </motion.div>

      <ContinueWatching />

      {/* Dynamic Sections */}
      {sections.map((section, index) => (
        <div key={index} className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-primary">{section.title}</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
            {section.items.map((item) => (
              <motion.div 
                key={item} 
                whileHover={{ scale: 1.05 }}
                className="snap-start flex-none w-48 aspect-[2/3] rounded-xl bg-surface/50 border border-white/5 overflow-hidden relative cursor-pointer shadow-lg group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-bold text-sm">Title {item}</span>
                  <span className="text-primary text-[10px]">2026 • Movie</span>
                </div>
                <div className="w-full h-full bg-surface/80 flex items-center justify-center text-white/20 font-bold tracking-widest uppercase text-xs">
                  Poster
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
