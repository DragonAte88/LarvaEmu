import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Play, Plus, Check, ArrowLeft, Star, Clock, Download, ThumbsUp, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import VideoPlayer from '../components/VideoPlayer';
import { api } from '../api';
import { getDetails, getTMDBImage, TMDBMovie } from '../utils/tmdb';

const Details = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [media, setMedia] = useState<any>(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error("No ID provided");
        
        // In a real app we'd need to know if it's a tv show or movie, 
        // we'll try movie first, if it fails, try tv
        let data;
        try {
          data = await getDetails(id, 'movie');
          data.media_type = 'movie';
        } catch (e) {
          data = await getDetails(id, 'tv');
          data.media_type = 'tv';
        }
        
        setMedia(data);
        
        const list = await api.getWatchlist();
        setInWatchlist(list.some((item: any) => item.title === (data.title || data.name)));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaDetails();
  }, [id]);

  const toggleWatchlist = async () => {
    if (!media) return;
    const title = media.title || media.name;
    if (inWatchlist) {
      await api.removeFromWatchlist(title);
    } else {
      await api.addToWatchlist(title, getTMDBImage(media.poster_path));
    }
    setInWatchlist(!inWatchlist);
  };

  const handleDownload = async () => {
    if (!media) return;
    const title = media.title || media.name;
    await api.addDownload(title, 'real_url_placeholder', '1080p');
    alert(`Queued ${title} for offline download!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Metadata Error</h2>
        <p className="text-white/60 mb-8 max-w-md">{error || "Could not find media"}</p>
        <button 
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-full font-bold hover:bg-primary/90 transition-colors"
        >
          <SettingsIcon size={20} /> Open Settings
        </button>
      </div>
    );
  }

  const title = media.title || media.name;
  const releaseYear = (media.release_date || media.first_air_date || '').substring(0, 4);

  return (
    <div className="max-w-[1600px] mx-auto pb-20 relative">
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-8 left-8 z-50 p-3 bg-surface/50 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-white/10 transition-all hover:scale-110 shadow-xl group"
      >
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* Hero Backdrop -> Now Video Player Area */}
      <div className="w-full mb-16 shadow-2xl relative z-20 rounded-b-[3rem] overflow-hidden">
        {isPlaying ? (
           <VideoPlayer tmdbId={media.id} type={media.media_type || 'movie'} />
        ) : (
          <div className="relative aspect-[21/9] w-full flex items-center justify-center bg-surface">
            {media.backdrop_path && (
              <img 
                src={getTMDBImage(media.backdrop_path)} 
                className="absolute inset-0 w-full h-full object-cover opacity-60" 
                alt="backdrop" 
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
            
            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(true)}
                className="relative z-10 w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] group overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <Play size={40} className="text-white ml-2 drop-shadow-lg group-hover:text-primary transition-colors" fill="currentColor" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="flex flex-col lg:flex-row gap-12 px-8 mb-16 -mt-32 relative z-30">
        {/* Poster */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-72 aspect-[2/3] bg-surface rounded-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] shrink-0 hidden md:block relative overflow-hidden"
        >
           {media.poster_path && (
             <img 
               src={getTMDBImage(media.poster_path)} 
               className="w-full h-full object-cover" 
               alt="poster" 
             />
           )}
           <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] pointer-events-none"></div>
        </motion.div>
        
        <div className="flex-1 pt-16">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl font-black text-white mb-4 tracking-tighter drop-shadow-2xl"
          >
            {title}
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-3 text-sm font-bold text-white/80 mb-8"
          >
            <span className="text-primary tracking-wide">★ {media.vote_average?.toFixed(1)}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
            <span>{releaseYear}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
            <span className="border border-white/20 px-2 py-0.5 rounded-md text-xs bg-white/5">
              {media.adult ? 'NC-17' : 'PG-13'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
            <span className="bg-gradient-to-r from-primary/20 to-accent/20 text-white px-2 py-0.5 rounded-md text-xs border border-white/10">4K HDR</span>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted text-xl max-w-4xl mb-10 leading-relaxed font-medium"
          >
            {media.overview}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <button 
              onClick={() => setIsPlaying(true)}
              className="flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-black text-lg hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              <Play size={24} fill="currentColor" />
              <span>Play</span>
            </button>
            
            <button 
              onClick={toggleWatchlist}
              className={`p-5 bg-surface/50 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 transition-all hover:scale-110 tooltip-trigger shadow-lg group ${inWatchlist ? 'text-primary' : 'text-white'}`} 
              title="Watchlist"
            >
              {inWatchlist ? <Check size={24} /> : <Plus size={24} />}
            </button>
            
            <button className="p-5 bg-surface/50 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 transition-all hover:scale-110 tooltip-trigger shadow-lg group" title="Rate">
              <ThumbsUp size={24} className="text-white group-hover:text-primary transition-colors" />
            </button>

            <button 
              onClick={handleDownload}
              className="p-5 bg-surface/50 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 transition-all hover:scale-110 tooltip-trigger shadow-lg group ml-auto" 
              title="Download Offline"
            >
              <Download size={24} className="text-white group-hover:text-primary transition-colors" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-10 border-b border-white/10 mb-8 px-8 relative">
        {['Episodes', 'Cast', 'Details'].map((tab, i) => (
          <button key={tab} className={`pb-4 font-bold text-lg transition-colors relative ${i === 0 ? 'text-white' : 'text-text-muted hover:text-white'}`}>
            {tab}
            {i === 0 && (
              <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-5px_15px_rgba(0,255,204,0.5)]"></motion.div>
            )}
          </button>
        ))}
      </div>

      {/* Episodes / Cast list (Real TMDB Data) */}
      <div className="flex flex-col gap-4 px-8">
        {media.media_type === 'tv' && media.seasons ? (
          // TV Show logic (in a real app we'd fetch specific season episodes)
          media.seasons.map((season: any) => (
            <motion.div 
              key={season.id} 
              className="flex items-center gap-6 p-4 rounded-3xl bg-surface/20 hover:bg-surface/60 transition-all cursor-pointer group border border-transparent hover:border-white/10 shadow-lg"
            >
              <div className="w-32 aspect-video bg-background/80 rounded-2xl overflow-hidden shrink-0">
                 {season.poster_path ? (
                   <img src={getTMDBImage(season.poster_path)} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-xs">No Image</div>
                 )}
              </div>
              <div className="flex-1 pr-8">
                <h3 className="text-xl font-bold text-white mb-2">{season.name}</h3>
                <p className="text-base text-text-muted leading-relaxed line-clamp-2">{season.overview || `Season ${season.season_number}`}</p>
              </div>
            </motion.div>
          ))
        ) : media.credits?.cast ? (
          // Movie Cast logic
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {media.credits.cast.slice(0, 12).map((actor: any) => (
              <div key={actor.id} className="bg-surface/30 rounded-xl overflow-hidden text-center pb-3">
                 {actor.profile_path ? (
                   <img src={getTMDBImage(actor.profile_path)} className="w-full aspect-square object-cover mb-2" />
                 ) : (
                   <div className="w-full aspect-square bg-background mb-2" />
                 )}
                 <h4 className="font-bold text-white text-sm px-2 truncate">{actor.name}</h4>
                 <p className="text-text-muted text-xs px-2 truncate">{actor.character}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white/50 py-10">No additional details available</div>
        )}
      </div>
    </div>
  );
};

export default Details;
