import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // DB
  getWatchlist: () => ipcRenderer.invoke('db:getWatchlist'),
  addToWatchlist: (item: any) => ipcRenderer.invoke('db:addToWatchlist', item),
  removeFromWatchlist: (id: string) => ipcRenderer.invoke('db:removeFromWatchlist', id),
  
  getHistory: () => ipcRenderer.invoke('db:getHistory'),
  updateHistory: (item: any) => ipcRenderer.invoke('db:updateHistory', item),
  
  getSetting: (key: string) => ipcRenderer.invoke('db:getSetting', key),
  setSetting: (key: string, value: string) => ipcRenderer.invoke('db:setSetting', key, value),

  // Downloads
  addDownload: (title: string, url: string, quality: string) => ipcRenderer.invoke('downloads:add', title, url, quality),
  getDownloadQueue: () => ipcRenderer.invoke('downloads:getQueue'),
  onDownloadQueueUpdated: (callback: (queue: any[]) => void) => {
    ipcRenderer.on('download-queue-updated', (_, queue) => callback(queue));
  },

  // Discord
  setDiscordActivity: (details: string, state?: string) => ipcRenderer.invoke('discord:setActivity', details, state),
});
