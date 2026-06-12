import React from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Filter } from 'lucide-react';

const Search = () => {
  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <SearchIcon className="text-primary" size={32} />
          <h1 className="text-4xl font-bold text-white">Universal Search</h1>
        </div>
        <button className="flex items-center gap-2 bg-surface/50 border border-white/10 px-4 py-2 rounded-lg text-white hover:bg-white/5 transition-colors">
          <Filter size={18} />
          <span>Advanced Filters</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 mb-8 overflow-x-auto hide-scrollbar">
        {['All', 'Movies', 'TV Shows', 'Anime', 'Actors', 'Studios', 'Networks'].map((filter) => (
          <button key={filter} className={`px-4 py-1.5 rounded-full border ${filter === 'All' ? 'bg-primary text-background border-primary' : 'bg-transparent border-white/20 text-text hover:border-white/50'}`}>
            {filter}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-white/80 mb-6">Recent Searches</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[1, 2, 3, 4, 5].map((item) => (
          <motion.div 
            key={item} 
            whileHover={{ scale: 1.05 }}
            className="aspect-[2/3] rounded-xl bg-surface/50 border border-white/5 overflow-hidden relative cursor-pointer shadow-lg group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 flex flex-col justify-end p-4">
              <span className="text-white font-bold text-sm">Search Result {item}</span>
              <span className="text-primary text-[10px]">Movie</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Search;
