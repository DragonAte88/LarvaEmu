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

function App() {
  return (
    <HashRouter>
      <div className="flex h-screen w-screen overflow-hidden bg-background text-text">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full relative">
          {/* Ambient background glow */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>
          
          <Topbar />
          
          <main className="flex-1 overflow-y-auto p-8 z-10 relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/discovery" element={<Search />} />
              <Route path="/anime" element={<Anime />} />
              <Route path="/details" element={<Details />} />
              <Route path="/downloads" element={<Downloads />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
