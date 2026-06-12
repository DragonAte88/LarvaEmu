import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Maximize, Settings, Volume2, VolumeX, SkipForward, Loader2, CheckCircle, XCircle, Search, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Hls from 'hls.js';
import axios from 'axios';
import { providerEngine, StreamResponse } from '../engine/ProviderEngine';

interface ScanResult {
  providerName: string;
  status: 'pending' | 'scanning' | 'found' | 'failed';
  streamUrl?: string;
  quality?: string;
}

const VideoPlayer = ({ tmdbId, type, season, episode }: { tmdbId: number | string, type: 'movie' | 'tv', season?: number, episode?: number }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Streaming State
  const [activeStream, setActiveStream] = useState<StreamResponse | null>(null);
  const [subtitles, setSubtitles] = useState<{language: string, url: string, label: string}[]>([]);
  const [activeSub, setActiveSub] = useState<string>('');
  
  // Scanner State
  const [isScanning, setIsScanning] = useState(true);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [successfulStreams, setSuccessfulStreams] = useState<StreamResponse[]>([]);

  useEffect(() => {
    let isMounted = true;

    const startScanning = async () => {
      setIsScanning(true);
      
      // 1. Get all iframe templates
      const baseStreams = await providerEngine.resolveAll({
        tmdbId: tmdbId.toString(),
        type, season, episode,
        title: 'Auto', year: ''
      });

      // Initialize Scanner UI
      const initialResults = baseStreams.map(s => ({
        providerName: s.providerName,
        status: 'pending' as const,
        embedUrl: s.streamUrl
      }));
      if (isMounted) setScanResults(initialResults);

      // 2. Fetch Subtitles in background
      axios.get(`http://localhost:5173/api/subtitles?tmdbId=${tmdbId}&type=${type}${season ? `&season=${season}` : ''}${episode ? `&episode=${episode}` : ''}`)
        .then(res => {
          if (isMounted && res.data) setSubtitles(res.data);
        }).catch(err => console.error("Subs fetch failed", err));

      // 3. Batch Scan Servers (5 at a time)
      const batchSize = 5;
      const foundStreams: StreamResponse[] = [];
      
      for (let i = 0; i < baseStreams.length; i += batchSize) {
        if (!isMounted) return;
        const batch = baseStreams.slice(i, i + batchSize);
        
        // Mark batch as scanning
        setScanResults(prev => prev.map(r => 
          batch.find(b => b.providerName === r.providerName) ? { ...r, status: 'scanning' } : r
        ));

        // Execute extraction for batch
        const promises = batch.map(async (provider) => {
          try {
            const res = await axios.post('http://localhost:5173/api/extract', {
              url: provider.streamUrl,
              providerId: provider.providerName
            });
            if (res.data && res.data.streamUrl) {
              const newStream: StreamResponse = {
                ...provider,
                streamUrl: res.data.streamUrl, // Extracted raw stream!
                quality: res.data.quality || 'Auto',
                isIframe: false
              };
              foundStreams.push(newStream);
              return { name: provider.providerName, status: 'found', url: res.data.streamUrl };
            }
          } catch (e) {
            // Failed
          }
          return { name: provider.providerName, status: 'failed' };
        });

        const batchResults = await Promise.all(promises);
        
        if (!isMounted) return;
        
        // Update UI
        setScanResults(prev => prev.map(r => {
          const br = batchResults.find(b => b.name === r.providerName);
          return br ? { ...r, status: br.status as any, streamUrl: br.url } : r;
        }));
        setSuccessfulStreams([...foundStreams]);
      }

      setIsScanning(false);
      
      // Auto-select best quality stream
      if (foundStreams.length > 0) {
        // Ideally we'd sort by quality here
        setActiveStream(foundStreams[0]); 
      }
    };

    if (tmdbId) {
      startScanning();
    }

    return () => { isMounted = false; };
  }, [tmdbId, type, season, episode]);

  // HLS Player Setup
  useEffect(() => {
    if (!videoRef.current || !activeStream || activeStream.isIframe) return;

    let hls: Hls | null = null;
    const video = videoRef.current;

    if (Hls.isSupported() && activeStream.streamUrl.includes('.m3u8')) {
      hls = new Hls({ maxBufferLength: 30, maxMaxBufferLength: 600 });
      hls.loadSource(activeStream.streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (isPlaying) video.play().catch(() => setIsPlaying(false));
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = activeStream.streamUrl;
      video.addEventListener('loadedmetadata', () => {
        if (isPlaying) video.play().catch(() => setIsPlaying(false));
      });
    } else {
      // MP4 fallback
      video.src = activeStream.streamUrl;
      if (isPlaying) video.play().catch(() => setIsPlaying(false));
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [activeStream]);

  // Video Controls Handlers
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percent = x / bounds.width;
    videoRef.current.currentTime = percent * duration;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const m = Math.floor(time / 60).toString().padStart(2, '0');
    const s = Math.floor(time % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group border border-white/10 shadow-2xl"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* 1. The Native Custom Player */}
      {activeStream && !activeStream.isIframe ? (
        <video 
          ref={videoRef}
          className="w-full h-full"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          crossOrigin="anonymous"
          onClick={togglePlay}
        >
          {/* Subtitle Injection */}
          {subtitles.map((sub, i) => (
            <track 
              key={i} 
              kind="subtitles" 
              srcLang={sub.language} 
              label={sub.label} 
              src={sub.url} 
              default={sub.url === activeSub}
            />
          ))}
        </video>
      ) : activeStream && activeStream.isIframe ? (
        <iframe src={activeStream.streamUrl} className="w-full h-full border-none" allowFullScreen />
      ) : (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-white/50 p-8">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
            <Search className="animate-pulse text-primary" />
            Ad-Free Engine: Extracting Raw Streams
          </h2>
          
          {/* Scanner Progress Grid */}
          <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-4">
            {scanResults.map((res, i) => (
              <div key={i} className={`p-3 rounded-xl border flex items-center gap-2 text-sm transition-all ${
                res.status === 'found' ? 'bg-primary/20 border-primary/50 text-white shadow-[0_0_15px_rgba(102,252,241,0.2)]' : 
                res.status === 'scanning' ? 'bg-white/10 border-white/30 text-white animate-pulse' : 
                res.status === 'failed' ? 'bg-red-500/10 border-red-500/30 text-white/40' :
                'bg-surface border-white/10 text-white/30'
              }`}>
                {res.status === 'found' && <CheckCircle size={16} className="text-primary" />}
                {res.status === 'scanning' && <Loader2 size={16} className="animate-spin text-white" />}
                {res.status === 'failed' && <XCircle size={16} className="text-red-500/50" />}
                {res.status === 'pending' && <div className="w-4 h-4 rounded-full border border-white/20"></div>}
                
                <span className="truncate font-medium flex-1">{res.providerName}</span>
              </div>
            ))}
          </div>

          {!isScanning && successfulStreams.length === 0 && (
             <p className="text-red-400 mt-6 text-lg">No raw streams found. Try a different title or disable the ad-blocker engine.</p>
          )}
        </div>
      )}

      {/* Overlay Gradient */}
      <AnimatePresence>
        {showControls && activeStream && !activeStream.isIframe && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Top Bar (Only for Custom Player) */}
      <AnimatePresence>
        {showControls && activeStream && !activeStream.isIframe && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="absolute top-0 w-full p-6 flex justify-between items-start z-50 pointer-events-auto"
          >
            <div>
              <h2 className="text-white font-bold text-xl drop-shadow-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#66FCF1]"></span>
                Ad-Free Premium Stream
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Server Dropdown UI */}
              <div className="bg-surface/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-white font-bold shadow-lg">
                 Server: {activeStream.providerName}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Bottom Controls */}
      <AnimatePresence>
        {showControls && activeStream && !activeStream.isIframe && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-0 w-full p-6 pointer-events-auto"
          >
            {/* Progress Bar */}
            <div 
              className="w-full h-2 bg-white/20 rounded-full mb-4 cursor-pointer relative group/progress"
              onClick={handleSeek}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-primary rounded-full shadow-[0_0_10px_rgba(102,252,241,0.8)]"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform"></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-6">
                <button onClick={togglePlay} className="hover:text-primary transition-colors hover:scale-110 active:scale-95">
                  {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                </button>
                <button className="hover:text-primary transition-colors" title="Skip +10s" onClick={() => videoRef.current && (videoRef.current.currentTime += 10)}>
                  <SkipForward size={24} />
                </button>
                <div className="flex items-center gap-2 group/vol">
                  {volume === 0 ? <VolumeX size={24} className="hover:text-primary cursor-pointer" onClick={() => {setVolume(1); if(videoRef.current) videoRef.current.volume=1;}} /> : 
                   <Volume2 size={24} className="hover:text-primary cursor-pointer" onClick={() => {setVolume(0); if(videoRef.current) videoRef.current.volume=0;}} />}
                  <input 
                    type="range" min="0" max="1" step="0.1" value={volume} 
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setVolume(v);
                      if(videoRef.current) videoRef.current.volume = v;
                    }}
                    className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300 accent-primary"
                  />
                </div>
                <span className="text-sm font-medium tracking-wider">{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>

              <div className="flex items-center gap-6">
                {subtitles.length > 0 && (
                  <button onClick={() => {
                    const nextSub = subtitles.find(s => s.url !== activeSub)?.url || '';
                    setActiveSub(nextSub);
                  }} className={`flex items-center gap-2 text-sm font-medium transition-colors ${activeSub ? 'text-primary' : 'hover:text-primary'}`}>
                    <Type size={20} />
                    {activeSub ? 'Subtitles On' : 'Subtitles Off'}
                  </button>
                )}
                <button className="hover:text-primary transition-colors"><Settings size={24} /></button>
                <button onClick={toggleFullscreen} className="hover:text-primary transition-colors hover:scale-110"><Maximize size={24} /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Huge Center Play Button for paused native player */}
      <AnimatePresence>
        {!isPlaying && activeStream && !activeStream.isIframe && showControls && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <button 
              onClick={togglePlay}
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
