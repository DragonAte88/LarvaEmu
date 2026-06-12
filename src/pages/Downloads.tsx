import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, CheckCircle, Trash2, Clock, Play } from 'lucide-react';
import axios from 'axios';

interface DownloadJob {
  id: string;
  title: string;
  url: string;
  quality: string;
  status: 'queued' | 'downloading' | 'completed' | 'error';
  progress: number;
}

const Downloads = () => {
  const [queue, setQueue] = useState<DownloadJob[]>([]);
  const [library, setLibrary] = useState<{filename: string, url: string}[]>([]);
  const [activeTab, setActiveTab] = useState<'queue' | 'library'>('queue');

  useEffect(() => {
    // Listen to IPC updates
    window.electronAPI.getDownloadQueue().then(setQueue);
    window.electronAPI.onDownloadQueueUpdated((q) => setQueue(q));

    // Fetch local library from the express server
    axios.get('http://localhost:34567/library').then(res => setLibrary(res.data)).catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <h1 className="text-4xl font-bold text-white mb-8">Offline Manager</h1>

      <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
        <button 
          onClick={() => setActiveTab('queue')}
          className={`font-bold transition-colors ${activeTab === 'queue' ? 'text-primary' : 'text-text hover:text-white'}`}
        >
          Active Queue ({queue.filter(q => q.status !== 'completed').length})
        </button>
        <button 
          onClick={() => setActiveTab('library')}
          className={`font-bold transition-colors ${activeTab === 'library' ? 'text-primary' : 'text-text hover:text-white'}`}
        >
          My Library ({library.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'queue' ? (
          <motion.div key="queue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {queue.filter(q => q.status !== 'completed').length === 0 ? (
              <div className="text-center py-20 text-text/50">No active downloads in the queue.</div>
            ) : (
              <div className="space-y-4">
                {queue.filter(q => q.status !== 'completed').map(job => (
                  <div key={job.id} className="bg-surface/50 border border-white/10 rounded-2xl p-6 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-6 flex-1">
                      <div className="w-16 h-16 bg-surface rounded-xl flex items-center justify-center">
                        <Download className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg">{job.title}</h3>
                        <p className="text-text text-sm mb-3">Quality: {job.quality} • Status: {job.status}</p>
                        
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full ${job.status === 'error' ? 'bg-red-500' : 'bg-primary'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${job.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-8 text-right">
                      <span className="text-2xl font-bold text-white">{job.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {library.length === 0 ? (
              <div className="col-span-full text-center py-20 text-text/50">Your offline library is empty.</div>
            ) : (
              library.map((file, idx) => (
                <div key={idx} className="bg-surface/50 border border-white/10 rounded-2xl overflow-hidden group cursor-pointer hover:border-primary transition-colors">
                  <div className="aspect-video bg-surface relative flex items-center justify-center">
                     <Play className="text-white/30 group-hover:text-primary transition-colors" size={48} />
                  </div>
                  <div className="p-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-bold truncate max-w-[200px]">{file.filename.replace('.mp4', '').replace(/_/g, ' ')}</h3>
                      <p className="text-green-400 text-xs font-bold mt-1 flex items-center gap-1"><CheckCircle size={12} /> Downloaded</p>
                    </div>
                    <button className="text-text hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Downloads;
