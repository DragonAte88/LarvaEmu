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
  
  /**
   * Scrapes the provider to find stream links based on the media request
   */
  resolveStream(request: MediaRequest): Promise<StreamResponse[]>;
}

export class ProviderEngine {
  private providers: Map<string, ProviderPlugin> = new Map();

  registerProvider(provider: ProviderPlugin) {
    this.providers.set(provider.id, provider);
    console.log(`[ProviderEngine] Registered: ${provider.name}`);
  }

  getProviders() {
    return Array.from(this.providers.values());
  }

  async resolveAll(request: MediaRequest): Promise<StreamResponse[]> {
    console.log(`[ProviderEngine] Resolving streams for: ${request.title}`);
    
    // Filter providers that support the requested media type
    const applicableProviders = Array.from(this.providers.values()).filter(
      p => p.type === 'all' || p.type === request.type
    );

    const promises = applicableProviders.map(p => 
      p.resolveStream(request).catch(err => {
        console.error(`[ProviderEngine] Provider ${p.name} failed:`, err);
        return [];
      })
    );

    const results = await Promise.all(promises);
    let allStreams = results.flat();

    // The Ranking Algorithm (Resolution > Reliability)
    const qualityRank: Record<StreamQuality, number> = {
      '4K': 5,
      '1080p': 4,
      '720p': 3,
      '480p': 2,
      '360p': 1,
      'Auto': 0
    };

    allStreams = allStreams.sort((a, b) => {
      // 1. Sort by Quality
      const rankA = qualityRank[a.quality] || 0;
      const rankB = qualityRank[b.quality] || 0;
      if (rankA !== rankB) {
        return rankB - rankA; // Highest quality first
      }

      // 2. Tie-breaker: Subtitles Availability
      const subsA = a.subtitles.length > 0 ? 1 : 0;
      const subsB = b.subtitles.length > 0 ? 1 : 0;
      
      return subsB - subsA;
    });

    console.log(`[ProviderEngine] Ranked ${allStreams.length} streams.`);
    return allStreams;
  }
}
