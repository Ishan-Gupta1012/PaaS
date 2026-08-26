/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PortfolioEnrichment {
  title?: string;
  description?: string;
  socials?: string[];
  techStack?: string[];
  url: string;
}

/**
 * Attempts to parse public metadata and tech stack hints from a portfolio website.
 */
export async function extractPortfolioData(siteUrl: string): Promise<PortfolioEnrichment | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };

    const response = await fetch(siteUrl, { headers, signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        title: 'Personal Website',
        description: 'Portfolio site linked in resume.',
        url: siteUrl
      };
    }

    const html = await response.text();

    // Basic metadata parsing
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i) ||
                      html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);

    const title = titleMatch && titleMatch[1] ? titleMatch[1].trim() : 'Personal Website';
    const description = descMatch && descMatch[1] ? descMatch[1].trim() : 'Developer Portfolio Website';

    // Search for tech stack hints inside text
    const commonTech = [
      'React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'TypeScript', 'Tailwind',
      'Python', 'AWS', 'Docker', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Vercel'
    ];
    const techStack: string[] = [];
    commonTech.forEach(tech => {
      const regex = new RegExp(`\\b${tech}\\b`, 'i');
      if (regex.test(html)) {
        techStack.push(tech);
      }
    });

    // Look for social profile links
    const socials: string[] = [];
    const socialRegex = /href="([^"]*?(?:github\.com|linkedin\.com|twitter\.com|x\.com)\/[a-zA-Z0-9_-]+?)"/gi;
    let match;
    while ((match = socialRegex.exec(html)) !== null) {
      if (match[1] && !socials.includes(match[1])) {
        socials.push(match[1]);
      }
    }

    return {
      title,
      description,
      techStack: techStack.length > 0 ? techStack : undefined,
      socials: socials.length > 0 ? socials : undefined,
      url: siteUrl
    };

  } catch (error: any) {
    console.warn(`[Portfolio Extractor] Failed to read ${siteUrl}:`, error.message || error);
    return {
      title: 'Personal Website',
      description: 'Personal profile linked in resume.',
      url: siteUrl
    };
  }
}
