import React, { useState } from 'react';
import { Bell, Search, Info, DownloadCloud, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'info', message: 'Welcome to the Next-Gen Media Universe experience!', time: 'Just now' },
  { id: 2, type: 'download', message: 'Interstellar has finished downloading.', time: '2 mins ago' },
  { id: 3, type: 'alert', message: 'Your Pro subscription renews in 3 days.', time: '1 hour ago' },
];

const Topbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      navigate(`/discovery?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="h-24 w-full flex items-center justify-between px-8 z-50 sticky top-0 bg-background/50 backdrop-blur-2xl border-b border-white/5">
      <div className="flex-1 max-w-2xl">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
          <div className="relative flex items-center bg-surface/80 border border-white/10 rounded-full px-4 py-3 shadow-inner">
            <Search className="text-primary/70" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search anime, movies, series..." 
              className="w-full bg-transparent border-none pl-4 text-sm text-white placeholder:text-text-muted focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 ml-8 relative">
        <motion.button 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }} 
          onClick={() => setShowNotifications(!showNotifications)}
          className={`relative p-2.5 rounded-full border transition-all shadow-lg ${showNotifications ? 'bg-primary/20 text-primary border-primary/50' : 'text-text-muted hover:text-white bg-surface/50 border-white/5 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(0,255,204,0.3)]'}`}
        >
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_rgba(0,255,204,1)] animate-pulse"></span>
        </motion.button>

        <AnimatePresence>
          {showNotifications && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-14 right-0 w-80 bg-surface/90 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.7)] overflow-hidden z-50"
            >
              <div className="p-4 border-b border-white/10 bg-white/5">
                <h3 className="text-white font-bold tracking-wide">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto hide-scrollbar">
                {MOCK_NOTIFICATIONS.map((notif) => (
                  <div key={notif.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-3 cursor-pointer">
                    <div className="mt-1 shrink-0">
                      {notif.type === 'info' && <Info size={18} className="text-blue-400" />}
                      {notif.type === 'download' && <DownloadCloud size={18} className="text-primary" />}
                      {notif.type === 'alert' && <AlertCircle size={18} className="text-accent" />}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium leading-tight mb-1">{notif.message}</p>
                      <p className="text-text-muted text-xs">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-white/10 hover:bg-white/5 cursor-pointer transition-colors">
                <span className="text-primary text-xs font-bold uppercase tracking-wider">Mark all as read</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Topbar;
