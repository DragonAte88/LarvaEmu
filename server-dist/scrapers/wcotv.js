import axios from 'axios';
import * as cheerio from 'cheerio';
const WCO_URL = 'https://www.wcostream.tv';
export async function searchWCO(query) {
    try {
        console.log(`[WCO Scraper] Searching for: ${query}`);
        const formData = new URLSearchParams();
        formData.append('catara', query);
        formData.append('konuara', 'series');
        const res = await axios.post(`${WCO_URL}/search`, formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 10000
        });
        const $ = cheerio.load(res.data);
        const results = [];
        $('.cerceve').each((i, el) => {
            const aTag = $(el).find('a').first();
            const title = aTag.attr('title') || 'Unknown Title';
            const url = aTag.attr('href') || '';
            const imgTag = $(el).find('img').first();
            const poster = imgTag.attr('src') ? `https:${imgTag.attr('src')}` : '';
            if (url) {
                results.push({
                    id: url,
                    title: title.trim(),
                    type: 'anime',
                    poster: poster,
                    provider: 'WCO'
                });
            }
        });
        console.log(`[WCO Scraper] Found ${results.length} results.`);
        return results;
    }
    catch (error) {
        console.error('[WCO Scraper] Error during search:', error);
        // Fallback Mock Results if blocked by Cloudflare locally
        return [
            {
                id: 'wco-mock-1',
                title: `${query} (Subbed) - Mock Fallback`,
                type: 'anime',
                poster: 'https://via.placeholder.com/300x450/0a0a0f/00ffcc?text=Anime+Poster',
                provider: 'WCO Mock'
            },
            {
                id: 'wco-mock-2',
                title: `${query} The Movie (Dubbed) - Mock Fallback`,
                type: 'anime',
                poster: 'https://via.placeholder.com/300x450/0a0a0f/a855f7?text=Movie+Poster',
                provider: 'WCO Mock'
            }
        ];
    }
}
