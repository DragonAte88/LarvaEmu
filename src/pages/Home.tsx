import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ContinueWatching from '../components/ContinueWatching';
import { api } from '../api';
import { Play, Info, Settings as SettingsIcon } from 'lucide-react';
import { getTrending, getPopular, getTMDBImage, TMDBMovie } from '../utils/tmdb';

const Home = () => {
  const navigate = useNavigate();
  const [trending, setTrending] = useState<TMDBMovie[]>([]);
  const [popularMovies, setPopularMovies] = useState<TMDBMovie[]>([]);
  const [popularTv, setPopularTv] = useState<TMDBMovie[]>([]);
  const [heroMovie, setHeroMovie] = useState<TMDBMovie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [trend, movies, tv] = await Promise.all([
          getTrending('all', 'day'),
          getPopular('movie'),
          getPopular('tv')
        ]);
        setTrending(trend);
        setPopularMovies(movies);
        setPopularTv(tv);
        if (trend.length > 0) {
          setHeroMovie(trend[0]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-3xl font-bold text-white mb-4">TMDB Configuration Required</h2>
        <p className="text-white/60 mb-8 max-w-md">{error}</p>
        <button 
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-full font-bold hover:bg-primary/90 transition-colors"
        >
          <SettingsIcon size={20} /> Open Settings
        </button>
      </div>
    );
  }

  const sections = [
    { title: 'Trending Today', items: trending.slice(1) }, // Skip hero
    { title: 'Popular Movies', items: popularMovies },
    { title: 'Popular TV Shows', items: popularTv },
  ];

  return (
    <div className="max-w-[1600px] mx-auto pb-20 mt-4">
      {/* Hero Section */}
      {heroMovie && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full h-[600px] rounded-3xl mb-16 relative overflow-hidden group shadow-2xl shadow-primary/10 cursor-pointer"
          onClick={() => navigate(`/details/${heroMovie.id}`)}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent z-10"></div>
          
          <div 
            className="absolute inset-0 bg-cover bg-center transform transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: `url(${getTMDBImage(heroMovie.backdrop_path)})` }}
          ></div>
          
          <div className="absolute bottom-0 left-0 p-12 z-20 w-full max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20 uppercase">
                  {heroMovie.media_type || 'MOVIE'}
                </span>
                <span className="px-3 py-1 bg-primary/20 backdrop-blur-md rounded-full text-xs font-bold text-primary border border-primary/30">
                  #1 TRENDING
                </span>
                <span className="flex items-center gap-1 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs font-bold text-yellow-400 border border-white/10">
                  ★ {heroMovie.vote_average?.toFixed(1)}
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">
                {heroMovie.title || heroMovie.name}
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mb-10 leading-relaxed drop-shadow-lg line-clamp-3">
                {heroMovie.overview}
              </p>
              <div className="flex gap-5">
                <button 
                  className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/details/${heroMovie.id}`);
                  }}
                >
                  <Play size={20} className="fill-current" /> Play Now
                </button>
                <button 
                  className="flex items-center gap-2 px-8 py-4 bg-surface/40 border border-white/20 text-white rounded-full font-bold hover:bg-white/20 transition-all backdrop-blur-xl hover:border-white/40"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/details/${heroMovie.id}`);
                  }}
                >
                  <Info size={20} /> More Info
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

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
                key={item.id} 
                whileHover={{ scale: 1.05, y: -10 }}
                onClick={() => navigate(`/details/${item.id}`)}
                className="snap-start flex-none w-[200px] lg:w-[220px] aspect-[2/3] rounded-2xl bg-surface border border-white/10 overflow-hidden relative cursor-pointer shadow-xl transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,255,204,0.15)] hover:border-primary/50 group"
              >
                <img 
                  src={getTMDBImage(item.poster_path)} 
                  alt={item.title || item.name}
                  className="w-full h-full object-cover absolute inset-0 z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  <span className="text-white font-black text-lg mb-1 drop-shadow-md line-clamp-2">
                    {item.title || item.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold text-xs">★ {item.vote_average?.toFixed(1)}</span>
                    <span className="text-white/60 text-xs">
                      {(item.release_date || item.first_air_date || '').substring(0, 4)}
                    </span>
                  </div>
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
