/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LinkedinEnrichment {
  name?: string;
  headline?: string;
  about?: string;
  profileUrl: string;
}

/**
 * Attempts to parse public LinkedIn profile metadata.
 * Does not attempt to bypass CAPTCHA, authentication, or protected walls.
 */
export async function extractLinkedinData(profileUrl: string): Promise<LinkedinEnrichment | null> {
  try {
    const url = new URL(profileUrl);
    const pathParts = url.pathname.split('/').filter(p => p.length > 0);
    
    // Default fallback based on URL structure: /in/username
    let handle = 'LinkedIn User';
    if (pathParts.length > 0) {
      const lastPart = pathParts[pathParts.length - 1];
      handle = lastPart.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5'
    };

    const response = await fetch(profileUrl, { headers, signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      // 999 or 403 is common for LinkedIn scrapers. Return URL-derived name as fallback.
      return {
        name: handle,
        headline: 'Professional Profile on LinkedIn',
        profileUrl
      };
    }

    const html = await response.text();

    // Basic regex metadata parsing
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i) || 
                      html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);

    let name = handle;
    let headline = 'Professional Profile on LinkedIn';
    let about = '';

    if (titleMatch && titleMatch[1]) {
      const titleText = titleMatch[1].replace('| LinkedIn', '').trim();
      // Titles are often "First Last - Current Headline - Company | LinkedIn"
      const titleParts = titleText.split(' - ');
      if (titleParts.length > 0) {
        name = titleParts[0].trim();
      }
      if (titleParts.length > 1) {
        headline = titleParts[1].trim();
      }
    }

    if (descMatch && descMatch[1]) {
      about = descMatch[1].trim();
    }

    return {
      name,
      headline,
      about,
      profileUrl
    };

  } catch (error: any) {
    console.warn(`[LinkedIn Extractor] Redirected or blocked for ${profileUrl}:`, error.message || error);
    // Graceful fallback derived from the username path
    const url = new URL(profileUrl);
    const pathParts = url.pathname.split('/').filter(p => p.length > 0);
    const name = pathParts.length > 0 
      ? pathParts[pathParts.length - 1].split(/[_-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      : 'LinkedIn User';

    return {
      name,
      headline: 'Professional Profile on LinkedIn',
      profileUrl
    };
  }
}
