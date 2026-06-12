import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());
/**
 * Universal Iframe Sniffer
 * Navigates to a provider's embed URL and intercepts network requests
 * looking for .m3u8 playlists or .mp4 files.
 */
export const extractStream = async (url, providerId) => {
    console.log(`[Extractor] Attempting to extract stream from: ${url}`);
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        // Set a realistic user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        let streamUrl = '';
        // Listen for all network requests to sniff the m3u8
        page.on('request', request => {
            const reqUrl = request.url();
            if (reqUrl.includes('.m3u8') && !reqUrl.includes('ad') && !streamUrl) {
                streamUrl = reqUrl;
                console.log(`[Extractor] 🎯 Snagged M3U8: ${streamUrl}`);
            }
            else if (reqUrl.includes('.mp4') && !reqUrl.includes('ad') && !streamUrl) {
                streamUrl = reqUrl;
                console.log(`[Extractor] 🎯 Snagged MP4: ${streamUrl}`);
            }
        });
        // Go to the embed URL and wait a max of 8 seconds
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 8000 }).catch(() => { });
        // Some players require a click to load the video source
        try {
            // Try to click play buttons if they exist
            const playButtons = await page.$$('.play-button, .vjs-big-play-button, button[title="Play"], .jw-icon-display');
            if (playButtons.length > 0) {
                await playButtons[0].click();
                await new Promise(r => setTimeout(r, 2000)); // Wait 2s for m3u8 request after click
            }
        }
        catch (e) {
            // Ignore click errors
        }
        if (streamUrl) {
            return {
                streamUrl,
                quality: 'Auto', // In a real scenario, we'd parse the master.m3u8 to find qualities
                subtitles: []
            };
        }
        return null;
    }
    catch (error) {
        console.error(`[Extractor] Failed for ${url}:`, error);
        return null;
    }
    finally {
        if (browser)
            await browser.close();
    }
};
