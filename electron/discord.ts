import DiscordRPC from 'discord-rpc';

// App ID for Media Universe. In a real app, you would create this on the Discord Developer Portal.
const clientId = '123456789012345678'; 
let rpc: DiscordRPC.Client | null = null;
let isReady = false;

export const initDiscordRPC = () => {
  DiscordRPC.register(clientId);
  rpc = new DiscordRPC.Client({ transport: 'ipc' });

  rpc.on('ready', () => {
    isReady = true;
    console.log('[DiscordRPC] Connected as', rpc?.user?.username);
    setActivity('Browsing Library');
  });

  rpc.login({ clientId }).catch((err) => {
    console.error('[DiscordRPC] Could not connect to Discord:', err);
  });
};

export const setActivity = (details: string, state?: string, startTimestamp?: Date) => {
  if (!rpc || !isReady) return;

  rpc.setActivity({
    details,
    state,
    startTimestamp,
    largeImageKey: 'logo', // Assuming 'logo' is uploaded to Discord portal
    largeImageText: 'Media Universe',
    instance: false,
  }).catch(console.error);
};
