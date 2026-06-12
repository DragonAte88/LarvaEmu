import React from 'react';
import { Home, Search, Tv, Film, PlayCircle, Settings, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { icon: <Home size={20} />, label: 'Home', path: '/' },
    { icon: <Search size={20} />, label: 'Discovery', path: '/discovery' },
    { icon: <Film size={20} />, label: 'Movies', path: '/movies' },
    { icon: <Tv size={20} />, label: 'TV Shows', path: '/tv' },
    { icon: <PlayCircle size={20} />, label: 'Anime', path: '/anime' },
    { icon: <Download size={20} />, label: 'Downloads', path: '/downloads' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 h-full glass-panel flex flex-col p-6 z-20 border-r border-white/5 bg-surface/30">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 mb-12 mt-4 px-2"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-[0_0_20px_rgba(0,255,204,0.4)]">
          <PlayCircle size={22} className="text-surface" fill="currentColor" />
        </div>
        <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Media<span className="text-primary">Uni</span>
        </h1>
      </motion.div>

      <nav className="flex-1 flex flex-col gap-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => 
              `group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 overflow-hidden ${
                isActive ? 'text-white font-bold' : 'text-text-muted hover:text-white font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 bg-white/10 border border-white/10 rounded-2xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-primary' : 'group-hover:text-primary'}`}>
                  {item.icon}
                </span>
                <span className="relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10">
        <NavLink to="/profile" className={({ isActive }) => `flex items-center gap-3 px-2 py-2 rounded-2xl cursor-pointer transition-colors ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent/20 to-primary/20 border border-white/20 flex items-center justify-center relative overflow-hidden shrink-0">
             <div className="absolute inset-0 bg-white/5 backdrop-blur-md"></div>
             <span className="relative z-10 font-bold text-white">U</span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-white tracking-wide truncate">User Profile</span>
            <span className="text-xs text-primary font-medium">Pro Member</span>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
