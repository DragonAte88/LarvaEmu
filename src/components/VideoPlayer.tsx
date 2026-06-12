import React, { useState, useEffect } from 'react';
import { Play, Pause, Maximize, Settings, Volume2, SkipForward, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import engine from '../engine';
import { StreamResponse } from '../engine/ProviderEngine';

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [stream, setStream] = useState<StreamResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStream = async () => {
      setIsLoading(true);
      const streams = await engine.resolveAll({
        title: 'The Matrix',
        type: 'movie',
        year: '1999'
      });
      if (streams.length > 0) {
        setStream(streams[0]); // Best Ranked
      }
      setIsLoading(false);
    };
    fetchStream();
  }, []);

  return (
    <div 
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group border border-white/10 shadow-2xl"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Mock Video Element */}
      <div className="absolute inset-0 flex items-center justify-center text-white/50 font-bold text-2xl tracking-widest">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
             <Loader2 size={48} className="animate-spin text-primary" />
             <span>Scraping Sources...</span>
          </div>
        ) : stream ? (
          `Playing: ${stream.streamUrl}`
        ) : (
          'No Streams Found'
        )}
      </div>

      {/* Overlay Gradient */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Top Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="absolute top-0 w-full p-6 flex justify-between items-center"
          >
            <div>
              <h2 className="text-white font-bold text-lg drop-shadow-md">The Matrix</h2>
              <p className="text-white/70 text-sm drop-shadow-md">
                {stream ? `Provider: ${stream.providerName} (${stream.quality})` : 'Finding best source...'}
              </p>
            </div>
            <button className="bg-surface/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white font-medium hover:bg-white/20 transition-colors">
              {stream ? `Source: Auto (${stream.providerName})` : 'Source: Auto'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Play/Pause */}
      <AnimatePresence>
        {showControls && (
          <motion.button 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary/20 backdrop-blur-xl border border-primary/50 rounded-full flex items-center justify-center text-primary hover:bg-primary/30 transition-colors shadow-[0_0_30px_rgba(102,252,241,0.3)]"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-0 w-full p-6"
          >
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer relative group/progress">
              <div className="absolute top-0 left-0 h-full w-1/3 bg-primary rounded-full shadow-[0_0_10px_rgba(102,252,241,0.8)]">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform"></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-6">
                <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-primary transition-colors">
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>
                <button className="hover:text-primary transition-colors tooltip-trigger" title="Skip Intro">
                  <SkipForward size={24} />
                </button>
                <div className="flex items-center gap-2 group/vol">
                  <Volume2 size={24} className="hover:text-primary transition-colors cursor-pointer" />
                  <div className="w-0 overflow-hidden group-hover/vol:w-24 transition-all duration-300 h-1.5 bg-white/20 rounded-full">
                    <div className="h-full w-2/3 bg-primary rounded-full"></div>
                  </div>
                </div>
                <span className="text-sm font-medium">00:52:14 / 02:16:00</span>
              </div>

              <div className="flex items-center gap-6">
                <button className="text-sm font-medium hover:text-primary transition-colors">English (CC)</button>
                <button className="hover:text-primary transition-colors"><Settings size={24} /></button>
                <button className="hover:text-primary transition-colors"><Maximize size={24} /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPlayer;
