import fs from 'fs';
import path from 'path';
import { generateJSON } from '../llm';
import { detectUrls, categorizeUrls } from './enricher';

// Load .env.local manually for standalone scripts compatibility
function loadEnvLocal() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
        if (match) {
          const key = match[1].trim();
          let val = match[2].trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      });
    }
  } catch (err) {
    // Ignore error
  }
}
loadEnvLocal();

let wasKeyStatusLogged = false;
function logKeyStatusOnce() {
  if (wasKeyStatusLogged) return;
  wasKeyStatusLogged = true;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    console.log('✓ Gemini API Key Loaded');
    console.log('✓ Gemini Client Initialized');
    console.log('✓ Live AI Resume Extraction Enabled');
  } else {
    console.warn('⚠ GEMINI_API_KEY not found');
    console.warn('Using fallback extraction.');
  }
}

export interface StructuredResume {
  personal: {
    name: string | null;
    headline: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
    summary: string | null;
  };
  education: Array<{
    institution: string | null;
    degree: string | null;
    field: string | null;
    gradYear: string | null;
    gpa: string | null;
  }>;
  experience: Array<{
    company: string | null;
    role: string | null;
    startDate: string | null;
    endDate: string | null;
    achievements: string[];
    location?: string | null;
  }>;
  projects: Array<{
    name: string | null;
    description: string | null;
    tags: string[];
    githubUrl: string | null;
    liveUrl: string | null;
    category: string | null;
    outcome: string | null;
    bullets?: string[];
    title?: string | null;
    tech_stack?: string[];
    date?: string | null;
  }>;
  skills: string[];
  achievements: string[];
  certifications: string[];
  languages: string[];
  github: string | null;
  linkedin: string | null;
  portfolio: string | null;
  leetcode: string | null;
  codeforces: string | null;
  codechef: string | null;
  hackerrank: string | null;
  otherLinks: string[];

  // Expected JSON output fields
  personal_information?: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
  };
  social_links?: {
    linkedin: string | null;
    github: string | null;
    leetcode: string | null;
    codeforces: string | null;
  };
  work_experience?: Array<{
    role: string | null;
    company: string | null;
    location: string | null;
    date_range: string | null;
    bullets: string[];
  }>;
}

export interface DebugInfo {
  rawPdfText: string;
  cleanedText: string;
  detectedSections: string[];
  sections: Record<string, string>;
  llmInputs: Record<string, string>;
  extractedJson: any;
}

/**
 * Parses bracketed [...] or parenthetical (...) technology lists within titles.
 * Returns the cleaned title and the extracted technologies list.
 */
export function parseInlineTechTags(title: string): { cleanedTitle: string; extractedTech: string[] } {
  let cleanedTitle = title;
  const extractedTech: string[] = [];

  // Match bracketed tags: [Python, React]
  const bracketMatch = cleanedTitle.match(/\[([^\]]+)\]/);
  if (bracketMatch) {
    const techs = bracketMatch[1].split(',').map(t => t.trim()).filter(Boolean);
    extractedTech.push(...techs);
    cleanedTitle = cleanedTitle.replace(bracketMatch[0], '');
  }

  // Match parenthetical tags: (Python, React)
  const parenMatch = cleanedTitle.match(/\(([^)]+)\)/);
  if (parenMatch) {
    const inner = parenMatch[1];
    // Check if it's likely a tech stack list: e.g. contains commas, or matches common keywords
    const commonTechs = /python|react|javascript|typescript|html|css|c\+\+|java|rust|go|aws|docker|kubernetes|node|express|mongodb|sql|postgres/i;
    if (inner.includes(',') || commonTechs.test(inner)) {
      const techs = inner.split(',').map(t => t.trim()).filter(Boolean);
      extractedTech.push(...techs);
      cleanedTitle = cleanedTitle.replace(parenMatch[0], '');
    }
  }

  cleanedTitle = cleanedTitle.trim();
  // Remove any trailing dashes or punctuation that were separators before the tags
  cleanedTitle = cleanedTitle.replace(/\s*[-–—:|]\s*$/, '').trim();

  return { cleanedTitle, extractedTech };
}

/**
 * Scans the entire raw text stream (beyond the header section) for platform mentions.
 * Returns observed metrics if URLs are absent.
 */
export function scanGlobalPlatformMentions(text: string): { leetcode: string | null; codeforces: string | null } {
  let leetcode: string | null = null;
  let codeforces: string | null = null;

  const lines = text.split('\n');
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    const lowerLine = trimmedLine.toLowerCase();
    
    // LeetCode mention scan
    if (lowerLine.includes('leetcode')) {
      const metricMatch = trimmedLine.match(/(?:solved\s*\d+\+?\s*(?:problems|questions)?|\d+\+?\s*(?:problems|questions)?\s*solved|\b\d+\+?\b\s*problems|rating:?\s*\d+)/i);
      if (metricMatch) {
        leetcode = trimmedLine.replace(/^[-*•■+o\s]+/, '').trim();
      } else {
        const idx = lowerLine.indexOf('leetcode');
        const context = trimmedLine.substring(Math.max(0, idx - 25), Math.min(trimmedLine.length, idx + 35)).trim();
        leetcode = context.replace(/^[-*•■+o\s]+/, '').trim();
      }
    }

    // Codeforces mention scan
    if (lowerLine.includes('codeforces')) {
      const metricMatch = trimmedLine.match(/(?:rating:?\s*\d+|max\s*rating:?\s*\d+|\d+\+?\s*problems\s*solved|solved\s*\d+\+?\s*problems|\b\d+\+?\b\s*problems|rank:?\s*\w+)/i);
      if (metricMatch) {
        codeforces = trimmedLine.replace(/^[-*•■+o\s]+/, '').trim();
      } else {
        const idx = lowerLine.indexOf('codeforces');
        const context = trimmedLine.substring(Math.max(0, idx - 25), Math.min(trimmedLine.length, idx + 35)).trim();
        codeforces = context.replace(/^[-*•■+o\s]+/, '').trim();
      }
    }
  }

  return { leetcode, codeforces };
}

/**
 * Split header strings on visual delimiters and match phone, email, location, and social links.
 */
