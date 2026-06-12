export type StreamQuality = '360p' | '480p' | '720p' | '1080p' | '4K' | 'Auto';

export interface Subtitle {
  language: string;
  url: string;
  isClosedCaptions?: boolean;
}

export interface StreamResponse {
  providerName: string;
  streamUrl: string;
  quality: StreamQuality;
  subtitles: Subtitle[];
  headers?: Record<string, string>;
  isIframe?: boolean;
}

export interface MediaRequest {
  title: string;
  tmdbId?: string;
  imdbId?: string;
  year?: string;
  type: 'movie' | 'tv' | 'anime';
  season?: number;
  episode?: number;
}

export interface ProviderPlugin {
  name: string;
  id: string;
  version: string;
  type: 'movie' | 'tv' | 'anime' | 'all';
  baseUrl: string;
  
  resolveStream(request: MediaRequest): Promise<StreamResponse[]>;
}

// Utility to create a generic iframe provider
const createIframeProvider = (
  name: string, 
  id: string, 
  movieUrlFn: (tmdb: string) => string,
  tvUrlFn: (tmdb: string, s: number, e: number) => string
): ProviderPlugin => ({
  name,
  id,
  version: '1.0.0',
  type: 'all',
  baseUrl: '',
  async resolveStream(request: MediaRequest): Promise<StreamResponse[]> {
    if (!request.tmdbId) return [];
    const url = request.type === 'movie' 
      ? movieUrlFn(request.tmdbId)
      : tvUrlFn(request.tmdbId, request.season || 1, request.episode || 1);
      
    return [{
      providerName: name,
      streamUrl: url,
      quality: 'Auto',
      subtitles: [],
      isIframe: true
    }];
  }
});

