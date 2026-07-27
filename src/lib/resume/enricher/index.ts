import { extractGithubData, GithubEnrichment } from './github';
import { extractLinkedinData, LinkedinEnrichment } from './linkedin';
import { extractCodingProfileData, CodingProfileEnrichment } from './coding';
import { extractPortfolioData, PortfolioEnrichment } from './portfolio';

export interface EnrichedData {
  github: GithubEnrichment[];
  linkedin: LinkedinEnrichment[];
  coding: CodingProfileEnrichment[];
  portfolio: PortfolioEnrichment[];
  otherLinks: string[];
}

/**
 * Detects all URLs present in a raw text block.
 */
export function detectUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[a-zA-Z0-9-._~:/?#\[\]@!$&'()*+,;=%]+/gi;
  const matches = text.match(urlRegex) || [];
  // Deduplicate and filter out trailing punctuations common in parsed PDFs
  return Array.from(new Set(matches.map(url => {
    let cleanUrl = url.trim();
    if (cleanUrl.endsWith('.') || cleanUrl.endsWith(',') || cleanUrl.endsWith(')')) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    return cleanUrl;
  })));
}

/**
 * Classifies a list of URLs into respective platform categories.
 */
export function categorizeUrls(urls: string[]) {
  const github: string[] = [];
  const linkedin: string[] = [];
  const coding: string[] = [];
  const portfolio: string[] = [];
  const otherLinks: string[] = [];

  urls.forEach(urlStr => {
    try {
      const url = new URL(urlStr);
      const host = url.hostname.toLowerCase();

      if (host.includes('github.com')) {
        github.push(urlStr);
      } else if (host.includes('linkedin.com')) {
        linkedin.push(urlStr);
      } else if (
        host.includes('leetcode.com') || 
        host.includes('codeforces.com') || 
        host.includes('codechef.com') || 
        host.includes('hackerrank.com')
      ) {
        coding.push(urlStr);
      } else if (
        host.includes('google.com') || 
        host.includes('coursera.org') || 
        host.includes('udemy.com') || 
        host.includes('medium.com') || 
        host.includes('dev.to') || 
        host.includes('youtube.com') || 
        host.includes('figma.com') || 
        host.includes('behance.net') || 
        host.includes('dribbble.com')
      ) {
        otherLinks.push(urlStr);
      } else {
        // If it's a general website, treat it as a personal portfolio site
        portfolio.push(urlStr);
      }
    } catch {
      // Ignore invalid URLs
    }
  });

  return { github, linkedin, coding, portfolio, otherLinks };
}

/**
 * Main enrichment pipeline coordinator. Runs all scrapes concurrently.
 */
export async function enrichPortfolioData(rawResumeText: string): Promise<EnrichedData> {
  const allUrls = detectUrls(rawResumeText);
  const categorized = categorizeUrls(allUrls);

  const githubPromises = categorized.github.map(url => extractGithubData(url));
  const linkedinPromises = categorized.linkedin.map(url => extractLinkedinData(url));
  const codingPromises = categorized.coding.map(url => extractCodingProfileData(url));
  const portfolioPromises = categorized.portfolio.map(url => extractPortfolioData(url));

  // Run all fetches concurrently with Promise.allSettled
  const [
    githubResults,
    linkedinResults,
    codingResults,
    portfolioResults
  ] = await Promise.all([
    Promise.allSettled(githubPromises),
    Promise.allSettled(linkedinPromises),
    Promise.allSettled(codingPromises),
    Promise.allSettled(portfolioPromises)
  ]);

  const github: GithubEnrichment[] = githubResults
    .filter((r): r is PromiseFulfilledResult<GithubEnrichment | null> => r.status === 'fulfilled' && r.value !== null)
    .map(r => r.value as GithubEnrichment);

  const linkedin: LinkedinEnrichment[] = linkedinResults
    .filter((r): r is PromiseFulfilledResult<LinkedinEnrichment | null> => r.status === 'fulfilled' && r.value !== null)
    .map(r => r.value as LinkedinEnrichment);

  const coding: CodingProfileEnrichment[] = codingResults
    .filter((r): r is PromiseFulfilledResult<CodingProfileEnrichment | null> => r.status === 'fulfilled' && r.value !== null)
    .map(r => r.value as CodingProfileEnrichment);

  const portfolio: PortfolioEnrichment[] = portfolioResults
    .filter((r): r is PromiseFulfilledResult<PortfolioEnrichment | null> => r.status === 'fulfilled' && r.value !== null)
    .map(r => r.value as PortfolioEnrichment);

  return {
    github,
    linkedin,
    coding,
    portfolio,
    otherLinks: categorized.otherLinks
  };
}
