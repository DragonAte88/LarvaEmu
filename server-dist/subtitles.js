import axios from 'axios';
// Public generic OpenSubtitles API key for demo purposes or standard usage
// Users can provide their own in a real scenario
const OS_API_KEY = '5a4vM1U3O9F2B8gX6q0YlJkH4wR7tE5c'; // A generic key structure, in production should use env
export const fetchSubtitles = async (tmdbId, type, season, episode) => {
    try {
        console.log(`[Subtitles] Fetching for TMDB: ${tmdbId}`);
        // 1. Search OpenSubtitles using TMDB ID
        // The v1 OpenSubtitles API supports searching by TMDB ID
        let url = `https://api.opensubtitles.com/api/v1/subtitles?tmdb_id=${tmdbId}&languages=en`;
        if (type === 'tv' && season && episode) {
            url += `&season_number=${season}&episode_number=${episode}`;
        }
        const searchRes = await axios.get(url, {
            headers: {
                'Api-Key': process.env.OPENSUBTITLES_API_KEY || 'demo_key',
                'User-Agent': 'MediaUniverse v1.0'
            }
        });
        if (!searchRes.data.data || searchRes.data.data.length === 0) {
            console.log('[Subtitles] No subtitles found.');
            return [];
        }
        // Sort by downloads or just take top 3
        const topSubs = searchRes.data.data.slice(0, 3);
        const results = [];
        for (const sub of topSubs) {
            const fileId = sub.attributes.files[0].file_id;
            // 2. Request download link
            try {
                const downloadRes = await axios.post('https://api.opensubtitles.com/api/v1/download', {
                    file_id: fileId
                }, {
                    headers: {
                        'Api-Key': process.env.OPENSUBTITLES_API_KEY || 'demo_key',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                if (downloadRes.data.link) {
                    results.push({
                        language: sub.attributes.language,
                        url: downloadRes.data.link, // This is a temporary S3 link to the .vtt/.srt
                        label: `English (${sub.attributes.release})`
                    });
                }
            }
            catch (err) {
                console.error('[Subtitles] Failed to get download link', err);
            }
        }
        return results;
    }
    catch (error) {
        console.error('[Subtitles] Error fetching from OpenSubtitles:', error);
        // Return empty array instead of failing, as this is non-critical
        return [];
    }
};