export function parseHeaderAndContacts(personalText: string, rawText: string): {
  phone: string | null;
  email: string | null;
  location: string | null;
  linkedin: string | null;
  github: string | null;
  leetcode: string | null;
  codeforces: string | null;
} {
  // Delimiter pattern: |, •, ,, or a hyphen surrounded by whitespace
  const delimiterRegex = /\||•|,|\s+-\s+|\s+-|-\s+/;
  
  const tokens: string[] = [];
  const lines = personalText.split('\n');
  for (const line of lines) {
    const parts = line.split(delimiterRegex);
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed) {
        tokens.push(trimmed);
      }
    }
  }

  let phone: string | null = null;
  let email: string | null = null;
  const locationParts: string[] = [];
  let linkedin: string | null = null;
  let github: string | null = null;
  let leetcode: string | null = null;
  let codeforces: string | null = null;

  const phoneRegex = /^\+?\d{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const locationDictionary = new Set([
    'india', 'united states', 'usa', 'us', 'united kingdom', 'uk', 'canada', 'germany', 'france', 'australia', 'singapore', 'japan', 'netherlands', 'sweden', 'switzerland', 'ireland', 'new zealand', 'spain', 'italy', 'brazil', 'south africa',
    'california', 'ca', 'new york', 'ny', 'texas', 'tx', 'washington', 'wa', 'massachusetts', 'ma', 'illinois', 'il', 'ontario', 'quebec', 'bavaria', 'london', 'delhi', 'karnataka', 'maharashtra', 'tamil nadu', 'telangana', 'haryana', 'up', 'uttar pradesh', 'west bengal', 'pennsylvania', 'pa', 'oregon', 'or', 'florida', 'fl', 'georgia', 'ga',
    'new delhi', 'mumbai', 'bangalore', 'bengaluru', 'hyderabad', 'chennai', 'pune', 'noida', 'gurgaon', 'gurugram', 'kolkata', 'ahmedabad', 'jaipur', 'san francisco', 'sf', 'los angeles', 'la', 'seattle', 'austin', 'boston', 'chicago', 'denver', 'dallas', 'houston', 'miami', 'atlanta', 'portland', 'san jose', 'sunnyvale', 'santa clara', 'mountain view', 'palo alto', 'redmond', 'toronto', 'vancouver', 'montreal', 'berlin', 'munich', 'paris', 'amsterdam', 'dublin', 'sydney', 'melbourne', 'tokyo', 'san diego', 'pittsburgh', 'philadelphia'
  ]);

  const liPattern = /linkedin\.com\/in\/[a-zA-Z0-9-_]+/i;
  const ghPattern = /github\.com\/[a-zA-Z0-9-_]+/i;
  const lcPattern = /leetcode\.com\/(?:u\/)?[a-zA-Z0-9-_]+/i;
  const cfPattern = /codeforces\.com\/profile\/[a-zA-Z0-9-_]+/i;

  for (const token of tokens) {
    if (!phone && phoneRegex.test(token)) {
      phone = token;
      continue;
    }

    if (!email && emailRegex.test(token)) {
      email = token;
      continue;
    }

    const lowerToken = token.toLowerCase();
    
    if (liPattern.test(token)) {
      const match = token.match(liPattern);
      if (match) linkedin = 'https://' + match[0];
      continue;
    }
    if (ghPattern.test(token)) {
      const match = token.match(ghPattern);
      if (match) github = 'https://' + match[0];
      continue;
    }
    if (lcPattern.test(token)) {
      const match = token.match(lcPattern);
      if (match) leetcode = 'https://' + match[0];
      continue;
    }
    if (cfPattern.test(token)) {
      const match = token.match(cfPattern);
      if (match) codeforces = 'https://' + match[0];
      continue;
    }

    if (!token.includes('.') && !token.includes('/') && !token.includes('@')) {
      let isLoc = false;
      for (const loc of locationDictionary) {
        const regex = new RegExp(`\\b${loc}\\b`, 'i');
        if (regex.test(lowerToken)) {
          isLoc = true;
          break;
        }
      }
      if (isLoc) {
        locationParts.push(token);
      }
    }
  }

  // Fallbacks if not detected in tokens
  if (!email) {
    const rawEmailMatch = personalText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (rawEmailMatch) email = rawEmailMatch[0];
  }

  if (!phone) {
    const rawPhoneRegex = /\+?\d{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;
    const matches = personalText.match(rawPhoneRegex);
    if (matches) {
      for (const m of matches) {
        const digitsOnly = m.replace(/\D/g, '');
        if (digitsOnly.length >= 7 && digitsOnly.length <= 15) {
          phone = m.trim();
          break;
        }
      }
    }
  }

  if (!linkedin) {
    const m = personalText.match(/linkedin\.com\/in\/[a-zA-Z0-9-_]+/i);
    if (m) linkedin = 'https://' + m[0];
  }
  if (!github) {
    const m = personalText.match(/github\.com\/[a-zA-Z0-9-_]+/i);
    if (m) github = 'https://' + m[0];
  }
  if (!leetcode) {
    const m = personalText.match(/leetcode\.com\/(?:u\/)?[a-zA-Z0-9-_]+/i);
    if (m) leetcode = 'https://' + m[0];
  }
  if (!codeforces) {
    const m = personalText.match(/codeforces\.com\/profile\/[a-zA-Z0-9-_]+/i);
    if (m) codeforces = 'https://' + m[0];
  }

  const location = locationParts.length > 0 ? locationParts.join(', ') : null;

  return { phone, email, location, linkedin, github, leetcode, codeforces };
}

/**
 * Reclassifies Experience blocks without companies to Projects, cleans up inline tags, and parses tech stack tags.
 */
export function processExperienceAndProjects(data: StructuredResume): void {
  const finalExperience: any[] = [];
  const finalProjects: any[] = [...(data.projects || [])];

  if (data.experience) {
    for (const exp of data.experience) {
      const company = exp.company ? String(exp.company).trim() : null;
      const role = exp.role ? String(exp.role).trim() : null;

      const isCompanyMissing = !company || 
        company.toLowerCase() === 'company inc' || 
        company.toLowerCase() === 'not provided' || 
        company.toLowerCase() === 'none' ||
        company.toLowerCase() === 'null';

      if (isCompanyMissing) {
        // Reclassify as Project
        const title = role || 'Project';
        const { cleanedTitle, extractedTech } = parseInlineTechTags(title);

        finalProjects.push({
          name: cleanedTitle,
          title: cleanedTitle,
          description: exp.achievements ? exp.achievements.join(' ') : '',
          bullets: exp.achievements || [],
          tags: extractedTech,
          tech_stack: extractedTech,
          date: exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : (exp.startDate || exp.endDate || null),
          githubUrl: null,
          liveUrl: null,
          category: 'Project',
          outcome: null
        });
      } else {
        const { cleanedTitle, extractedTech } = parseInlineTechTags(role || '');
        finalExperience.push({
          ...exp,
          company,
          role: cleanedTitle,
          achievements: exp.achievements || []
        });
      }
    }
  }

  const cleanedProjects = finalProjects.map(proj => {
    const title = proj.name || proj.title || 'Project';
    const { cleanedTitle, extractedTech } = parseInlineTechTags(title);
    const techStack = Array.from(new Set([...(proj.tech_stack || proj.tags || []), ...extractedTech]));
    return {
      ...proj,
      name: cleanedTitle,
      title: cleanedTitle,
      tags: techStack,
      tech_stack: techStack,
      bullets: proj.bullets || (proj.description ? [proj.description] : [])
    };
  });

  data.experience = finalExperience;
  data.projects = cleanedProjects;
}

/**
 * Item-Level Semantic Classifier routing child bullet points.
 */
export function reclassifyCertificationsAndAchievements(certifications: string[], achievements: string[]): { certifications: string[]; achievements: string[] } {
  const merged = [...(certifications || []), ...(achievements || [])];
  const finalCerts: string[] = [];
  const finalAchs: string[] = [];

  const achievementsKeywords = ["Winner", "Top", "Rank", "Scholar", "Solved", "1st Place", "Award", "Merit"];
  const certificationsKeywords = ["Certified", "Certificate", "Specialization", "Licence", "AWS", "Meta", "Coursera"];

  for (const item of merged) {
    const cleaned = item.trim();
    if (!cleaned) continue;

    let isAchievement = false;
    for (const keyword of achievementsKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b|${keyword}`, 'i');
      if (regex.test(cleaned)) {
        isAchievement = true;
        break;
      }
    }

    if (isAchievement) {
      finalAchs.push(cleaned);
      continue;
    }

    let isCertification = false;
    for (const keyword of certificationsKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b|${keyword}`, 'i');
      if (regex.test(cleaned)) {
        isCertification = true;
        break;
      }
    }

    if (isCertification) {
      finalCerts.push(cleaned);
    } else {
      finalCerts.push(cleaned);
    }
  }

  return {
    certifications: Array.from(new Set(finalCerts)),
    achievements: Array.from(new Set(finalAchs))
  };
}

/**
 * Maps the internal StructuredResume schema to the exact output JSON structure required.
 */
export function mapToExpectedFormat(data: any, rawText?: string): any {
  let leetcode = data.leetcode || null;
  let codeforces = data.codeforces || null;
  
  if (rawText) {
    const globalMentions = scanGlobalPlatformMentions(rawText);
    if (!leetcode && globalMentions.leetcode) {
      leetcode = globalMentions.leetcode;
    }
    if (!codeforces && globalMentions.codeforces) {
      codeforces = globalMentions.codeforces;
    }
  }

  const personalInfo = {
    full_name: data.personal?.name || null,
    email: data.personal?.email || null,
    phone: data.personal?.phone || null,
    location: data.personal?.location || null
  };

  const socialLinks = {
    linkedin: data.linkedin || null,
    github: data.github || null,
    leetcode,
    codeforces
  };

  const workExperience = (data.experience || []).map((exp: any) => {
    return {
      role: exp.role || null,
      company: exp.company || null,
      location: exp.location || null,
      date_range: exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : (exp.startDate || exp.endDate || "Not provided"),
      bullets: exp.achievements || []
    };
  });

  const projects = (data.projects || []).map((proj: any) => {
    const titleVal = proj.name || proj.title || null;
    const techStackVal = proj.tech_stack || proj.tags || [];
    const bulletsVal = proj.bullets || (proj.description ? [proj.description] : []);
    const descVal = proj.description || (bulletsVal.length > 0 ? bulletsVal.join(' ') : null);
    
    return {
      title: titleVal,
      name: titleVal,
      tech_stack: techStackVal,
      tags: techStackVal,
      date: proj.date || null,
      bullets: bulletsVal,
      description: descVal,
      githubUrl: proj.githubUrl || null,
      liveUrl: proj.liveUrl || null,
      category: proj.category || null,
      outcome: proj.outcome || null
    };
  });

  return {
    ...data,
    personal_information: personalInfo,
    social_links: socialLinks,
    work_experience: workExperience,
    projects: projects,
    certifications: data.certifications || [],
    achievements: data.achievements || []
  };
}

