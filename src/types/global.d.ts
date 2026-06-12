export interface ElectronAPI {
  getWatchlist: () => Promise<any[]>;
  addToWatchlist: (item: any) => Promise<void>;
  removeFromWatchlist: (id: string) => Promise<void>;
  
  getHistory: () => Promise<any[]>;
  updateHistory: (item: any) => Promise<void>;
  
  getSetting: (key: string) => Promise<string | null>;
  setSetting: (key: string, value: string) => Promise<void>;

  addDownload: (title: string, url: string, quality: string) => Promise<void>;
  getDownloadQueue: () => Promise<any[]>;
  onDownloadQueueUpdated: (callback: (queue: any[]) => void) => void;

  setDiscordActivity: (details: string, state?: string) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
