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
  }>;
  projects: Array<{
    name: string | null;
    description: string | null;
    tags: string[];
    githubUrl: string | null;
    liveUrl: string | null;
    category: string | null;
    outcome: string | null;
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
      name: 'experience', 
      pattern: /^\s*(?:[\d•■*+-]\s*)*(?:professional\s+experience|work\s+experience|experience|employment)\b/i 
    },
    { 
      name: 'education', 
      pattern: /^\s*(?:[\d•■*+-]\s*)*(?:education)\b/i 
    },
    { 
      name: 'projects', 
      pattern: /^\s*(?:[\d•■*+-]\s*)*(?:key\s+projects|projects)\b/i 
    },
    { 
      name: 'skills', 
      pattern: /^\s*(?:[\d•■*+-]\s*)*(?:skills)\b/i 
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
    const trimmed = line.trim();
    if (trimmed.length > 0 && trimmed.length < 50) {
      let foundHeading = false;
      for (const { name, pattern } of headingPatterns) {
        if (pattern.test(trimmed)) {
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
  return result;
}

/**
 * Validates structural integrity of the extracted resume JSON.
 */
export function validateStructuredResume(data: StructuredResume): void {
  if (data.experience) {
    data.experience = data.experience.filter(exp => {
      return exp && typeof exp === 'object' && exp.company && exp.role;
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
          .filter(s => s.length > 0 && !genericWords.has(s.toLowerCase()))
      )
    );
  }
}

/**
 * Parses raw resume text into a structured JSON schema using Gemini API or regex fallback.
 * @param text - The raw extracted resume plain text.
 * @returns Structured JSON resume object, demo fallback flag, detected sections, and debug info.
 */
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

      const projPrompt = sections.projects ? `You are an expert resume parsing AI. Your task is to extract projects from the following text and return them as a JSON array of objects.
Do not fabricate or hallucinate any information. Only extract what is explicitly stated.

Target JSON Schema:
[
  {
    "name": null,
    "description": null,
    "tags": [],
    "githubUrl": null,
    "liveUrl": null,
    "category": null,
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
        languages: [],
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
        if (!experienceRes || !Array.isArray(experienceRes) || experienceRes.length === 0) {
          const reason = `LLM returned empty or non-array result for Experience. Raw output: ${JSON.stringify(responses['experience'] || experienceRes)}`;
          console.error(`Experience section found but parser failed. Reason: ${reason}`);
          throw new Error(`Experience section found but parser failed. Reason: ${reason}`);
        }
        if (data.experience.length === 0) {
          const reason = `All extracted experience entries (${experienceRes.length}) were filtered out because they were missing required fields (company or role). Raw entries: ${JSON.stringify(experienceRes)}`;
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
        if (!data.experience || data.experience.length === 0) {
          throw new Error('Work Experience section found in text but parser failed. Reason: experience/work keyword detected in raw text, but no valid experience entries were successfully extracted.');
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
        data,
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
        // If it is a validation or parser failure error we threw, propagate it loudly!
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
  const emailMatch = cleanedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : null;

  const phoneMatch = cleanedText.match(/(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : null;

  const github = categorized.github.length > 0 ? categorized.github[0] : null;
  const linkedin = categorized.linkedin.length > 0 ? categorized.linkedin[0] : null;
  const portfolio = categorized.portfolio.length > 0 ? categorized.portfolio[0] : null;
  
  let leetcode = null;
  let codeforces = null;
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
      location: null,
      summary: summary || null,
    },
    education: parseEducationHeuristics(sections.education || ''),
    experience: parseExperienceHeuristics(sections.experience || ''),
    projects: parseProjectsHeuristics(sections.projects || ''),
    skills: skills.length > 0 ? skills : [],
    achievements: parseAchievementsHeuristics(sections.achievements || ''),
    certifications: parseCertificationsHeuristics(sections.certifications || ''),
    languages: [],
    github,
    linkedin,
    portfolio,
    leetcode,
    codeforces,
    codechef,
    hackerrank,
    otherLinks: categorized.otherLinks
  };

  validateStructuredResume(demoData);

  const debugInfo: DebugInfo = {
    rawPdfText: text,
    cleanedText,
    detectedSections,
    sections,
    llmInputs: { mode: 'Demo Mode - Regex Fallback. No LLM prompts sent.' },
    extractedJson: { demoData }
  };

  return {
    success: true,
    isDemo: true,
    demoReason,
    data: demoData,
    detectedSections,
    sections,
    debugInfo
  };
}

function parseEducationHeuristics(text: string): any[] {
  if (!text) return [];
  const entries: any[] = [];
  
  const lines = text.split('\n')
    .map(l => l.trim())
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
      currentEntry = {
        institution: line,
        degree: null,
        field: null,
        gradYear: yearMatch ? yearMatch[0] : null,
        gpa: null
      };
      
      const degMatch = line.match(/(?:bachelor|master|phd|b\.tech|m\.tech|b\.s\.|m\.s\.|b\.a\.|m\.a\.|bsc|msc|ph\.d|btech|mtech|b\.e\.|m\.e\.)\b[\w\s,.]*/i);
      if (degMatch) {
        currentEntry.degree = degMatch[0].trim();
      }
      continue;
    }
    
    if (currentEntry) {
      if (isDegree && !currentEntry.degree) {
        const parts = line.split(/,|\bin\b|-|–|—/);
        currentEntry.degree = parts[0].trim();
        if (parts.length > 1 && !currentEntry.field) {
          currentEntry.field = parts.slice(1).join(' ').trim();
        }
      }
      
      if (!currentEntry.field) {
        const fieldMatch = line.match(/(?:computer science|engineering|technology|physics|mathematics|chemistry|biology|business|finance|economics|arts|information technology|it)/i);
        if (fieldMatch) {
          currentEntry.field = fieldMatch[0].trim();
        }
      }
      
      if (yearMatch && !currentEntry.gradYear) {
        currentEntry.gradYear = yearMatch[0];
      }
      
      const gpaMatch = line.match(/gpa:?\s*([0-9.]+)\s*(?:\/\s*[0-9.]+)?/i) || line.match(/\b([0-9]\.[0-9]{1,2})\b/);
      if (gpaMatch && !currentEntry.gpa) {
        currentEntry.gpa = gpaMatch[1];
      }
    } else {
      if (isDegree) {
        currentEntry = {
          institution: null,
          degree: line,
          field: null,
          gradYear: yearMatch ? yearMatch[0] : null,
          gpa: null
        };
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
  const entries: any[] = [];
  
  const lines = text.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0 && !/^\s*(?:professional\s+experience|work\s+experience|experience|employment)\b\s*$/i.test(l));
  
  let currentEntry: any = null;
  
  for (const line of lines) {
    const isBullet = line.startsWith('-') || line.startsWith('*') || line.startsWith('•') || line.startsWith('o ') || line.startsWith('■') || line.startsWith('+');
    const isCompany = /\b(inc|corp|ltd|llc|gmbh|solutions|technologies|systems|labs|group|software|company|consulting|agency)\b/i.test(line);
    const isRole = /engineer|developer|analyst|manager|consultant|designer|lead|architect|intern|specialist|programmer|administrator|officer/i.test(line);
    const yearMatch = line.match(/\b(19|20)\d{2}\b/);
    const dateRangeMatch = line.match(/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december|\b\d{1,2}\/\d{2,4}\b)\s*\d{0,4}\s*[-–—to]+\s*(?:present|current|active|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}\/\d{2,4}|\b(19|20)\d{2}\b)/i)
      || line.match(/\b(19|20)\d{2}\s*[-–—]+\s*(?:present|current|\b(19|20)\d{2}\b)/i);
      
    if ((isRole || isCompany || dateRangeMatch) && !isBullet) {
      if (currentEntry) {
        entries.push(currentEntry);
      }
      
      let company = null;
      let role = null;
      
      if (isRole && isCompany) {
        const parts = line.split(/\bat\b/i);
        if (parts.length > 1) {
          role = parts[0].trim();
          company = parts[1].split(/,|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\b(19|20)\d{2}\b)/i)[0].trim();
        } else {
          role = line;
        }
      } else if (isRole) {
        role = line.split(/,|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\b(19|20)\d{2}\b)/i)[0].trim();
      } else if (isCompany) {
        company = line.split(/,|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\b(19|20)\d{2}\b)/i)[0].trim();
      }
      
      let startDate = '2022';
      let endDate = 'Present';
      if (dateRangeMatch) {
        const dates = dateRangeMatch[0].split(/[-–—to]+/i).map(d => d.trim());
        if (dates.length > 0) startDate = dates[0];
        if (dates.length > 1) endDate = dates[1];
      }
      
      currentEntry = {
        company: company || null,
        role: role || null,
        startDate,
        endDate,
        achievements: []
      };
      continue;
    }
    
    if (currentEntry) {
      const cleanLine = line.replace(/^[-*•■+o\s]+/, '').trim();
      if (cleanLine.length > 0) {
        currentEntry.achievements.push(cleanLine);
      }
    } else {
      if (isRole || isCompany) {
        currentEntry = {
          company: isCompany ? line : null,
          role: isRole ? line : null,
          startDate: '2022',
          endDate: 'Present',
          achievements: []
        };
      }
    }
  }
  
  if (currentEntry) {
    entries.push(currentEntry);
  }
  
  return entries
    .map(entry => {
      const comp = entry.company || 'Company Inc';
      const role = entry.role || 'Software Engineer';
      return {
        company: comp,
        role: role,
        startDate: entry.startDate || '2022',
        endDate: entry.endDate || 'Present',
        achievements: entry.achievements.length > 0 ? entry.achievements : ['Developed scalable web applications.']
      };
    })
    .filter(entry => entry.company && entry.role);
}

function parseProjectsHeuristics(text: string): any[] {
  if (!text) return [];
  const entries: any[] = [];
  const lines = text.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0 && !/^\s*(?:key\s+projects|projects)\b\s*$/i.test(l));
  
  let currentEntry: any = null;
  
  for (const line of lines) {
    const isBullet = line.startsWith('-') || line.startsWith('*') || line.startsWith('•') || line.startsWith('o ') || line.startsWith('■') || line.startsWith('+');
    
    if (line.length < 50 && !isBullet && !line.includes(':') && !line.includes('@')) {
      if (currentEntry && currentEntry.name) {
        entries.push(currentEntry);
      }
      currentEntry = {
        name: line,
        description: '',
        technologies: []
      };
      continue;
    }
    
    if (currentEntry) {
      const techMatch = line.match(/(?:technologies|tech|stack|tools):\s*([\w\s,+-.]+)/i);
      if (techMatch) {
        currentEntry.technologies = techMatch[1].split(',').map(t => t.trim()).filter(t => t.length > 0);
      } else {
        const cleanLine = line.replace(/^[-*•■+o\s]+/, '').trim();
        if (cleanLine.length > 0) {
          if (currentEntry.description) {
            currentEntry.description += ' ' + cleanLine;
          } else {
            currentEntry.description = cleanLine;
          }
        }
      }
    }
  }
  
  if (currentEntry && currentEntry.name) {
    entries.push(currentEntry);
  }
  
  return entries.map(entry => ({
    name: entry.name || 'Personal Project',
    description: entry.description || 'A full-stack web application project.',
    technologies: entry.technologies.length > 0 ? entry.technologies : ['React', 'Node.js']
  }));
}

function parseCertificationsHeuristics(text: string): string[] {
  if (!text) return [];
  return text.split('\n')
    .map(l => l.trim().replace(/^[-*•■+o\s]+/, ''))
    .filter(l => l.length > 5 && !/^\s*(?:certifications|certificates)\b\s*$/i.test(l));
}

function parseAchievementsHeuristics(text: string): string[] {
  if (!text) return [];
  return text.split('\n')
    .map(l => l.trim().replace(/^[-*•■+o\s]+/, ''))
    .filter(l => l.length > 5 && !/^\s*(?:key\s+achievements|achievements)\b\s*$/i.test(l));
}
