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
    { icon: <PlayCircle size={20} />, label: 'Anime & Cartoons', path: '/anime' },
    { icon: <Download size={20} />, label: 'Downloads', path: '/downloads' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 h-full glass flex flex-col p-4 z-10 border-r border-white/5 bg-surface/50">
      <div className="flex items-center gap-3 mb-10 mt-6 px-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
          <PlayCircle size={18} className="text-background" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Media Universe</h1>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left ${
                isActive ? 'bg-white/10 text-white' : 'text-text hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span className="text-primary/80 group-hover:text-primary">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center">
            U
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">User Profile</span>
            <span className="text-xs text-text/60">Offline Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
