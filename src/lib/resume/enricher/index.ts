import { extractGithubData, GithubEnrichment } from './github';
import { extractLinkedinData, LinkedinEnrichment } from './linkedin';
import { extractCodingProfileData, CodingProfileEnrichment } from './coding';
import { extractPortfolioData, PortfolioEnrichment } from './portfolio';
import { withTimeout } from '../../utils/timeout';

export interface EnrichedData {
  github: GithubEnrichment[];
  linkedin: LinkedinEnrichment[];
  coding: CodingProfileEnrichment[];
  portfolio: PortfolioEnrichment[];
  otherLinks: string[];
}

/**
 * Detects all URLs present in a raw text block, matching standard URLs as well as domains without protocol.
 */
export function detectUrls(text: string): string[] {
  const urls: string[] = [];
  let match;
  
  // 1. Match standard HTTP/HTTPS URLs
  const standardRegex = /https?:\/\/[a-zA-Z0-9-._~:/?#\[\]@!$&'()*+,;=%]+/gi;
  while ((match = standardRegex.exec(text)) !== null) {
    urls.push(match[0]);
  }

  // 2. Match common platform domains without protocol
  const platformRegex = /(?<![a-zA-Z0-9-._~:@])(=?www\.)?(github\.com|linkedin\.com|leetcode\.com|codeforces\.com|codechef\.com|hackerrank\.com|behance\.net|dribbble\.com)\/[a-zA-Z0-9-._~:/?#\[\]@!$&'()*+,;=%]+/gi;
  while ((match = platformRegex.exec(text)) !== null) {
    urls.push(`https://${match[0]}`);
  }

  // 3. Match generic domains (com, org, net, dev, io, me, co, app) without protocol (avoid matching email addresses)
  const genericRegex = /(?<![a-zA-Z0-9-._~:@])(?:www\.)?[a-zA-Z0-9-]+\.(?:com|org|net|dev|io|me|co|app)(?:\/[a-zA-Z0-9-._~:/?#\[\]@!$&'()*+,;=%]*)?/gi;
  while ((match = genericRegex.exec(text)) !== null) {
    const urlStr = match[0];
    if (!urls.some(existing => existing.includes(urlStr))) {
      urls.push(`https://${urlStr}`);
    }
  }

  // Deduplicate and filter out trailing punctuations common in parsed PDFs
  return Array.from(new Set(urls.map(url => {
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

  const companyDomains = new Set([
    'amazon.com', 'microsoft.com', 'google.com', 'apple.com', 'netflix.com',
    'meta.com', 'crunchyroll.com', 'facebook.com', 'twitter.com', 'x.com',
    'adobe.com', 'oracle.com', 'ibm.com', 'intel.com', 'salesforce.com'
  ]);

  urls.forEach(urlStr => {
    try {
      let formattedUrl = urlStr.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }
      const url = new URL(formattedUrl);
      const host = url.hostname.toLowerCase().replace(/^www\./, '');

      if (host === 'github.com' || host.endsWith('.github.com')) {
        github.push(formattedUrl);
      } else if (host === 'linkedin.com' || host.endsWith('.linkedin.com')) {
        linkedin.push(formattedUrl);
      } else if (
        host === 'leetcode.com' || 
        host === 'codeforces.com' || 
        host === 'codechef.com' || 
        host === 'hackerrank.com'
      ) {
        coding.push(formattedUrl);
      } else if (
        host === 'google.com' || 
        host === 'coursera.org' || 
        host === 'udemy.com' || 
        host === 'medium.com' || 
        host === 'dev.to' || 
        host === 'youtube.com' || 
        host === 'figma.com' || 
        host === 'behance.net' || 
        host === 'dribbble.com' ||
        companyDomains.has(host)
      ) {
        otherLinks.push(formattedUrl);
      } else {
        // If it's a general website, treat it as a personal portfolio site
        portfolio.push(formattedUrl);
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

  const githubPromises = categorized.github.map(url => 
    withTimeout(extractGithubData(url), 10000, `GitHub Enrichment for ${url}`, null)
  );
  const linkedinPromises = categorized.linkedin.map(url => 
    withTimeout(extractLinkedinData(url), 10000, `LinkedIn Enrichment for ${url}`, null)
  );
  const codingPromises = categorized.coding.map(url => 
    withTimeout(extractCodingProfileData(url), 10000, `Coding Profile Enrichment for ${url}`, null)
  );
  const portfolioPromises = categorized.portfolio.map(url => 
    withTimeout(extractPortfolioData(url), 10000, `Portfolio Crawling for ${url}`, null)
  );

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
