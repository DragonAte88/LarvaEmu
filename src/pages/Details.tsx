import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Play, Plus, Check, ArrowLeft, Star, Clock, Download, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import VideoPlayer from '../components/VideoPlayer';
import { api } from '../api';

const Details = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const media = location.state?.media;
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (media) {
      api.getWatchlist().then((list: any[]) => {
        setInWatchlist(list.some(item => item.title === media.title));
      });
    }
  }, [media]);

  const toggleWatchlist = async () => {
    if (inWatchlist) {
      await api.removeFromWatchlist(media.title);
    } else {
      await api.addToWatchlist(media.title, media.poster);
    }
    setInWatchlist(!inWatchlist);
  };

  const handleDownload = async () => {
    await api.addDownload(media.title, 'mock_url_from_provider', '1080p');
    alert(`Queued ${media.title} for offline download!`);
  };

  if (!media) return null;

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
           <VideoPlayer />
        ) : (
          <div className="relative aspect-[21/9] w-full flex items-center justify-center bg-surface">
            {media.backdrop && <img src={media.backdrop} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="backdrop" />}
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
           {media.poster && <img src={media.poster} className="w-full h-full object-cover" alt="poster" />}
           <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] pointer-events-none"></div>
        </motion.div>
        
        <div className="flex-1 pt-16">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl font-black text-white mb-4 tracking-tighter drop-shadow-2xl"
          >
            {media.title}
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-3 text-sm font-bold text-white/80 mb-8"
          >
            <span className="text-primary tracking-wide">98% Match</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
            <span>2026</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
            <span className="border border-white/20 px-2 py-0.5 rounded-md text-xs bg-white/5">R</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
            <span>2h 16m</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
            <span className="bg-gradient-to-r from-primary/20 to-accent/20 text-white px-2 py-0.5 rounded-md text-xs border border-white/10">4K HDR</span>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted text-xl max-w-4xl mb-10 leading-relaxed font-medium"
          >
            When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth—the life he knows is the elaborate deception of an evil cyber-intelligence.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <button className="flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-black text-lg hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              <Play size={24} fill="currentColor" />
              <span>Resume</span>
            </button>
            
            <button className="p-5 bg-surface/50 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 transition-all hover:scale-110 tooltip-trigger shadow-lg group" title="Add to Watchlist">
              <Plus size={24} className="text-white group-hover:text-primary transition-colors" />
            </button>
            
            <button className="p-5 bg-surface/50 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 transition-all hover:scale-110 tooltip-trigger shadow-lg group" title="Rate">
              <ThumbsUp size={24} className="text-white group-hover:text-primary transition-colors" />
            </button>

            <button className="p-5 bg-surface/50 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 transition-all hover:scale-110 tooltip-trigger shadow-lg group ml-auto" title="Download Offline">
              <Download size={24} className="text-white group-hover:text-primary transition-colors" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-10 border-b border-white/10 mb-8 px-8 relative">
        {['Episodes', 'More Like This', 'Details'].map((tab, i) => (
          <button key={tab} className={`pb-4 font-bold text-lg transition-colors relative ${i === 0 ? 'text-white' : 'text-text-muted hover:text-white'}`}>
            {tab}
            {i === 0 && (
              <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-5px_15px_rgba(0,255,204,0.5)]"></motion.div>
            )}
          </button>
        ))}
      </div>

      {/* Episode List Mock */}
      <div className="flex flex-col gap-4 px-8">
        {[1, 2, 3, 4, 5].map((ep) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ep * 0.1 }}
            key={ep} 
            className="flex items-center gap-6 p-4 rounded-3xl bg-surface/20 hover:bg-surface/60 transition-all cursor-pointer group border border-transparent hover:border-white/10 shadow-lg hover:shadow-2xl backdrop-blur-sm"
          >
            <div className="text-4xl font-black text-white/10 w-16 text-center group-hover:text-primary/50 transition-colors">{ep}</div>
            <div className="w-56 aspect-video bg-background/80 rounded-2xl relative overflow-hidden shrink-0 border border-white/5">
               <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm scale-110 group-hover:scale-100">
                  <Play size={40} className="text-white drop-shadow-lg" fill="white" />
               </div>
            </div>
            <div className="flex-1 pr-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">Episode Title {ep}</h3>
                <span className="text-sm font-bold text-text-muted bg-background/50 px-3 py-1 rounded-full border border-white/5">45m</span>
              </div>
              <p className="text-base text-text-muted leading-relaxed line-clamp-2">A brief description of the episode goes here, detailing the plot without spoiling the ending. It provides just enough context to get the viewer hooked.</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Details;
