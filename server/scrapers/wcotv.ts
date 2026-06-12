import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';

puppeteer.use(StealthPlugin());

const WCO_URL = 'https://www.wcostream.tv';

export interface ScrapedMetadata {
  id: string;
  title: string;
  type: 'movie' | 'tv' | 'anime';
  poster: string;
  year?: string;
  provider: string;
}

export async function searchWCO(query: string): Promise<ScrapedMetadata[]> {
  console.log(`[WCO Scraper] Searching for: ${query} using Headless Browser`);
  
  let browser;
  try {
    // Launch stealth browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Cloudflare challenges take time, wait until network is mostly idle
    await page.goto(`${WCO_URL}/search`, { waitUntil: 'networkidle2', timeout: 30000 });

    // Submit the form
    await page.type('input[name="catara"]', query);
    
    // We must find the search form and submit it, or click the search button
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
      page.keyboard.press('Enter'),
    ]);

    // Get the HTML after navigation
    const html = await page.content();
    const $ = cheerio.load(html);
    const results: ScrapedMetadata[] = [];

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

    console.log(`[WCO Scraper] Successfully bypassed Cloudflare! Found ${results.length} real results.`);
    return results;
  } catch (error) {
    console.error('[WCO Scraper] Puppeteer execution error:', error);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

