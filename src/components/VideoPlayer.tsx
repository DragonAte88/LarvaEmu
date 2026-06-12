import React, { useState, useEffect } from 'react';
import { Play, Pause, Maximize, Settings, Volume2, SkipForward, Loader2, Server, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { providerEngine } from '../engine/ProviderEngine';
import { StreamResponse } from '../engine/ProviderEngine';

const VideoPlayer = ({ tmdbId, type }: { tmdbId: number | string, type: 'movie' | 'tv' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [stream, setStream] = useState<StreamResponse | null>(null);
  const [allStreams, setAllStreams] = useState<StreamResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showServerList, setShowServerList] = useState(false);

  useEffect(() => {
    const fetchStream = async () => {
      setIsLoading(true);
      const streams = await providerEngine.resolveAll({
        tmdbId: tmdbId.toString(),
        type: type,
        title: 'Auto', // We rely on ID now
        year: ''
      });
      if (streams.length > 0) {
        setAllStreams(streams);
        setStream(streams[0]); // Default to first
      }
      setIsLoading(false);
    };
    if (tmdbId) {
      fetchStream();
    }
  }, [tmdbId, type]);

  return (
    <div 
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group border border-white/10 shadow-2xl"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Live Video Element / Iframe */}
      <div className="absolute inset-0 flex items-center justify-center text-white/50 font-bold text-2xl tracking-widest bg-black">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
             <Loader2 size={48} className="animate-spin text-primary" />
             <span>Resolving 30+ Live Sources...</span>
          </div>
        ) : stream ? (
          stream.isIframe ? (
            <iframe 
              src={stream.streamUrl} 
              allowFullScreen 
              className="w-full h-full border-none"
              title="Video Player"
            />
          ) : (
            `Playing Raw Stream: ${stream.streamUrl}`
          )
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
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Top Controls & Server Selector */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="absolute top-0 w-full p-6 flex justify-between items-start z-50 pointer-events-auto"
          >
            <div>
              <h2 className="text-white font-bold text-xl drop-shadow-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Live Stream
              </h2>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowServerList(!showServerList)}
                className="flex items-center gap-2 bg-surface/80 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/20 text-white font-bold hover:bg-white/20 hover:border-primary/50 transition-all shadow-lg"
              >
                <Server size={18} className={showServerList ? "text-primary" : "text-white/70"} />
                {stream ? `Server: ${stream.providerName}` : 'Select Server'}
                <ChevronDown size={18} className={`transition-transform duration-300 ${showServerList ? 'rotate-180 text-primary' : 'text-white/50'}`} />
              </button>

              {/* Server Dropdown UI */}
              <AnimatePresence>
                {showServerList && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-72 max-h-[60vh] overflow-y-auto bg-surface/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] custom-scrollbar z-50"
                  >
                    <div className="p-3 sticky top-0 bg-surface/90 backdrop-blur-xl border-b border-white/10 z-10">
                      <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Available Sources ({allStreams.length})</p>
                    </div>
                    <div className="p-2 flex flex-col gap-1">
                      {allStreams.map((s, idx) => (
                        <button 
                          key={idx}
                          onClick={() => { setStream(s); setShowServerList(false); setIsPlaying(true); }}
                          className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all ${stream?.providerName === s.providerName ? 'bg-primary/20 border border-primary/50 text-white' : 'hover:bg-white/5 border border-transparent text-white/70 hover:text-white'}`}
                        >
                          <span className="font-medium text-sm truncate">{s.providerName}</span>
                          {stream?.providerName === s.providerName && <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#66FCF1]"></span>}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Play/Pause Overlay (only show if not using native iframe controls or if paused) */}
      <AnimatePresence>
        {(!isPlaying || !stream?.isIframe) && showControls && !showServerList && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <button 
              onClick={() => setIsPlaying(true)}
              className="w-24 h-24 bg-primary/20 backdrop-blur-xl border border-primary/50 rounded-full flex items-center justify-center text-primary hover:bg-primary/30 transition-all hover:scale-110 shadow-[0_0_50px_rgba(102,252,241,0.3)] pointer-events-auto"
            >
              <Play size={40} fill="currentColor" className="ml-2" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default VideoPlayer;
