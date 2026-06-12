import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';

const Anime = () => {
  const sections = [
    { title: 'Simulcasts (wco.tv)', items: [1, 2, 3, 4, 5] },
    { title: 'Top Rated Anime', items: [6, 7, 8, 9, 10] },
    { title: 'Recently Added Cartoons', items: [11, 12, 13, 14, 15] },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
        <PlayCircle className="text-primary" size={32} />
        <h1 className="text-4xl font-bold text-white">Anime & Cartoons</h1>
      </div>

      {/* Dynamic Sections */}
      {sections.map((section, index) => (
        <div key={index} className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-secondary">{section.title}</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
            {section.items.map((item) => (
              <motion.div 
                key={item} 
                whileHover={{ scale: 1.05 }}
                className="snap-start flex-none w-48 aspect-[2/3] rounded-xl bg-surface/50 border border-white/5 overflow-hidden relative cursor-pointer shadow-lg group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-bold text-sm">Anime {item}</span>
                  <span className="text-secondary text-[10px]">Episode 12</span>
                </div>
                <div className="w-full h-full bg-surface/80 flex items-center justify-center text-white/20 font-bold tracking-widest uppercase text-xs text-center px-2">
                  Anime Poster
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Anime;