/**
 * Standardizes newlines and strips control characters while preserving spacing and layout.
 */
export function cleanExtractedText(text: string): string {
  let cleaned = text.replace(/\r\n/g, '\n');
  cleaned = cleaned.replace(/[‰Ô°‰]/g, '');
  return cleaned;
}

/**
 * Splits resume into sections based on typical ATS layout headings.
 */
export function splitResumeIntoSections(text: string): Record<string, string> {
  const sections: Record<string, string[]> = {
    personal: []
  };

  const lines = text.split('\n');
  let currentSection = 'personal';

  const headingPatterns: Array<{ name: string; pattern: RegExp }> = [
    {
      name: 'certifications_achievements',
      pattern: /^\s*(?:[\d•■*+-]\s*)*(?:certifications|certificates|achievements|awards)\s*(?:&|and)\s*(?:certifications|certificates|achievements|awards)\b/i
    },
    { 
      name: 'experience', 
      pattern: /^\s*(?:[\d•■*+-]\s*)*(?:professional\s+experience|work\s+experience|experience|employment)\b/i 
    },
    { 
      name: 'education', 
      pattern: /^\s*(?:[\d•■*+-]\s*)*(?:education)\b/i 
    },
    { 
      name: 'projects', 
      pattern: /^\s*(?:[\d•■*+-]\s*)*(?:(?:academic|personal|key|technical|selected|software|recent|open\s*source)\s+)*projects\b/i 
    },
    { 
      name: 'skills', 
      pattern: /^\s*(?:[\d•■*+-]\s*)*(?:skills)\b/i 
    },
    { 
      name: 'languages', 
      pattern: /^\s*(?:[\d•■*+-]\s*)*(?:programming\s+languages|spoken\s+languages|languages)\b/i 
    },
    { 
      name: 'achievements', 
      pattern: /^\s*(?:[\d•■*+-]\s*)*(?:key\s+achievements|achievements)\b/i 
    },
    { 
      name: 'certifications', 
      pattern: /^\s*(?:[\d•■*+-]\s*)*(?:certifications|certificates)\b/i 
    }
  ];

  for (const line of lines) {
    const cleanLine = stripHtmlTags(line).trim();
    if (cleanLine.length > 0 && cleanLine.length < 50) {
      let foundHeading = false;
      for (const { name, pattern } of headingPatterns) {
        if (pattern.test(cleanLine)) {
          currentSection = name;
          if (!sections[currentSection]) {
            sections[currentSection] = [];
          }
          foundHeading = true;
          break;
        }
      }
      if (foundHeading) {
        sections[currentSection].push(line);
        continue;
      }
    }
    sections[currentSection].push(line);
  }

  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(sections)) {
    result[key] = val.join('\n').trim();
  }

  if (result['certifications_achievements']) {
    result['certifications'] = result['certifications_achievements'];
    result['achievements'] = result['certifications_achievements'];
  }

  return result;
}

/**
 * Validates structural integrity of the extracted resume JSON.
 */
export function validateStructuredResume(data: StructuredResume): void {
  if (data.experience) {
    data.experience = data.experience.filter(exp => {
      return exp && typeof exp === 'object' && exp.role;
    });
  }

  if (data.education) {
    data.education = data.education.filter(edu => {
      return edu && typeof edu === 'object' && edu.institution && edu.degree;
    });
  }

  if (data.personal.headline && data.personal.summary) {
    if (data.personal.headline.trim() === data.personal.summary.trim()) {
      data.personal.headline = null;
    }
  }

  if (data.skills) {
    const genericWords = new Set(['research', 'management', 'development', 'communication', 'leadership', 'teamwork']);
    data.skills = Array.from(
      new Set(
        data.skills
          .filter(Boolean)
          .map(s => s.trim())
          .filter(s => s.length > 0 && !genericWords.has(s.toLowerCase()) && !isSectionHeading(s))
      )
    );
  }

  if (data.certifications) {
    data.certifications = data.certifications
      .filter(Boolean)
      .map(c => c.trim())
      .filter(c => c.length > 0 && !isSectionHeading(c));
  }

  if (data.achievements) {
    data.achievements = data.achievements
      .filter(Boolean)
      .map(a => a.trim())
      .filter(a => a.length > 0 && !isSectionHeading(a));
  }
}

/**
 * Helper to call LLM for a specific section with retry and debug logging.
 */
async function callLLMForSection<T>(
  sectionHeading: string,
  sectionText: string,
  prompt: string,
  isEmpty: (res: T) => boolean
): Promise<T> {
  console.log(`Detected Heading:\n${sectionHeading}\n`);
  console.log(`Assigned text:\n${sectionText || 'Empty'}\n`);

  let parsedResponse: T;
  let rawResponseStr = '';

  try {
    parsedResponse = await generateJSON(prompt) as T;
    rawResponseStr = JSON.stringify(parsedResponse, null, 2);

    if (sectionText.trim().length > 0 && isEmpty(parsedResponse)) {
      console.warn(`[Retry Warning] Heading "${sectionHeading}" returned an empty result. Retrying once...`);
      parsedResponse = await generateJSON(prompt) as T;
      rawResponseStr = JSON.stringify(parsedResponse, null, 2);
      if (isEmpty(parsedResponse)) {
        console.error(`[Failure Log] Retry also returned an empty result for heading "${sectionHeading}".`);
      }
    }
  } catch (error: any) {
    console.warn(`[Retry Warning] Heading "${sectionHeading}" failed first attempt: ${error.message || error}. Retrying once...`);
    try {
      parsedResponse = await generateJSON(prompt) as T;
      rawResponseStr = JSON.stringify(parsedResponse, null, 2);
    } catch (retryErr: any) {
      console.error(`[Failure Log] Retry also failed for heading "${sectionHeading}": ${retryErr.message || retryErr}`);
      throw retryErr;
    }
  }

  console.log(`LLM Response:\n${rawResponseStr}\n`);
  console.log(`Parsed JSON:\n${rawResponseStr}\n`);

  return parsedResponse;
}

/**
 * Parses raw resume text into a structured JSON schema using Gemini API or regex fallback.
 * @param text - The raw extracted resume plain text.
 * @returns Structured JSON resume object, demo fallback flag, detected sections, and debug info.
 */
