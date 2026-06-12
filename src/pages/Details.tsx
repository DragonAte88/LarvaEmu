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
    <div className="max-w-7xl mx-auto pb-20">
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-8 left-8 z-50 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Hero Backdrop -> Now Video Player Area */}
      <div className="w-full mb-12 shadow-2xl relative z-20">
        {isPlaying ? (
           <VideoPlayer />
        ) : (
          <div className="relative aspect-video w-full flex items-center justify-center overflow-hidden">
            <img src={media.backdrop} className="absolute inset-0 w-full h-full object-cover" alt="backdrop" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <button 
                onClick={() => setIsPlaying(true)}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl"
            >
              <Play size={32} className="text-black ml-1" fill="black" />
            </button>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="flex gap-10 px-4 mb-12">
        {/* Poster */}
        <div className="w-64 aspect-[2/3] bg-surface/80 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] shrink-0 hidden md:block relative overflow-hidden">
           <img src={media.poster} className="w-full h-full object-cover" alt="poster" />
        </div>
        
        <div className="flex-1 pb-4">
          <h1 className="text-6xl font-black text-white mb-4 tracking-tight text-glow">{media.title}</h1>
          
          <div className="flex items-center gap-4 text-sm font-medium text-white/80 mb-6">
            <span className="text-green-400 font-bold">98% Match</span>
            <span>1999</span>
            <span className="border border-white/20 px-2 py-0.5 rounded text-xs">R</span>
            <span>2h 16m</span>
            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs border border-primary/30">4K HDR</span>
          </div>
          
          <p className="text-text/90 text-lg max-w-3xl mb-8 leading-relaxed">
            When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth—the life he knows is the elaborate deception of an evil cyber-intelligence.
          </p>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-8 py-4 bg-primary text-background rounded-full font-bold hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(102,252,241,0.4)] hover:shadow-[0_0_40px_rgba(102,252,241,0.6)]">
              <Play size={24} fill="currentColor" />
              <span>Resume</span>
            </button>
            
            <button className="p-4 bg-surface/50 border border-white/10 rounded-full hover:bg-white/10 transition-colors tooltip-trigger" title="Add to Watchlist">
              <Plus size={24} className="text-white" />
            </button>
            
            <button className="p-4 bg-surface/50 border border-white/10 rounded-full hover:bg-white/10 transition-colors tooltip-trigger" title="Rate">
              <ThumbsUp size={24} className="text-white" />
            </button>

            <button className="p-4 bg-surface/50 border border-white/10 rounded-full hover:bg-white/10 transition-colors tooltip-trigger ml-auto" title="Download Offline">
              <Download size={24} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-white/10 mb-8 px-4">
        {['Episodes', 'More Like This', 'Details'].map((tab, i) => (
          <button key={tab} className={`pb-4 font-medium transition-colors ${i === 0 ? 'text-white border-b-2 border-primary' : 'text-text hover:text-white'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Episode List Mock */}
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((ep) => (
          <div key={ep} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-white/5">
            <div className="text-2xl font-black text-white/20 w-12 text-center group-hover:text-primary transition-colors">{ep}</div>
            <div className="w-48 aspect-video bg-surface/50 rounded-lg relative overflow-hidden shrink-0">
               <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={32} className="text-white" fill="white" />
               </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">Episode Title {ep}</h3>
                <span className="text-sm text-text">45m</span>
              </div>
              <p className="text-sm text-text/70 line-clamp-2">A brief description of the episode goes here, detailing the plot without spoiling the ending.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Details;
