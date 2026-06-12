import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Filter, Loader2, Play } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchMulti, getTMDBImage } from '../utils/tmdb';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';

  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        setIsLoading(true);
        try {
          const res = await searchMulti(query);
          setResults(res);
        } catch (error) {
          console.error("Search failed", error);
        }
        setIsLoading(false);
      };
      fetchResults();
    } else {
      setResults([]);
    }
  }, [query]);

  // Filter Logic
  const filteredResults = results.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Movies') return item.media_type === 'movie';
    if (activeFilter === 'TV Shows') return item.media_type === 'tv' && !item.genre_ids?.includes(16);
    if (activeFilter === 'Anime') return item.media_type === 'tv' && item.genre_ids?.includes(16);
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto pb-20 pt-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-surface border border-white/10 flex items-center justify-center shadow-lg">
            <SearchIcon className="text-primary" size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">Universal Search</h1>
            {query && <p className="text-text-muted mt-1 text-sm">Showing results for: <span className="text-white font-bold">"{query}"</span></p>}
          </div>
        </div>
        <button className="flex items-center gap-2 bg-surface/50 border border-white/10 px-6 py-3 rounded-full text-white hover:bg-white/10 transition-colors shadow-lg font-bold text-sm">
          <Filter size={18} />
          <span>Advanced Filters</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 mb-12 overflow-x-auto hide-scrollbar pb-2">
        {['All', 'Movies', 'TV Shows', 'Anime'].map((filter) => (
          <button 
            key={filter} 
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all border shadow-lg ${activeFilter === filter ? 'bg-primary text-background border-primary hover:bg-primary/90' : 'bg-surface/50 border-white/10 text-white hover:border-white/30 hover:bg-white/5'}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {!query ? (
        <div className="w-full h-64 border border-white/5 bg-surface/30 rounded-3xl flex flex-col items-center justify-center text-center p-8">
          <SearchIcon size={48} className="text-white/20 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Search the Universe</h2>
          <p className="text-text-muted max-w-md">Type a keyword into the top bar to scour the connected stream sites and build your library.</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 size={48} className="text-primary animate-spin" />
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="text-center py-20 bg-surface/30 rounded-3xl border border-white/5">
          <p className="text-2xl font-bold text-white mb-2">No results found</p>
          <p className="text-text-muted">We couldn't find any titles matching "{query}" with filter "{activeFilter}"</p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold text-white mb-6 tracking-wide">Top Results ({filteredResults.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredResults.map((item: any, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/details/${item.id}`)}
                key={item.id} 
                className="aspect-[2/3] rounded-2xl bg-surface border border-white/10 overflow-hidden relative cursor-pointer shadow-xl transition-all duration-300 hover:shadow-[0_20px_40px_rgba(168,85,247,0.15)] hover:border-accent/50 hover:-translate-y-2 group"
              >
                {item.poster_path ? (
                  <img src={getTMDBImage(item.poster_path)} alt={item.title || item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface">
                    <span className="text-white/20 font-bold text-center p-2">{item.title || item.name}</span>
                  </div>
                )}
                
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                   <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(0,255,204,0.6)] scale-75 group-hover:scale-100 transition-transform duration-300">
                     <Play className="text-background ml-1" size={24} fill="currentColor" />
                   </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 flex flex-col justify-end p-5 opacity-100 transition-opacity">
                  <span className="text-white font-bold text-base leading-tight block drop-shadow-md line-clamp-2 mb-1">{item.title || item.name}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-[10px] uppercase tracking-widest">{item.media_type}</span>
                    <span className="text-text-muted text-[10px]">{(item.release_date || item.first_air_date || '').substring(0, 4)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
