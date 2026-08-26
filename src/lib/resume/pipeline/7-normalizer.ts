import { ResumeData } from './types';

export function normalizeData(data: Partial<ResumeData>): ResumeData {
  const cleanString = (str: string) => {
    return str.replace(/\s+/g, ' ').trim();
  };

  const normalizeUrl = (url: string | undefined) => {
    if (!url) return undefined;
    let clean = cleanString(url);
    if (clean.endsWith('/')) clean = clean.slice(0, -1);
    return clean;
  };

  const normalizeEmail = (email: string | undefined) => {
    if (!email) return '';
    return cleanString(email).toLowerCase();
  };

  const normalizeDate = (date: string | undefined) => {
    if (!date) return '';
    const clean = cleanString(date);
    // Simple normalization: capitalize first letter of month if it exists
    return clean.replace(/^[a-z]/i, (c) => c.toUpperCase());
  };

  const dedupeCaseInsensitive = (items: string[]) => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const item of items) {
      const clean = cleanString(item);
      const lower = clean.toLowerCase();
      if (!seen.has(lower) && clean.length > 0) {
        seen.add(lower);
        result.push(clean);
      }
    }
    return result;
  };

  const normalized: ResumeData = {
    personal: {
      name: cleanString(data.personal?.name || 'Unknown Name'),
      email: normalizeEmail(data.personal?.email),
      phone: cleanString(data.personal?.phone || ''),
      location: cleanString(data.personal?.location || '')
    },
    experience: (data.experience || []).map(exp => ({
      company: cleanString(exp.company),
      jobTitle: cleanString(exp.jobTitle),
      employmentType: cleanString(exp.employmentType),
      location: cleanString(exp.location),
      startDate: normalizeDate(exp.startDate),
      endDate: normalizeDate(exp.endDate),
      duration: cleanString(exp.duration),
      currentJob: exp.currentJob,
      description: cleanString(exp.description),
      bullets: exp.bullets.map(cleanString).filter(d => d.length > 0),
      technologies: dedupeCaseInsensitive(exp.technologies)
    })).filter(exp => exp.company !== 'Unknown Company'),
    education: (data.education || []).map(edu => ({
      institute: cleanString(edu.institute),
      degree: cleanString(edu.degree),
      branch: cleanString(edu.branch),
      major: cleanString(edu.major),
      minor: cleanString(edu.minor),
      cgpa: cleanString(edu.cgpa),
      percentage: cleanString(edu.percentage),
      location: cleanString(edu.location),
      startDate: normalizeDate(edu.startDate),
      endDate: normalizeDate(edu.endDate),
      currentStatus: cleanString(edu.currentStatus),
      coursework: dedupeCaseInsensitive(edu.coursework)
    })).filter(edu => edu.institute !== 'Unknown University'),
    projects: (data.projects || []).map(proj => ({
      projectName: cleanString(proj.projectName),
      subtitle: cleanString(proj.subtitle),
      techStack: dedupeCaseInsensitive(proj.techStack),
      description: cleanString(proj.description),
      bullets: proj.bullets.map(cleanString).filter(d => d.length > 0),
      githubRepository: normalizeUrl(proj.githubRepository),
      liveUrl: normalizeUrl(proj.liveUrl),
      deploymentUrl: normalizeUrl(proj.deploymentUrl),
      appStoreLink: normalizeUrl(proj.appStoreLink),
      playStoreLink: normalizeUrl(proj.playStoreLink),
      duration: cleanString(proj.duration),
      role: cleanString(proj.role),
      features: proj.features.map(cleanString).filter(d => d.length > 0),
      aiFeatures: proj.aiFeatures.map(cleanString).filter(d => d.length > 0),
      performanceImprovements: proj.performanceImprovements.map(cleanString).filter(d => d.length > 0),
      metrics: proj.metrics.map(cleanString).filter(d => d.length > 0),
      userNumbers: cleanString(proj.userNumbers),
      downloads: cleanString(proj.downloads),
      awards: proj.awards.map(cleanString).filter(d => d.length > 0),
      technologies: dedupeCaseInsensitive(proj.technologies)
    })).filter(proj => proj.projectName !== 'Unknown Project'),
    skills: {
      languages: dedupeCaseInsensitive(data.skills?.languages || []),
      frontend: dedupeCaseInsensitive(data.skills?.frontend || []),
      backend: dedupeCaseInsensitive(data.skills?.backend || []),
      frameworks: dedupeCaseInsensitive(data.skills?.frameworks || []),
      databases: dedupeCaseInsensitive(data.skills?.databases || []),
      cloud: dedupeCaseInsensitive(data.skills?.cloud || []),
      devops: dedupeCaseInsensitive(data.skills?.devops || []),
      tools: dedupeCaseInsensitive(data.skills?.tools || []),
      others: dedupeCaseInsensitive(data.skills?.others || [])
    },
    achievements: (data.achievements || []).map(cleanString).filter(s => s.length > 0),
    certifications: (data.certifications || []).map(cleanString).filter(s => s.length > 0),
    publications: (data.publications || []).map(cleanString).filter(s => s.length > 0),
    volunteer: (data.volunteer || []).map(vol => ({
      organization: cleanString(vol.organization),
      role: cleanString(vol.role),
      description: vol.description.map(cleanString).filter(d => d.length > 0)
    })).filter(vol => vol.organization !== 'Unknown Organization'),
    leadership: (data.leadership || []).map(lead => ({
      organization: cleanString(lead.organization),
      role: cleanString(lead.role),
      description: lead.description.map(cleanString).filter(d => d.length > 0)
    })).filter(lead => lead.organization !== 'Unknown Organization'),
    links: {
      linkedin: normalizeUrl(data.links?.linkedin),
      github: normalizeUrl(data.links?.github),
      portfolio: normalizeUrl(data.links?.portfolio),
      website: normalizeUrl(data.links?.website),
      leetcode: normalizeUrl(data.links?.leetcode),
      codeforces: normalizeUrl(data.links?.codeforces),
      codechef: normalizeUrl(data.links?.codechef),
      hackerrank: normalizeUrl(data.links?.hackerrank),
      geeksforgeeks: normalizeUrl(data.links?.geeksforgeeks),
      medium: normalizeUrl(data.links?.medium),
      email: normalizeEmail(data.links?.email),
      other: Array.from(new Set((data.links?.other || []).map(normalizeUrl).filter(Boolean) as string[]))
    },
    rawText: data.rawText || '',
    metadata: data.metadata || {}
  };

  return normalized;
}
