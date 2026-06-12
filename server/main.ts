import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { initDatabase, dbAPI } from './database';
import { downloadManager } from './downloadManager';
import { startMediaServer } from './mediaServer';
import { initDiscordRPC, setActivity } from './discord';

const createWindow = () => {
  // Initialize the SQLite DB
  initDatabase();
  
  // Initialize Discord RPC
  initDiscordRPC();

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    titleBarStyle: 'hidden', // Next-gen UI
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'), // Vite builds this to .mjs
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Setup IPC Handlers
  ipcMain.handle('db:getWatchlist', () => dbAPI.getWatchlist());
  ipcMain.handle('db:addToWatchlist', (_, item) => dbAPI.addToWatchlist(item));
  ipcMain.handle('db:removeFromWatchlist', (_, id) => dbAPI.removeFromWatchlist(id));
  
  ipcMain.handle('db:getHistory', () => dbAPI.getHistory());
  ipcMain.handle('db:updateHistory', (_, item) => dbAPI.updateHistory(item));
  
  ipcMain.handle('db:getSetting', (_, key) => dbAPI.getSetting(key));
  ipcMain.handle('db:setSetting', (_, key, value) => dbAPI.setSetting(key, value));

  // Download Manager IPC
  ipcMain.handle('downloads:add', (_, title, url, quality) => downloadManager.addJob(title, url, quality));
  ipcMain.handle('downloads:getQueue', () => downloadManager.getQueue());

  // Start Offline Media Server
  startMediaServer();

  // Discord IPC
  ipcMain.handle('discord:setActivity', (_, details, state) => setActivity(details, state));

  // Load the index.html of the app.
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
