export interface GithubEnrichment {
  username: string;
  name?: string;
  bio?: string;
  avatarUrl?: string;
  followers?: number;
  following?: number;
  publicReposCount?: number;
  repositories?: Array<{
    name: string;
    description: string;
    stars: number;
    url: string;
    language: string;
  }>;
}

/**
 * Fetches profile and repository stats for a given GitHub profile URL.
 * Gracefully handles errors and rate limits.
 */
export async function extractGithubData(profileUrl: string): Promise<GithubEnrichment | null> {
  try {
    const url = new URL(profileUrl);
    const pathParts = url.pathname.split('/').filter(p => p.length > 0);
    if (pathParts.length === 0) return null;

    const username = pathParts[0];
    const headers = {
      'User-Agent': 'PaaS-Portfolio-Enrichment-Agent/1.0',
      'Accept': 'application/vnd.github.v3+json',
      // Include GitHub token if available in env to extend rate limits
      ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
    };

    // Use a short 4s timeout to avoid blocking
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const userPromise = fetch(`https://api.github.com/users/${username}`, { headers, signal: controller.signal })
      .then(res => {
        if (!res.ok) {
          if (res.status === 403) throw new Error('GitHub API rate limited.');
          throw new Error(`Profile fetch failed: ${res.statusText}`);
        }
        return res.json();
      });

    const reposPromise = fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=8`, { headers, signal: controller.signal })
      .then(res => {
        if (!res.ok) {
          if (res.status === 403) throw new Error('GitHub API rate limited.');
          throw new Error(`Repos fetch failed: ${res.statusText}`);
        }
        return res.json();
      });

    const [userData, reposData] = await Promise.all([userPromise, reposPromise]);
    clearTimeout(timeoutId);

    const repositories = Array.isArray(reposData) 
      ? reposData.map((repo: any) => ({
          name: repo.name || '',
          description: repo.description || '',
          stars: repo.stargazers_count || 0,
          url: repo.html_url || '',
          language: repo.language || 'Unknown'
        }))
      : [];

    return {
      username,
      name: userData.name || userData.login,
      bio: userData.bio || '',
      avatarUrl: userData.avatar_url || '',
      followers: userData.followers || 0,
      following: userData.following || 0,
      publicReposCount: userData.public_repos || 0,
      repositories
    };

  } catch (error: any) {
    console.error(`[GitHub Extractor] Error fetching for ${profileUrl}:`, error.message || error);
    return null;
  }
}
