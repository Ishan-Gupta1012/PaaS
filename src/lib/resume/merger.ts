import { StructuredResume } from './extractor';
import { EnrichedData } from './enricher';

/**
 * Merges structured resume data with enriched external profiles.
 * The resume remains the source of truth, and external data is used to enrich.
 */
export function mergeResumeAndExternalData(resume: StructuredResume, external: EnrichedData): StructuredResume {
  // Deep clone resume to avoid side effects
  const merged: StructuredResume = JSON.parse(JSON.stringify(resume));

  // 1. Personal Links & Socials Enrichment
  if (external.github.length > 0 && !merged.github) {
    merged.github = `https://github.com/${external.github[0].username}`;
  }
  if (external.linkedin.length > 0 && !merged.linkedin) {
    merged.linkedin = external.linkedin[0].profileUrl;
  }
  if (external.portfolio.length > 0 && !merged.portfolio) {
    merged.portfolio = external.portfolio[0].url;
  }

  // Coding profile links
  external.coding.forEach(profile => {
    if (profile.platform === 'leetcode' && !merged.leetcode) {
      merged.leetcode = `https://leetcode.com/${profile.username}`;
    } else if (profile.platform === 'codeforces' && !merged.codeforces) {
      merged.codeforces = `https://codeforces.com/profile/${profile.username}`;
    } else if (profile.platform === 'codechef' && !merged.codechef) {
      merged.codechef = `https://www.codechef.com/users/${profile.username}`;
    } else if (profile.platform === 'hackerrank' && !merged.hackerrank) {
      merged.hackerrank = `https://www.hackerrank.com/${profile.username}`;
    }
  });

  // 2. Personal Bio / Summary Enrichment
  if (!merged.personal.summary && external.github.length > 0 && external.github[0].bio) {
    merged.personal.summary = external.github[0].bio;
  } else if (!merged.personal.summary && external.linkedin.length > 0 && external.linkedin[0].about) {
    merged.personal.summary = external.linkedin[0].about;
  }

  if (!merged.personal.headline && external.linkedin.length > 0 && external.linkedin[0].headline) {
    merged.personal.headline = external.linkedin[0].headline;
  }

  // 3. Skills Merging
  const skillSet = new Set<string>(merged.skills.map(s => s.toLowerCase()));
  
  // Add Github languages and topics
  external.github.forEach(profile => {
    profile.repositories?.forEach(repo => {
      if (repo.language && repo.language !== 'Unknown') {
        const lang = repo.language;
        if (!skillSet.has(lang.toLowerCase())) {
          merged.skills.push(lang);
          skillSet.add(lang.toLowerCase());
        }
      }
    });
  });

  // Add Portfolio techStack
  external.portfolio.forEach(site => {
    site.techStack?.forEach(tech => {
      if (!skillSet.has(tech.toLowerCase())) {
        merged.skills.push(tech);
        skillSet.add(tech.toLowerCase());
      }
    });
  });

  // 4. Projects Enrichment (Import GitHub repositories as projects)
  const existingProjectNames = new Set<string>(
    merged.projects.map(p => p.name.toLowerCase().trim())
  );

  external.github.forEach(profile => {
    profile.repositories?.forEach(repo => {
      const repoNameLower = repo.name.toLowerCase().trim();
      
      // If repository is not represented in the resume's projects, append it
      if (!existingProjectNames.has(repoNameLower) && repo.stars >= 0) {
        merged.projects.push({
          name: repo.name.replace(/[-_]/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          description: repo.description || 'Public GitHub open-source repository.',
          tags: repo.language && repo.language !== 'Unknown' ? [repo.language] : [],
          githubUrl: repo.url,
          liveUrl: '',
          category: 'Open Source',
          outcome: repo.stars > 0 ? `Accumulated ${repo.stars} stars on GitHub.` : 'Successfully published and maintained on GitHub.'
        });
        existingProjectNames.add(repoNameLower);
      }
    });
  });

  // 5. Achievements Enrichment (Import coding profile stats)
  const existingAchievements = new Set<string>(
    merged.achievements.map(a => a.toLowerCase())
  );

  external.coding.forEach(profile => {
    let achievementText = '';
    if (profile.platform === 'codeforces' && profile.rating) {
      achievementText = `Codeforces Rating: ${profile.rating} (${profile.rank || 'Specialist'})`;
    } else if (profile.platform === 'leetcode' && profile.solvedCount) {
      achievementText = `LeetCode Profile: Solved over ${profile.solvedCount} problems (Rank: ${profile.rank || 'Member'})`;
    } else if (profile.platform === 'codechef' && profile.rank) {
      achievementText = `CodeChef Profile: Ranked as ${profile.rank}`;
    } else if (profile.platform === 'hackerrank' && profile.solvedCount) {
      achievementText = `HackerRank Profile: Earned ${profile.rank || 'Gold Badge'}`;
    }

    if (achievementText && !existingAchievements.has(achievementText.toLowerCase())) {
      merged.achievements.push(achievementText);
      existingAchievements.add(achievementText.toLowerCase());
    }
  });

  return merged;
}