export async function extractStructuredData(text: string): Promise<{ success: boolean; isDemo: boolean; demoReason?: string; data: StructuredResume; detectedSections: string[]; sections: Record<string, string>; debugInfo: DebugInfo }> {
  logKeyStatusOnce();
  const apiKey = process.env.GEMINI_API_KEY;
  let demoReason: string | undefined = undefined;

  console.log('\n=============================================');
  console.log('--- RAW PARSED RESUME TEXT ---');
  console.log(text);
  console.log('=============================================\n');

  const cleanedText = cleanExtractedText(text);
  console.log('\n=============================================');
  console.log('--- PREPROCESSED/CLEANED RESUME TEXT ---');
  console.log(cleanedText);
  console.log('=============================================\n');

  const sections = splitResumeIntoSections(cleanedText);
  const detectedSections = Object.keys(sections).filter(k => k !== 'personal');

  console.log('[4/8] Section detection completed');
  console.log('--- DETECTED SECTION NAMES ---');
  console.log(detectedSections);
  console.log('------------------------------\n');

  console.log('--- TEXT ASSIGNED TO EACH SECTION ---');
  for (const [secName, secText] of Object.entries(sections)) {
    console.log(`[Section: ${secName}] length: ${secText.length} characters`);
    console.log(secText);
    console.log('-------------------------------------\n');
  }

  // Pre-extract and categorize links using protocol-agnostic regex
  const allUrls = detectUrls(cleanedText);
  const categorized = categorizeUrls(allUrls);

  const llmInputs: Record<string, string> = {};
  const responses: Record<string, any> = {};

  if (apiKey) {
    try {
      // 1. Personal Info Extraction
      const personalPrompt = `You are an expert resume parsing AI. Your task is to extract personal and contact information from the following text and return it as a single JSON object.
Do not fabricate or hallucinate any information. If a field is not present in the text, set its value to null. Only extract what is explicitly stated.

Target JSON Schema:
{
  "name": null,
  "headline": null,
  "email": null,
  "phone": null,
  "location": null,
  "summary": null
}

Rules:
1. Extract name: Look for the candidate's name (usually at the very top of the text).
2. Extract headline: Only extract the professional title directly under or near the name. If no professional title is listed directly under or near the name, set it to null. Do not use skills or summary as the headline.
3. Extract summary: Only extract a dedicated resume summary or profile section. Do not combine or concatenate unrelated text from other sections. If no summary section exists, set it to null.
4. Extract location, email, and phone: Only if explicitly listed.

Text:
${sections.personal}`;
      const eduPrompt = sections.education ? `You are an expert resume parsing AI. Your task is to extract education entries from the following text and return them as a JSON array of objects.
Do not fabricate or hallucinate any information. Only extract what is explicitly stated.

Target JSON Schema:
[
  {
    "institution": null,
    "degree": null,
    "field": null,
    "gradYear": null,
    "gpa": null
  }
]

Text:
${sections.education}` : '';

      const expPrompt = sections.experience ? `You are an expert resume parsing AI. Your task is to extract work experience entries from the following text and return them as a JSON array of objects.
Do not fabricate or hallucinate any information. Only extract what is explicitly stated.

Target JSON Schema:
[
  {
    "company": null,
    "role": null,
    "startDate": null,
    "endDate": null,
    "achievements": []
  }
]

Rules:
1. Extract company name, job title/role, start date, end date, and achievements (as an array of bullet points exactly as written).
2. If any field is missing, set its value to null.
3. Do not merge multiple roles at the same company into a single entry; keep them separate.

Text:
${sections.experience}` : '';

      const skillsPrompt = sections.skills ? `You are an expert resume parsing AI. Your task is to extract skills from the following text and return them as a JSON array of strings.
Do not fabricate or hallucinate any information. Only extract what is explicitly stated.

Target JSON Schema:
[
  "Skill 1",
  "Skill 2"
]

Rules:
1. Extract only individual skills and technologies listed in the text.
2. Do not include generic phrases. Split comma-separated skills or grouped skills (e.g. "Atlassian (Bitbucket, Jira)" should be extracted as "Atlassian", "Bitbucket", "Jira").

Text:
${sections.skills}` : '';

      const projPrompt = sections.projects ? `CRITICAL TASK: EXHAUSTIVE MULTI-PROJECT EXTRACTION ENGINE

MANDATE:
You are an uncompromising JSON extraction parser. You are failing your objective if you return only 1 project when a resume contains multiple projects. You MUST extract EVERY SINGLE project present in the input document.

EXECUTION STEPS (FOLLOW IN EXACT SEQUENCE):
STEP 1: PROJECT DISCOVERY & SCANNING PHASE
Before generating any JSON structure, scan the ENTIRE document text under "Projects" (or project-related subheadings) and identify ALL candidate project titles.
Count the total number of projects found: N.
A project is defined by ANY of the following: a project title, a bolded line, a line with tech stack brackets ([...] or (...)), a project link, or a distinct bulleted list block under the projects section.

STEP 2: ARRAY CONSTRUCTION (NO EARLY STOPPING)
Create the output array projects[]. You must run an explicit extraction loop until your array length equals N.
FOR EACH discovered project title (from 1 to N):
  1. Set project.title = Clean Title String
  2. Set project.name = Clean Title String
  3. Extract tech stack into project.tech_stack[] and project.tags[] (if present)
  4. Extract dates/links into project.date and project.githubUrl / project.liveUrl (if present)
  5. Collect ALL bullet points beneath this title into project.bullets[] and set project.description = merged bullets string
  6. Push object to projects[]

STRICT CONSTRAINTS & FAILURE PREVENTIONS:
- NO TRUNCATION: If there are 3, 4, or 5 projects in the resume, your projects[] array MUST contain 3, 4, or 5 objects. Outputting 1 project when N > 1 is a fatal error.
- NO NESTED MERGING: Never dump Project 2's title or bullet points into Project 1's description/bullets array. Project 2 MUST be instantiated as its own standalone JSON object in the projects[] array.
- FORMAT INDEPENDENCE: Even if Project 1 has a date and Project 2 does NOT have a date, Project 2 is still a valid project object. Do not drop Project 2 just because its layout differs from Project 1.

FEW-SHOT ENFORCEMENT EXAMPLE:
SOURCE TEXT:
PROJECTS
1. Smart Health Tracker [Python, React] - 2025
   - Created real-time health monitoring portal.
2. AI Chatbot Assistant [Node.js, OpenAI API]
   - Developed conversational agent for customer support.
3. Portfolio Website [HTML, CSS] - 2024
   - Designed responsive personal portfolio site.

EXPECTED OUTPUT (ALL 3 PROJECTS MUST BE RETURNED):
[
  {
    "title": "Smart Health Tracker",
    "name": "Smart Health Tracker",
    "tech_stack": ["Python", "React"],
    "tags": ["Python", "React"],
    "date": "2025",
    "bullets": ["Created real-time health monitoring portal."],
    "description": "Created real-time health monitoring portal.",
    "githubUrl": null,
    "liveUrl": null,
    "category": "Project",
    "outcome": null
  },
  {
    "title": "AI Chatbot Assistant",
    "name": "AI Chatbot Assistant",
    "tech_stack": ["Node.js", "OpenAI API"],
    "tags": ["Node.js", "OpenAI API"],
    "date": null,
    "bullets": ["Developed conversational agent for customer support."],
    "description": "Developed conversational agent for customer support.",
    "githubUrl": null,
    "liveUrl": null,
    "category": "Project",
    "outcome": null
  },
  {
    "title": "Portfolio Website",
    "name": "Portfolio Website",
    "tech_stack": ["HTML", "CSS"],
    "tags": ["HTML", "CSS"],
    "date": "2024",
    "bullets": ["Designed responsive personal portfolio site."],
    "description": "Designed responsive personal portfolio site.",
    "githubUrl": null,
    "liveUrl": null,
    "category": "Project",
    "outcome": null
  }
]

Text:
${sections.projects}` : '';

      const certPrompt = sections.certifications ? `You are an expert resume parsing AI. Your task is to extract certifications from the following text and return them as a JSON array of strings.
Do not fabricate or hallucinate any information. Only extract what is explicitly stated.

Target JSON Schema:
[
  "Certification 1",
  "Certification 2"
]

Text:
${sections.certifications}` : '';

      const achPrompt = sections.achievements ? `You are an expert resume parsing AI. Your task is to extract achievements, awards, and honors from the following text and return them as a JSON array of strings.
Do not fabricate or hallucinate any information. Only extract what is explicitly stated.

Target JSON Schema:
[
  "Achievement 1",
  "Achievement 2"
]

Text:
${sections.achievements}` : '';

      llmInputs['personal'] = personalPrompt;
      if (sections.education) llmInputs['education'] = eduPrompt;
      if (sections.experience) llmInputs['experience'] = expPrompt;
      if (sections.skills) llmInputs['skills'] = skillsPrompt;
      if (sections.projects) llmInputs['projects'] = projPrompt;
      if (sections.certifications) llmInputs['certifications'] = certPrompt;
      if (sections.achievements) llmInputs['achievements'] = achPrompt;

      let personalRes: any = null;
      let educationRes: any[] = [];
      let experienceRes: any[] = [];
      let skillsRes: string[] = [];
      let projectsRes: any[] = [];
      let certificationsRes: string[] = [];
      let achievementsRes: string[] = [];

      const personalPromise = callLLMForSection<any>(
        'Personal Information',
        sections.personal || '',
        personalPrompt,
        (res) => !res || (!res.name && !res.email && !res.phone)
      ).catch(err => {
        throw new Error(`Personal section found but parser failed. Reason: ${err.message || err}`);
      });

      const educationPromise = (async () => {
        if (!sections.education) return [];
        await new Promise(r => setTimeout(r, 200));
        return callLLMForSection<any[]>(
          'Education',
          sections.education,
          eduPrompt,
          (res) => !Array.isArray(res) || res.length === 0
        );
      })().catch(err => {
        throw new Error(`Education section found but parser failed. Reason: ${err.message || err}`);
      });

      const experiencePromise = (async () => {
        if (!sections.experience) return [];
        await new Promise(r => setTimeout(r, 400));
        return callLLMForSection<any[]>(
          'Professional Experience',
          sections.experience,
          expPrompt,
          (res) => !Array.isArray(res) || res.length === 0
        );
      })().catch(err => {
        throw new Error(`Experience section found but parser failed. Reason: ${err.message || err}`);
      });

      const skillsPromise = (async () => {
        if (!sections.skills) return [];
        await new Promise(r => setTimeout(r, 600));
        return callLLMForSection<string[]>(
          'Skills',
          sections.skills,
          skillsPrompt,
          (res) => !Array.isArray(res) || res.length === 0
        );
      })().catch(err => {
        throw new Error(`Skills section found but parser failed. Reason: ${err.message || err}`);
      });

      const projectsPromise = (async () => {
        if (!sections.projects) return [];
        await new Promise(r => setTimeout(r, 800));
        return callLLMForSection<any[]>(
          'Key Projects',
          sections.projects,
          projPrompt,
          (res) => !Array.isArray(res) || res.length === 0
        );
      })().catch(err => {
        throw new Error(`Projects section found but parser failed. Reason: ${err.message || err}`);
      });

      const certificationsPromise = (async () => {
        if (!sections.certifications) return [];
        await new Promise(r => setTimeout(r, 1000));
        return callLLMForSection<string[]>(
          'Certifications',
          sections.certifications,
          certPrompt,
          (res) => !Array.isArray(res) || res.length === 0
        );
      })().catch(err => {
        throw new Error(`Certifications section found but parser failed. Reason: ${err.message || err}`);
      });

      const achievementsPromise = (async () => {
        if (!sections.achievements) return [];
        await new Promise(r => setTimeout(r, 1200));
        return callLLMForSection<string[]>(
          'Key Achievements',
          sections.achievements,
          achPrompt,
          (res) => !Array.isArray(res) || res.length === 0
        );
      })().catch(err => {
        throw new Error(`Achievements section found but parser failed. Reason: ${err.message || err}`);
      });

      console.log('[5/8] Calling Gemini API...');
      const results = await Promise.all([
        personalPromise,
        educationPromise,
        experiencePromise,
        skillsPromise,
        projectsPromise,
        certificationsPromise,
        achievementsPromise
      ]);
      console.log('[6/8] Gemini response received');

      personalRes = results[0];
      educationRes = results[1];
      experienceRes = results[2];
      skillsRes = results[3];
      projectsRes = results[4];
      certificationsRes = results[5];
      achievementsRes = results[6];

      responses['personal'] = personalRes;
      if (sections.education) responses['education'] = educationRes;
      if (sections.experience) responses['experience'] = experienceRes;
      if (sections.skills) responses['skills'] = skillsRes;
      if (sections.projects) responses['projects'] = projectsRes;
      if (sections.certifications) responses['certifications'] = certificationsRes;
      if (sections.achievements) responses['achievements'] = achievementsRes;

      // Assemble final data structure
      const data: StructuredResume = {
        personal: {
          name: personalRes?.name || null,
          headline: personalRes?.headline || null,
          email: personalRes?.email || null,
          phone: personalRes?.phone || null,
          location: personalRes?.location || null,
          summary: personalRes?.summary || null,
        },
        education: Array.isArray(educationRes) ? educationRes : [],
        experience: Array.isArray(experienceRes) ? experienceRes : [],
        projects: Array.isArray(projectsRes) ? projectsRes : [],
        skills: Array.isArray(skillsRes) ? skillsRes : [],
        achievements: Array.isArray(achievementsRes) ? achievementsRes : [],
        certifications: Array.isArray(certificationsRes) ? certificationsRes : [],
        languages: parseLanguagesHeuristics(sections.languages || '', sections.skills || '', text),
        github: categorized.github[0] || null,
        linkedin: categorized.linkedin[0] || null,
        portfolio: categorized.portfolio[0] || null,
        leetcode: null,
        codeforces: null,
        codechef: null,
        hackerrank: null,
        otherLinks: categorized.otherLinks
      };

      // Map coding profiles
      categorized.coding.forEach(urlStr => {
        const lower = urlStr.toLowerCase();
        if (lower.includes('leetcode.com')) data.leetcode = urlStr;
        else if (lower.includes('codeforces.com')) data.codeforces = urlStr;
        else if (lower.includes('codechef.com')) data.codechef = urlStr;
        else if (lower.includes('hackerrank.com')) data.hackerrank = urlStr;
      });

      // Override contacts with tokenized visual delimiter parsing to ensure no drops
      const headerContacts = parseHeaderAndContacts(sections.personal || '', text);
      if (!data.personal.email) data.personal.email = headerContacts.email;
      if (!data.personal.phone) data.personal.phone = headerContacts.phone;
      if (!data.personal.location) data.personal.location = headerContacts.location;
      if (!data.github) data.github = headerContacts.github;
      if (!data.linkedin) data.linkedin = headerContacts.linkedin;
      if (!data.leetcode) data.leetcode = headerContacts.leetcode;
      if (!data.codeforces) data.codeforces = headerContacts.codeforces;

      // Reclassify experience without company, clean tech stack tags from titles
      processExperienceAndProjects(data);

      // Classify compound certifications and achievements
      if (sections.certifications_achievements) {
        const classified = reclassifyCertificationsAndAchievements(data.certifications, data.achievements);
        data.certifications = classified.certifications;
        data.achievements = classified.achievements;
      }

      // Headline Generation Logic:
      // If no headline exists, derive it from the most recent job title only.
      if (!data.personal.headline) {
        if (data.experience && data.experience.length > 0) {
          data.personal.headline = data.experience[0].role;
        }
      }

      // First run structural validation and filters on the extracted data
      validateStructuredResume(data);

      // Validate: Ensure arrays are not empty if headings exist in the resume
      if (sections.education) {
        if (!educationRes || !Array.isArray(educationRes) || educationRes.length === 0) {
          const reason = `LLM returned empty or non-array result for Education. Raw output: ${JSON.stringify(responses['education'] || educationRes)}`;
          console.error(`Education section found but parser failed. Reason: ${reason}`);
          throw new Error(`Education section found but parser failed. Reason: ${reason}`);
        }
        if (data.education.length === 0) {
          const reason = `All extracted education entries (${educationRes.length}) were filtered out because they were missing required fields (institution or degree). Raw entries: ${JSON.stringify(educationRes)}`;
          console.error(`Education section found but parser failed. Reason: ${reason}`);
          throw new Error(`Education section found but parser failed. Reason: ${reason}`);
        }
      }

      if (sections.experience) {
        const totalEntries = (data.experience?.length || 0) + (data.projects?.length || 0);
        if (totalEntries === 0) {
          const reason = `Experience section found but parser failed to extract any valid items. Raw entries: ${JSON.stringify(experienceRes)}`;
          console.error(`Experience section found but parser failed. Reason: ${reason}`);
          throw new Error(`Experience section found but parser failed. Reason: ${reason}`);
        }
      }

      if (sections.skills && data.skills.length === 0) {
        throw new Error('Validation Failed: Skills heading was detected in the resume, but no skills were successfully extracted.');
      }
      if (sections.certifications && data.certifications.length === 0) {
        throw new Error('Validation Failed: Certifications heading was detected in the resume, but no certifications were successfully extracted.');
      }
      if (sections.achievements && data.achievements.length === 0) {
        throw new Error('Validation Failed: Achievements heading was detected in the resume, but no achievements/awards were successfully extracted.');
      }

      // Step 6 Validation
      const rawLower = text.toLowerCase();

      if (rawLower.includes('education')) {
        if (!data.education || data.education.length === 0) {
          throw new Error('Education section found in text but parser failed. Reason: "EDUCATION" keyword detected in raw text, but no valid education entries were successfully extracted.');
        }
      }

      if (rawLower.includes('experience') || rawLower.includes('work') || rawLower.includes('employment')) {
        const totalEntriesCount = (data.experience?.length || 0) + (data.projects?.length || 0);
        if (totalEntriesCount === 0) {
          throw new Error('Work Experience section found in text but parser failed. Reason: experience/work keyword detected in raw text, but no valid experience or project entries were successfully extracted.');
        }
      }

      if (rawLower.includes('certification') || rawLower.includes('certificate')) {
        if (!data.certifications || data.certifications.length === 0) {
          throw new Error('Certifications section found in text but parser failed. Reason: certification/certificate keyword detected in raw text, but no valid certifications were successfully extracted.');
        }
      }

      if (rawLower.includes('achievement') || rawLower.includes('award')) {
        if (!data.achievements || data.achievements.length === 0) {
          throw new Error('Achievements section found in text but parser failed. Reason: achievement/award keyword detected in raw text, but no valid achievements were successfully extracted.');
        }
      }

      // Map to expected JSON format
      const finalMappedData = mapToExpectedFormat(data, text);

      const debugInfo: DebugInfo = {
        rawPdfText: text,
        cleanedText,
        detectedSections,
        sections,
        llmInputs,
        extractedJson: responses
      };

      return {
        success: true,
        isDemo: false,
        data: finalMappedData,
        detectedSections,
        sections,
        debugInfo
      };
    } catch (llmError: any) {
      console.error('LLM parsing error, falling back to regex parser:', llmError.message || llmError);
      
      const isQuotaOrNetworkError = 
        llmError.message && 
        (llmError.message.includes('429') || 
         llmError.message.includes('Quota exceeded') || 
         llmError.message.includes('Too Many Requests') ||
         llmError.message.includes('503') ||
         llmError.message.includes('Service Unavailable') ||
         llmError.message.includes('API_KEY_INVALID') ||
         llmError.message.includes('quota'));

      if (isQuotaOrNetworkError) {
        demoReason = 'quota_exceeded';
      } else {
        if (
          llmError.message && 
          (llmError.message.includes('Validation Failed') || 
           llmError.message.includes('parser failed') || 
           llmError.message.includes('found in text but parser failed'))
        ) {
          throw llmError;
        }
      }
    }
  }

  // Fallback to high-fidelity regex parser (Demo Mode) without hallucinating details
  const headerContacts = parseHeaderAndContacts(sections.personal || '', cleanedText);
  const email = headerContacts.email;
  const phone = headerContacts.phone;
  const github = headerContacts.github || (categorized.github.length > 0 ? categorized.github[0] : null);
  const linkedin = headerContacts.linkedin || (categorized.linkedin.length > 0 ? categorized.linkedin[0] : null);
  const portfolio = categorized.portfolio.length > 0 ? categorized.portfolio[0] : null;
  
  let leetcode = headerContacts.leetcode;
  let codeforces = headerContacts.codeforces;
  let codechef = null;
  let hackerrank = null;

  categorized.coding.forEach(urlStr => {
    const lower = urlStr.toLowerCase();
    if (lower.includes('leetcode.com')) leetcode = urlStr;
    else if (lower.includes('codeforces.com')) codeforces = urlStr;
    else if (lower.includes('codechef.com')) codechef = urlStr;
    else if (lower.includes('hackerrank.com')) hackerrank = urlStr;
  });

  const commonSkills = [
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue', 'Angular',
    'Node.js', 'Express', 'Python', 'Django', 'Flask', 'FastAPI', 'Java', 'Spring',
    'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB',
    'Redis', 'GraphQL', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Git', 'CI/CD'
  ];
  const skills: string[] = [];
  const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  commonSkills.forEach(skill => {
    const escapedSkill = escapeRegExp(skill);
    const startBoundary = /^[a-zA-Z0-9_]/.test(skill) ? '\\b' : '';
    const endBoundary = /[a-zA-Z0-9_]$/.test(skill) ? '\\b' : '';
    const regex = new RegExp(`${startBoundary}${escapedSkill}${endBoundary}`, 'i');
    if (regex.test(cleanedText)) {
      skills.push(skill);
    }
  });

  let name = null;
  const lines = cleanedText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length > 0) {
    if (lines[0].length < 40 && !lines[0].includes('@') && !lines[0].includes('Resume') && !lines[0].includes('Page')) {
      name = lines[0];
    } else if (email) {
      const localPart = email.split('@')[0];
      name = localPart.split(/[._-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
  }

  let summary = null;
  const summaryIndex = cleanedText.toLowerCase().search(/summary|objective|profile/);
  if (summaryIndex !== -1) {
    const sub = cleanedText.substring(summaryIndex + 8, summaryIndex + 300).trim();
    const firstDot = sub.indexOf('.');
    const secondDot = sub.indexOf('.', firstDot + 1);
    if (secondDot !== -1) {
      summary = sub.substring(0, secondDot + 1).replace(/\r?\n|\r/g, ' ');
    } else if (firstDot !== -1) {
      summary = sub.substring(0, firstDot + 1).replace(/\r?\n|\r/g, ' ');
    }
  }

  const demoData: StructuredResume = {
    personal: {
      name: name || null,
      headline: null,
      email: email || null,
      phone: phone || null,
      location: headerContacts.location || null,
      summary: summary || null,
    },
    education: parseEducationHeuristics(sections.education || ''),
    experience: parseExperienceHeuristics(sections.experience || ''),
    projects: parseProjectsHeuristics(sections.projects || ''),
    skills: skills.length > 0 ? skills : [],
    achievements: parseAchievementsHeuristics(sections.achievements || ''),
    certifications: parseCertificationsHeuristics(sections.certifications || ''),
    languages: parseLanguagesHeuristics(sections.languages || '', sections.skills || '', cleanedText),
    github,
    linkedin,
    portfolio,
    leetcode,
    codeforces,
    codechef,
    hackerrank,
    otherLinks: categorized.otherLinks
  };

  // Reclassify experience without company, clean tech stack tags from titles
  processExperienceAndProjects(demoData);

  // Classify compound certifications and achievements
  if (sections.certifications_achievements) {
    const classified = reclassifyCertificationsAndAchievements(demoData.certifications, demoData.achievements);
    demoData.certifications = classified.certifications;
    demoData.achievements = classified.achievements;
  }

  validateStructuredResume(demoData);

  // Map demoData to expected JSON format
  const finalMappedDemoData = mapToExpectedFormat(demoData, cleanedText);

  const debugInfo: DebugInfo = {
    rawPdfText: text,
    cleanedText,
    detectedSections,
    sections,
    llmInputs: { mode: 'Demo Mode - Regex Fallback. No LLM prompts sent.' },
    extractedJson: { demoData: finalMappedDemoData }
  };

  return {
    success: true,
    isDemo: true,
    demoReason,
    data: finalMappedDemoData,
    detectedSections,
    sections,
    debugInfo
  };
}

const DATE_PART = /(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\b(?:\s*\d{2,4})?|\b(19|20)\d{2}\b|\b\d{1,2}\/\d{2,4}\b|present|current|active)/i;
const DATE_RANGE_REGEX = new RegExp(`${DATE_PART.source}\\s*[-–—to]+\\s*${DATE_PART.source}`, 'i');
const YEAR_RANGE_REGEX = /\b(19|20)\d{2}\s*[-–—]+\s*(?:present|current|\b(19|20)\d{2}\b)/i;

const LANGUAGE_PATTERNS: Array<{ name: string; regex: RegExp }> = [
  { name: 'C++', regex: /\b(c\+\+|cpp)(?!\+)/i },
  { name: 'C', regex: /\bc\b(?![+#a-zA-Z0-9])/i },
  { name: 'Java', regex: /\bjava\b/i },
  { name: 'JavaScript', regex: /\b(javascript|js)\b/i },
  { name: 'Python', regex: /\b(python|py|python3)\b/i },
  { name: 'TypeScript', regex: /\b(typescript|ts)\b/i },
  { name: 'HTML', regex: /\bhtml\b/i },
  { name: 'CSS', regex: /\bcss\b/i },
  { name: 'C#', regex: /\b(c#|c-sharp)(?!#)/i },
  { name: 'Go', regex: /\b(go|golang)\b/i },
  { name: 'Rust', regex: /\brust\b/i },
  { name: 'Ruby', regex: /\bruby\b/i },
  { name: 'PHP', regex: /\bphp\b/i },
  { name: 'SQL', regex: /\bsql\b/i },
  { name: 'Swift', regex: /\bswift\b/i },
  { name: 'Kotlin', regex: /\bkotlin\b/i },
  { name: 'Scala', regex: /\bscala\b/i },
  { name: 'R', regex: /\br\b/i },
  { name: 'Dart', regex: /\bdart\b/i },
  { name: 'Haskell', regex: /\bhaskell\b/i },
  { name: 'Lua', regex: /\blua\b/i },
  
  // Spoken
  { name: 'English', regex: /\benglish\b/i },
  { name: 'Hindi', regex: /\bhindi\b/i },
  { name: 'Spanish', regex: /\bspanish\b/i },
  { name: 'French', regex: /\bfrench\b/i },
  { name: 'German', regex: /\bgerman\b/i },
  { name: 'Mandarin', regex: /\bmandarin\b/i },
  { name: 'Chinese', regex: /\bchinese\b/i },
  { name: 'Japanese', regex: /\bjapanese\b/i },
  { name: 'Russian', regex: /\brussian\b/i },
  { name: 'Portuguese', regex: /\bportuguese\b/i },
  { name: 'Italian', regex: /\bitalian\b/i },
  { name: 'Arabic', regex: /\barabic\b/i },
  { name: 'Bengali', regex: /\bbengali\b/i },
  { name: 'Punjabi', regex: /\bpunjabi\b/i },
  { name: 'Telugu', regex: /\btelugu\b/i },
  { name: 'Marathi', regex: /\bmarathi\b/i },
  { name: 'Tamil', regex: /\btamil\b/i },
  { name: 'Urdu', regex: /\burdu\b/i },
  { name: 'Gujarati', regex: /\bgujarati\b/i },
  { name: 'Kannada', regex: /\bkannada\b/i },
  { name: 'Malayalam', regex: /\bmalayalam\b/i }
];

export function parseLanguagesHeuristics(languagesText: string, skillsText: string, rawText: string): string[] {
  const detected = new Set<string>();
  
  const cleanLangText = stripHtmlTags(languagesText).trim();
  const cleanSkillText = stripHtmlTags(skillsText).trim();
  
  for (const { name, regex } of LANGUAGE_PATTERNS) {
    if (name === 'C' || name === 'R') {
      if (regex.test(cleanLangText) || regex.test(cleanSkillText)) {
        detected.add(name);
      }
    } else {
      if (regex.test(cleanLangText) || regex.test(cleanSkillText) || (cleanLangText.length === 0 && cleanSkillText.length === 0 && regex.test(rawText))) {
        detected.add(name);
      }
    }
  }
  
  if (cleanLangText) {
    const individualWords = cleanLangText.split(/[,\n|•\s/-]/).map(w => w.trim()).filter(w => w.length > 1);
    for (const word of individualWords) {
      const lower = word.toLowerCase();
      const stopWords = new Set(['languages', 'programming', 'spoken', 'fluent', 'native', 'proficient', 'intermediate', 'beginner', 'advanced', 'level', 'skills', 'and', 'with', 'in', 'c++', 'cpp', 'js', 'javascript', 'html', 'css', 'rust', 'php', 'java', 'python']);
      if (!stopWords.has(lower) && word.length > 2 && /^[a-zA-Z]+$/.test(word)) {
        const cap = word.charAt(0).toUpperCase() + word.slice(1);
        detected.add(cap);
      }
    }
  }
  
  return Array.from(detected);
}

export function stripHtmlTags(str: string): string {
  return str.replace(/<\/?[^>]+(>|$)/g, "").trim();
}

export function isSectionHeading(str: string): boolean {
  const headingPatterns = [
    /certifications/i,
    /certificates/i,
    /achievements/i,
    /awards/i,
    /education/i,
    /experience/i,
    /work/i,
    /employment/i,
    /projects/i,
    /skills/i,
    /personal/i,
    /summary/i,
    /objective/i,
    /profile/i
  ];
  const cleaned = str.trim().toLowerCase();
  if (cleaned.length > 50) return false;
  
  for (const pattern of headingPatterns) {
    if (pattern.test(cleaned)) {
      const isBullet = /^[-•*■+o\d#]|\[\d+\]/.test(cleaned);
      if (!isBullet) {
        return true;
      }
    }
  }
  return false;
}

export function cleanAndJoinListLines(lines: string[]): string[] {
  const cleaned: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    const isBullet = /^[-•*■+o\d#]|\[\d+\]/.test(trimmed);
    
    if (cleaned.length > 0 && !isBullet) {
      const prev = cleaned[cleaned.length - 1];
      const endsWithTerminal = /[.;!?]$/.test(prev);
      if (!endsWithTerminal) {
        cleaned[cleaned.length - 1] = prev + ' ' + trimmed;
        continue;
      }
    }
    cleaned.push(trimmed);
  }
  return cleaned;
}

function isNewHeaderLine(line: string): boolean {
  if (DATE_RANGE_REGEX.test(line) || YEAR_RANGE_REGEX.test(line)) {
    return true;
  }
  
  const isCompanyPattern = /\b(inc|corp|ltd|llc|gmbh|solutions|technologies|systems|labs|group|software|company|consulting|agency|abc|google|microsoft|amazon|meta|apple|netflix)\b/i.test(line);
  const isRolePattern = /\b(engineer|developer|analyst|manager|consultant|designer|lead|architect|intern|specialist|programmer|administrator|officer)\b/i.test(line);
  
  if (isCompanyPattern || isRolePattern) {
    return true;
  }
  
  return false;
}

function isNewProjectHeaderLine(line: string): boolean {
  const clean = stripHtmlTags(line).trim();
  if (!clean || clean.includes('@')) return false;
  
  const isBullet = clean.startsWith('-') || clean.startsWith('*') || clean.startsWith('•') || clean.startsWith('o ') || clean.startsWith('■') || clean.startsWith('+');
  if (isBullet) return false;
  
  // If it starts with common action verbs, it's a description bullet, not a project header
  const startsWithVerb = /^(?:built|created|developed|implemented|managed|designed|worked|led|optimized|collaborated|integrated|authored|wrote|setup|configured|engineered|assisted|hosted|deployed|scaled|resolved|reduced|increased)\b/i.test(clean);
  if (startsWithVerb) {
    return false;
  }

  // If it's a date-only line, it's not a new project header
  const isDateOnly = /^(?:\s*|\s*[-–—to,•|]\s*|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|supplementary|september|october|november|december|present|current)\b|\b(19|20)\d{2}\b)*$/i.test(clean);
  if (isDateOnly) {
    return false;
  }

  // If it's a link-only line, it's not a new project header
  const isLinkOnly = /^(?:https?:\/\/)?(?:www\.)?(?:github\.com|gitlab\.com|bitbucket\.org|linkedin\.com|leetcode\.com|codeforces\.com|hackerrank\.com|codechef\.com|behance\.net|dribbble\.com)\/\S*$/i.test(clean);
  if (isLinkOnly) {
    return false;
  }
  
  const hasTechBrackets = /\[[^\]]+\]|\([^)]+\)/.test(clean);
  if (hasTechBrackets) {
    return true;
  }
  
  if (/\b(19|20)\d{2}\b/i.test(clean) && clean.length < 50) {
    return true;
  }
  
  if (clean.length < 50 && !/[.;!?]$/.test(clean)) {
    if (/^(?:technologies|tech|stack|tools):/i.test(clean)) {
      return false;
    }
    return true;
  }
  
  return false;
}

function parseEducationHeuristics(text: string): any[] {
  if (!text) return [];
  const entries: any[] = [];
  
  const lines = text.split('\n')
    .map(l => stripHtmlTags(l).trim())
    .filter(l => l.length > 0 && !/^\s*(?:education)\b\s*$/i.test(l));
  
  let currentEntry: any = null;
  
  for (const line of lines) {
    const isInstitution = /university|college|institute|school|academy|iit|nit|bits|iiit/i.test(line);
    const isDegree = /bachelor|master|phd|b\.tech|m\.tech|b\.s\.|m\.s\.|b\.a\.|m\.a\.|bsc|msc|ph\.d|degree|diploma|btech|mtech|b\.e\.|m\.e\./i.test(line);
    const yearMatch = line.match(/\b(19|20)\d{2}\b/);
    
    if (isInstitution) {
      if (currentEntry) {
        entries.push(currentEntry);
      }
      currentEntry = { institution: line, degree: null, field: null, gradYear: yearMatch ? yearMatch[0] : null, gpa: null };
    } else if (isDegree) {
      if (!currentEntry) {
        currentEntry = { institution: 'University', degree: line, field: null, gradYear: yearMatch ? yearMatch[0] : null, gpa: null };
      } else {
        currentEntry.degree = line;
      }
    } else {
      if (currentEntry) {
        const gpaMatch = line.match(/gpa:?\s*(\d+\.?\d*)/i) || line.match(/cgpa:?\s*(\d+\.?\d*)/i);
        if (gpaMatch) {
          currentEntry.gpa = gpaMatch[1];
        }
      }
    }
  }
  
  if (currentEntry) {
    entries.push(currentEntry);
  }
  
  return entries
    .map(entry => {
      const inst = entry.institution || 'University';
      const deg = entry.degree || 'Bachelor of Science';
      return {
        institution: inst,
        degree: deg,
        field: entry.field || 'Computer Science',
        gradYear: entry.gradYear || '2026',
        gpa: entry.gpa || null
      };
    })
    .filter(entry => entry.institution && entry.degree);
}

function parseExperienceHeuristics(text: string): any[] {
  if (!text) return [];
  
  const sectionTitlePattern = /^\s*(?:professional\s+experience|work\s+experience|experience|employment)\b\s*$/i;
  const lines = text.split('\n')
    .map(l => stripHtmlTags(l).trim())
    .filter(l => l.length > 0 && !sectionTitlePattern.test(l));
    
  const blocks: Array<{ headerLines: string[], bulletLines: string[] }> = [];
  let currentBlock: { headerLines: string[], bulletLines: string[] } | null = null;
  
  for (const line of lines) {
    const isBullet = line.startsWith('-') || line.startsWith('*') || line.startsWith('•') || line.startsWith('o ') || line.startsWith('■') || line.startsWith('+');
    
    if (isBullet) {
      if (!currentBlock) {
        currentBlock = { headerLines: [], bulletLines: [] };
      }
      currentBlock.bulletLines.push(line.replace(/^[-*•■+o\s]+/, '').trim());
    } else {
      if (currentBlock && currentBlock.bulletLines.length > 0) {
        if (!isNewHeaderLine(line)) {
          const lastIdx = currentBlock.bulletLines.length - 1;
          const lastBullet = currentBlock.bulletLines[lastIdx];
          const endsWithTerminal = /[.;!?]$/.test(lastBullet);
          if (!endsWithTerminal) {
            currentBlock.bulletLines[lastIdx] = lastBullet + ' ' + line;
          } else {
            currentBlock.bulletLines.push(line);
          }
          continue;
        }
      }

      if (currentBlock && currentBlock.bulletLines.length > 0) {
        blocks.push(currentBlock);
        currentBlock = { headerLines: [line], bulletLines: [] };
      } else {
        if (!currentBlock) {
          currentBlock = { headerLines: [], bulletLines: [] };
        }
        currentBlock.headerLines.push(line);
      }
    }
  }
  if (currentBlock) {
    blocks.push(currentBlock);
  }

  const entries: any[] = [];
  const locationDictionary = new Set(['india', 'usa', 'us', 'uk', 'germany', 'canada', 'remote', 'delhi', 'bangalore', 'bengaluru', 'mumbai', 'pune', 'hyderabad', 'chennai', 'noida', 'gurgaon', 'san francisco', 'sf', 'new york', 'ny', 'london', 'seattle', 'boston', 'austin', 'ca', 'tx', 'wa', 'ma']);

  for (const block of blocks) {
    if (block.headerLines.length === 0 && block.bulletLines.length === 0) continue;
    
    let company: string | null = null;
    let role: string | null = null;
    let location: string | null = null;
    let startDate = '2022';
    let endDate = 'Present';

    const remainingHeaders: string[] = [];

    for (const h of block.headerLines) {
      const dateRangeMatch = h.match(DATE_RANGE_REGEX) || h.match(YEAR_RANGE_REGEX);
      if (dateRangeMatch) {
        const dates = dateRangeMatch[0].split(/[-–—to]+/i).map(d => d.trim());
        if (dates.length > 0) startDate = dates[0];
        if (dates.length > 1) endDate = dates[1];
        
        const rest = h.replace(dateRangeMatch[0], '').trim().replace(/^[-–—,|•\s]+|[-–—,|•\s]+$/g, '');
        if (rest) {
          remainingHeaders.push(rest);
        }
      } else {
        remainingHeaders.push(h);
      }
    }

    const finalHeaders: string[] = [];
    for (const h of remainingHeaders) {
      const lower = h.toLowerCase();
      let isLoc = false;
      for (const loc of locationDictionary) {
        if (new RegExp(`\\b${loc}\\b`, 'i').test(lower)) {
          isLoc = true;
          break;
        }
      }
      if (isLoc && !h.includes('engineer') && !h.includes('developer') && !h.includes('manager')) {
        location = h;
      } else {
        finalHeaders.push(h);
      }
    }

    for (const h of finalHeaders) {
      const isCompanyPattern = /\b(inc|corp|ltd|llc|gmbh|solutions|technologies|systems|labs|group|software|company|consulting|agency|abc|google|microsoft|amazon|meta|apple|netflix)\b/i.test(h);
      const isRolePattern = /engineer|developer|analyst|manager|consultant|designer|lead|architect|intern|specialist|programmer|administrator|officer/i.test(h);

      if (isRolePattern && !role) {
        role = h;
      } else if (isCompanyPattern && !company) {
        company = h;
      } else {
        if (!role) role = h;
        else if (!company) company = h;
      }
    }

    entries.push({
      company,
      role,
      location,
      startDate,
      endDate,
      achievements: block.bulletLines
    });
  }

  return entries;
}

function parseProjectsHeuristics(text: string): any[] {
  if (!text) return [];
  
  const sectionTitlePattern = /^\s*(?:(?:academic|personal|key|technical|selected|software|recent|open\s*source)\s+)*projects\b\s*$/i;
  const lines = text.split('\n')
    .map(l => stripHtmlTags(l).trim())
    .filter(l => l.length > 0 && !sectionTitlePattern.test(l));
    
  const blocks: Array<{ headerLines: string[], bulletLines: string[] }> = [];
  let currentBlock: { headerLines: string[], bulletLines: string[] } | null = null;
  
  for (const line of lines) {
    const isBullet = line.startsWith('-') || line.startsWith('*') || line.startsWith('•') || line.startsWith('o ') || line.startsWith('■') || line.startsWith('+');
    
    if (isBullet) {
      if (!currentBlock) {
        currentBlock = { headerLines: ['Project'], bulletLines: [] };
      }
      currentBlock.bulletLines.push(line.replace(/^[-*•■+o\s]+/, '').trim());
    } else {
      const isNewHeader = isNewProjectHeaderLine(line);
      
      if (isNewHeader) {
        if (currentBlock) {
          blocks.push(currentBlock);
        }
        currentBlock = { headerLines: [line], bulletLines: [] };
      } else {
        if (!currentBlock) {
          currentBlock = { headerLines: [line], bulletLines: [] };
        } else {
          if (currentBlock.bulletLines.length > 0) {
            const lastIdx = currentBlock.bulletLines.length - 1;
            const lastBullet = currentBlock.bulletLines[lastIdx];
            const endsWithTerminal = /[.;!?]$/.test(lastBullet);
            if (!endsWithTerminal) {
              currentBlock.bulletLines[lastIdx] = lastBullet + ' ' + line;
            } else {
              currentBlock.bulletLines.push(line);
            }
          } else {
            currentBlock.bulletLines.push(line);
          }
        }
      }
    }
  }
  if (currentBlock) {
    blocks.push(currentBlock);
  }

  const entries: any[] = [];
  for (const block of blocks) {
    if (block.headerLines.length === 0 && block.bulletLines.length === 0) continue;
    
    let title = 'Project';
    let date: string | null = null;
    let technologies: string[] = [];
    const remainingHeaders: string[] = [];

    for (const h of block.headerLines) {
      const techMatch = h.match(/(?:technologies|tech|stack|tools):\s*([\w\s,+-.]+)/i);
      if (techMatch) {
        const techs = techMatch[1].split(',').map(t => t.trim()).filter(Boolean);
        technologies.push(...techs);
        continue;
      }

      const dateRegex = /\b(19|20)\d{2}\b/;
      const dateMatch = h.match(dateRegex);
      if (dateMatch && h.length < 15) {
        date = h;
        continue;
      }
      
      remainingHeaders.push(h);
    }

    if (remainingHeaders.length > 0) {
      title = remainingHeaders[0];
    }

    const { cleanedTitle, extractedTech } = parseInlineTechTags(title);
    const techStack = Array.from(new Set([...technologies, ...extractedTech]));

    entries.push({
      name: cleanedTitle,
      title: cleanedTitle,
      description: block.bulletLines.join(' '),
      bullets: block.bulletLines.length > 0 ? block.bulletLines : [title],
      tags: techStack,
      tech_stack: techStack,
      date: date,
      githubUrl: null,
      liveUrl: null,
      category: 'Project',
      outcome: null
    });
  }

  return entries;
}

function parseCertificationsHeuristics(text: string): string[] {
  if (!text) return [];
  const lines = text.split('\n').map(l => stripHtmlTags(l).trim());
  const joined = cleanAndJoinListLines(lines);
  return joined
    .map(l => l.replace(/^[-*•■+o\s]+/, '').trim())
    .filter(l => l.length > 5 && !isSectionHeading(l));
}

function parseAchievementsHeuristics(text: string): string[] {
  if (!text) return [];
  const lines = text.split('\n').map(l => stripHtmlTags(l).trim());
  const joined = cleanAndJoinListLines(lines);
  return joined
    .map(l => l.replace(/^[-*•■+o\s]+/, '').trim())
    .filter(l => l.length > 5 && !isSectionHeading(l));
}