// The massive list of requested providers
const IFRAME_PROVIDERS: ProviderPlugin[] = [
  // Primary (Vidsrc network)
  createIframeProvider('Vidsrc.net', 'vidsrc_net', id => `https://vidsrc.net/embed/movie?tmdb=${id}`, (id, s, e) => `https://vidsrc.net/embed/tv?tmdb=${id}&season=${s}&episode=${e}`),
  createIframeProvider('VixSrc Live', 'vixsrc', id => `https://vixsrc.net/embed/movie?tmdb=${id}`, (id, s, e) => `https://vixsrc.net/embed/tv?tmdb=${id}&season=${s}&episode=${e}`),
  createIframeProvider('Vidsrc.Ru', 'vidsrc_ru', id => `https://vidsrc.ru/embed/movie?tmdb=${id}`, (id, s, e) => `https://vidsrc.ru/embed/tv?tmdb=${id}&season=${s}&episode=${e}`),
  
  // Videasy network
  createIframeProvider('Neon (Videasy)', 'videasy_neon', id => `https://neon.videasy.net/movie/${id}`, (id, s, e) => `https://neon.videasy.net/tv/${id}/${s}/${e}`),
  createIframeProvider('Yoru (Videasy)', 'videasy_yoru', id => `https://yoru.videasy.net/movie/${id}`, (id, s, e) => `https://yoru.videasy.net/tv/${id}/${s}/${e}`),
  createIframeProvider('Cypher (Videasy)', 'videasy_cypher', id => `https://cypher.videasy.net/movie/${id}`, (id, s, e) => `https://cypher.videasy.net/tv/${id}/${s}/${e}`),
  createIframeProvider('Sage (Videasy)', 'videasy_sage', id => `https://sage.videasy.net/movie/${id}`, (id, s, e) => `https://sage.videasy.net/tv/${id}/${s}/${e}`),
  createIframeProvider('Breach (Videasy)', 'videasy_breach', id => `https://breach.videasy.net/movie/${id}`, (id, s, e) => `https://breach.videasy.net/tv/${id}/${s}/${e}`),
  createIframeProvider('Vyse (Videasy)', 'videasy_vyse', id => `https://vyse.videasy.net/movie/${id}`, (id, s, e) => `https://vyse.videasy.net/tv/${id}/${s}/${e}`),
  
  // Vidrock network
  createIframeProvider('Nova (Vidrock)', 'vidrock_nova', id => `https://nova.vidrock.net/movie/${id}`, (id, s, e) => `https://nova.vidrock.net/tv/${id}/${s}/${e}`),
  createIframeProvider('Atlas (Vidrock)', 'vidrock_atlas', id => `https://atlas.vidrock.net/movie/${id}`, (id, s, e) => `https://atlas.vidrock.net/tv/${id}/${s}/${e}`),

  // Vidzee network
  createIframeProvider('Nflix (Vidzee)', 'vidzee_nflix', id => `https://nflix.vidzee.net/movie/${id}`, (id, s, e) => `https://nflix.vidzee.net/tv/${id}/${s}/${e}`),
  createIframeProvider('Glory (Vidzee)', 'vidzee_glory', id => `https://glory.vidzee.net/movie/${id}`, (id, s, e) => `https://glory.vidzee.net/tv/${id}/${s}/${e}`),
  createIframeProvider('Nazy (Vidzee)', 'vidzee_nazy', id => `https://nazy.vidzee.net/movie/${id}`, (id, s, e) => `https://nazy.vidzee.net/tv/${id}/${s}/${e}`),
  createIframeProvider('Atlas (Vidzee)', 'vidzee_atlas', id => `https://atlas.vidzee.net/movie/${id}`, (id, s, e) => `https://atlas.vidzee.net/tv/${id}/${s}/${e}`),
  createIframeProvider('Drag (Vidzee)', 'vidzee_drag', id => `https://drag.vidzee.net/movie/${id}`, (id, s, e) => `https://drag.vidzee.net/tv/${id}/${s}/${e}`),
  createIframeProvider('Achilles (Vidzee)', 'vidzee_achilles', id => `https://achilles.vidzee.net/movie/${id}`, (id, s, e) => `https://achilles.vidzee.net/tv/${id}/${s}/${e}`),
  createIframeProvider('Viet (Vidzee)', 'vidzee_viet', id => `https://viet.vidzee.net/movie/${id}`, (id, s, e) => `https://viet.vidzee.net/tv/${id}/${s}/${e}`),

  // PrimeSrc network
  createIframeProvider('Streamtape (PrimeSrc)', 'primesrc_streamtape', id => `https://primesrc.net/streamtape/movie/${id}`, (id, s, e) => `https://primesrc.net/streamtape/tv/${id}/${s}/${e}`),
  createIframeProvider('Voe (PrimeSrc)', 'primesrc_voe', id => `https://primesrc.net/voe/movie/${id}`, (id, s, e) => `https://primesrc.net/voe/tv/${id}/${s}/${e}`),
  createIframeProvider('Voe 2 (PrimeSrc)', 'primesrc_voe2', id => `https://primesrc.net/voe2/movie/${id}`, (id, s, e) => `https://primesrc.net/voe2/tv/${id}/${s}/${e}`),
  createIframeProvider('Streamwish (PrimeSrc)', 'primesrc_streamwish', id => `https://primesrc.net/streamwish/movie/${id}`, (id, s, e) => `https://primesrc.net/streamwish/tv/${id}/${s}/${e}`),
  createIframeProvider('Filemoon (PrimeSrc)', 'primesrc_filemoon', id => `https://primesrc.net/filemoon/movie/${id}`, (id, s, e) => `https://primesrc.net/filemoon/tv/${id}/${s}/${e}`),
  createIframeProvider('Dood (PrimeSrc)', 'primesrc_dood', id => `https://primesrc.net/dood/movie/${id}`, (id, s, e) => `https://primesrc.net/dood/tv/${id}/${s}/${e}`),
  createIframeProvider('Filelions (PrimeSrc)', 'primesrc_filelions', id => `https://primesrc.net/filelions/movie/${id}`, (id, s, e) => `https://primesrc.net/filelions/tv/${id}/${s}/${e}`),
  createIframeProvider('Streamplay (PrimeSrc)', 'primesrc_streamplay', id => `https://primesrc.net/streamplay/movie/${id}`, (id, s, e) => `https://primesrc.net/streamplay/tv/${id}/${s}/${e}`),

  // Others
  createIframeProvider('2Embed', '2embed', id => `https://www.2embed.cc/embed/${id}`, (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`),
  createIframeProvider('Moviesapi', 'moviesapi', id => `https://moviesapi.club/movie/${id}`, (id, s, e) => `https://moviesapi.club/tv/${id}-${s}-${e}`),
  createIframeProvider('VidLink', 'vidlink', id => `https://vidlink.pro/movie/${id}`, (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}`),
  createIframeProvider('Vidflix', 'vidflix', id => `https://vidflix.net/embed/movie/${id}`, (id, s, e) => `https://vidflix.net/embed/tv/${id}/${s}/${e}`),
];

export class ProviderEngine {
  private providers: Map<string, ProviderPlugin> = new Map();

  constructor() {
    // Auto-register all 30 providers
    IFRAME_PROVIDERS.forEach(p => this.registerProvider(p));
  }

  registerProvider(provider: ProviderPlugin) {
    this.providers.set(provider.id, provider);
  }

  getProviders() {
    return Array.from(this.providers.values());
  }

  async resolveAll(request: MediaRequest): Promise<StreamResponse[]> {
    console.log(`[ProviderEngine] Resolving 30+ streams for TMDB: ${request.tmdbId}`);
    
    // Filter providers that support the requested media type
    const applicableProviders = Array.from(this.providers.values()).filter(
      p => p.type === 'all' || p.type === request.type
    );

    // We can resolve iframe templates instantly without waiting for network requests
    const promises = applicableProviders.map(p => 
      p.resolveStream(request).catch(err => {
        console.error(`[ProviderEngine] Provider ${p.name} failed:`, err);
        return [];
      })
    );

    const results = await Promise.all(promises);
    let allStreams = results.flat();

    console.log(`[ProviderEngine] Generated ${allStreams.length} stream links.`);
    return allStreams;
  }
}

export const providerEngine = new ProviderEngine();
