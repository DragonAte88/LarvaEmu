import { ProviderPlugin, MediaRequest, StreamResponse } from '../ProviderEngine';
import axios from 'axios';

export const VixSrcProvider: ProviderPlugin = {
  name: 'VixSrc',
  id: 'vixsrc',
  version: '1.0.0',
  type: 'all',
  baseUrl: 'https://vixsrc.net', // Example domain
  
  async resolveStream(request: MediaRequest): Promise<StreamResponse[]> {
    console.log(`[VixSrc] Searching for TMDB ID: ${request.tmdbId}`);
    
    if (!request.tmdbId) {
      console.warn('[VixSrc] No TMDB ID provided, skipping.');
      return [];
    }

    // Construct the real embed URL based on TMDB ID
    let embedUrl = '';
    if (request.type === 'movie') {
      embedUrl = `${this.baseUrl}/embed/movie?tmdb=${request.tmdbId}`;
    } else {
      const s = request.season || 1;
      const e = request.episode || 1;
      embedUrl = `${this.baseUrl}/embed/tv?tmdb=${request.tmdbId}&season=${s}&episode=${e}`;
    }

    // Since Vidsrc uses an iframe embed and encrypts the direct .m3u8, 
    // we return the embed URL for the player to render in a webview/iframe.
    return [
      {
        providerName: 'VixSrc Live',
        streamUrl: embedUrl,
        quality: 'Auto',
        subtitles: []
      }
    ];
  }
};
