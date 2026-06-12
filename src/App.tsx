import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Home from './pages/Home';
import Anime from './pages/Anime';
import Search from './pages/Search';
import Details from './pages/Details';
import Downloads from './pages/Downloads';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

function App() {
  return (
    <HashRouter>
      <div className="flex h-screen w-screen overflow-hidden bg-background text-text selection:bg-primary/30 relative">
        {/* Cinematic Ambient Background Mesh */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[150px] pointer-events-none opacity-50mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[150px] pointer-events-none opacity-50 mix-blend-screen"></div>
        <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none opacity-40 mix-blend-screen"></div>
        
        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png")' }}></div>

        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
          <Topbar />
          
          <main className="flex-1 overflow-y-auto px-8 pb-12 z-10 relative hide-scrollbar scroll-smooth">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/discovery" element={<Search />} />
              <Route path="/anime" element={<Anime />} />
              <Route path="/details/:id" element={<Details />} />
              <Route path="/downloads" element={<Downloads />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
