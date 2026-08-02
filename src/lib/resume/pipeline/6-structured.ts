import { Section, ResumeData, TextBlock } from './types';

// ─── Regex constants ──────────────────────────────────────────────────────────
const DATE_REGEX = /(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[.,-\s]*\d{2,4}|\d{4}/ig;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(?:\+?\d{1,3}[\s.\-]?)?\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}/;
const URL_REGEX   = /https?:\/\/[^\s,;)]+/g;

// ─── Bullet helpers ───────────────────────────────────────────────────────────
function isBulletLine(line: string): boolean {
  return /^[\u2022\-\*\u25CF\u25E6\u2013\u25BA\u2714>●•]\s*/.test(line.trim());
}

function cleanBullet(line: string): string {
  return line.trim().replace(/^[\u2022\-\*\u25CF\u25E6\u2013\u25BA\u2714>●•]\s*/, '').trim();
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
function extractDates(text: string): string[] {
  // Reset lastIndex since DATE_REGEX is global
  DATE_REGEX.lastIndex = 0;
  const matches = text.match(DATE_REGEX) || [];
  const hasPresent = /\bPresent\b|\bCurrent\b|\bNow\b/i.test(text);
  const result = matches.map(m => m.trim());
  if (hasPresent && result.length === 1) result.push('Present');
  return result;
}

// ─── Link helpers ─────────────────────────────────────────────────────────────
function getLinksFromBlock(block: TextBlock): { github?: string; live?: string; deployment?: string } {
  const result: { github?: string; live?: string; deployment?: string } = {};
  for (const anno of (block.annotations || [])) {
    const url = anno.url || '';
    if (!url) continue;
    if (url.includes('github.com')) result.github = url;
    else if (url.includes('vercel.app') || url.includes('netlify.app') || url.includes('heroku')) result.deployment = url;
    else if (url.startsWith('http')) result.live = url;
  }
  return result;
}

// ─── Tech keyword extraction from description ─────────────────────────────────
// Extracts known tech keywords embedded in prose text
const TECH_KEYWORDS = [
  // Languages
  'JavaScript','TypeScript','Python','Java','C++','C#','Ruby','Go','Rust','Swift','Kotlin','PHP','Dart','Scala','R','MATLAB',
  // Frontend
  'React','Next.js','Vue','Angular','Svelte','HTML5','CSS3','Tailwind CSS','GSAP','Three.js','React Native','Expo','NativeWind','jQuery',
  // Backend
  'Node.js','Express.js','Django','Flask','FastAPI','Spring','Rails','Laravel','Nest.js','Hono',
  // DB
  'MongoDB','PostgreSQL','MySQL','SQLite','Redis','Supabase','Firebase','DynamoDB','CockroachDB',
  // Cloud/DevOps
  'AWS','GCP','Azure','Docker','Kubernetes','Vercel','Netlify','Render','Heroku','GitHub Actions','CI/CD',
  // AI/ML
  'Gemini AI','Gemini API','OpenAI','GPT','TensorFlow','PyTorch','Hugging Face','LangChain','RAG',
  // Tools/APIs
  'REST API','REST APIs','GraphQL','WebSockets','Razorpay','TPStream','Stripe','Prisma','Drizzle','Mongoose',
  // Misc
  'MERN','MERN Stack','Monorepo','Microservices','OAuth','JWT','Supabase RLS','RLS',
];

function extractTechFromText(text: string): string[] {
  const found = new Set<string>();
  for (const kw of TECH_KEYWORDS) {
    // Case-insensitive whole-word match
    const re = new RegExp(`\\b${kw.replace('.', '\\.').replace('+', '\\+')}\\b`, 'i');
    if (re.test(text)) found.add(kw);
  }
  return [...found];
}

// ─── Main extractor ───────────────────────────────────────────────────────────
/**
 * @param sections     Text-based sections from detectSectionsFromText
 * @param annotatedBlocks  Original PDF blocks that have hyperlink annotations
 */
export function extractStructuredInfo(
  sections: Section[],
  annotatedBlocks: TextBlock[] = []
): Partial<ResumeData> {

  const data: Partial<ResumeData> = {
    personal: { name: '', email: '', phone: '', location: '' },
    experience: [],
    education: [],
    projects: [],
    achievements: [],
    certifications: [],
    leadership: [],
    publications: [],
    volunteer: [],
    skills: { languages: [], frontend: [], backend: [], frameworks: [], databases: [], cloud: [], devops: [], tools: [], others: [] },
    links: { other: [] },
    rawText: '',
    metadata: {}
  };

  // ── PASS 1: Global annotation extraction (hyperlinks from PDF) ───────────
  // Use annotatedBlocks directly — do NOT read section.blocks since those are
  // newly constructed text blocks without annotation data.
  for (const block of annotatedBlocks) {
    for (const anno of (block.annotations || [])) {
      const url = anno.url || '';
      const ul  = url.toLowerCase();
      if (!url) continue;

      if (ul.startsWith('mailto:')) {
        const email = url.replace(/^mailto:/i, '');
        if (!data.personal!.email) { data.personal!.email = email; data.links!.email = email; }
      } else if (ul.includes('github.com')       && !data.links!.github)       data.links!.github       = url;
      else if (ul.includes('linkedin.com')       && !data.links!.linkedin)      data.links!.linkedin      = url;
      else if (ul.includes('leetcode.com')       && !data.links!.leetcode)      data.links!.leetcode      = url;
      else if (ul.includes('codeforces.com')     && !data.links!.codeforces)    data.links!.codeforces    = url;
      else if (ul.includes('codechef.com')       && !data.links!.codechef)      data.links!.codechef      = url;
      else if (ul.includes('hackerrank.com')     && !data.links!.hackerrank)    data.links!.hackerrank    = url;
      else if (ul.includes('geeksforgeeks.org')  && !data.links!.geeksforgeeks) data.links!.geeksforgeeks = url;
      else if (ul.includes('medium.com')         && !data.links!.medium)        data.links!.medium        = url;
      else if (ul.includes('vercel.app') || ul.includes('ishangpt') || ul.includes('netlify') || ul.includes('github.io')) {
        if (!data.links!.portfolio) data.links!.portfolio = url;
      } else if (ul.includes('drive.google.com')) {
        if (!data.links!.portfolio) data.links!.portfolio = url;
      } else if (ul.startsWith('http') && !data.links!.other!.includes(url)) {
        data.links!.other!.push(url);
      }
    }
  }

  // ── PASS 2: Section-by-section text parsing ──────────────────────────────
  for (const section of sections) {
    // Each section has exactly ONE block created by detectSectionsFromText
    const fullText = section.blocks.map(b => b.text).join('\n');
    const allLines = fullText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // ── PERSONAL ──────────────────────────────────────────────────────────
    if (section.title === 'Personal') {
      // Email fallback from text
      if (!data.personal!.email) {
        const m = fullText.match(EMAIL_REGEX);
        if (m) { data.personal!.email = m[0]; data.links!.email = m[0]; }
      }

      // Phone
      const ph = fullText.match(PHONE_REGEX);
      if (ph) data.personal!.phone = ph[0].trim();

      // Portfolio/social URLs from visible text
      const textUrls = fullText.match(URL_REGEX) || [];
      for (const u of textUrls) {
        const ul = u.toLowerCase().replace(/\/+$/, '');
        if      (ul.includes('vercel') || ul.includes('netlify') || ul.includes('github.io')) { if (!data.links!.portfolio) data.links!.portfolio = u; }
        else if (ul.includes('github.com'))     { if (!data.links!.github)     data.links!.github     = u; }
        else if (ul.includes('linkedin.com'))   { if (!data.links!.linkedin)   data.links!.linkedin   = u; }
        else if (ul.includes('leetcode.com'))   { if (!data.links!.leetcode)   data.links!.leetcode   = u; }
        else if (ul.includes('codeforces.com')) { if (!data.links!.codeforces) data.links!.codeforces = u; }
      }

      // Name: strip URLs / emails / phones from lines, find first clean name-like string
      const stripMeta = (s: string) =>
        s.replace(URL_REGEX, '').replace(/mailto:[^\s]*/ig, '')
         .replace(EMAIL_REGEX, '').replace(PHONE_REGEX, '')
         .replace(/LinkedIn|Github|Leetcode|Codeforces|Codechef|HackerRank|GeeksforGeeks|Medium|Phone:|Email:|Portfolio:/ig, '')
         .replace(/[|\-–]/g, ' ').replace(/\s+/g, ' ').trim();

      for (const line of allLines) {
        const cleaned = stripMeta(line);
        if (cleaned.length > 1 && cleaned.length < 60 && /^[A-Za-z][A-Za-z\s.'"-]{1,50}$/.test(cleaned) && cleaned.split(/\s+/).length <= 6) {
          data.personal!.name = cleaned;
          break;
        }
      }
    }

    // ── EXPERIENCE ────────────────────────────────────────────────────────
    else if (section.title === 'Experience') {
      const JOB_HEADER_RE = /(?:Engineer|Developer|Analyst|Manager|Director|Lead|Consultant|Intern|Freelance|SDE|SWE|Designer|Architect)/i;
      const jobEntries: string[][] = [];
      let cur: string[] = [];

      for (const line of allLines) {
        DATE_REGEX.lastIndex = 0;
        const hasDate        = DATE_REGEX.test(line) || /\(\s*\w+\s+\d{4}/.test(line);
        const hasRoleKeyword = JOB_HEADER_RE.test(line);
        const isHeader       = !isBulletLine(line) && hasDate && hasRoleKeyword;
        if (isHeader && cur.length > 0) { jobEntries.push(cur); cur = [line]; }
        else cur.push(line);
      }
      if (cur.length > 0) jobEntries.push(cur);

      for (const entry of jobEntries) {
        const entryText  = entry.join('\n');
        if (entryText.trim().length < 10) continue;
        const nonBullets = entry.filter(l => !isBulletLine(l));
        const bullets    = entry.filter(isBulletLine).map(cleanBullet);
        const dates      = extractDates(entryText);

        const headerLine = nonBullets[0] || '';
        // Remove date portion from header to isolate title + company
        const noDate = headerLine.replace(/\(?\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4}\s*[–\-]\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\w*\s*\d{0,4}\s*\)?/ig, '')
                                 .replace(/\(\s*Present\s*\)/i, '').trim();
        const parts = noDate.split(/[\-–|]/).map(p => p.replace(/\(.*?\)/g, '').trim()).filter(p => p.length > 0);
        let jobTitle = parts[0] || 'Unknown Role';
        let company  = parts[1] || parts[0] || 'Unknown Company';

        // Employment type
        let employmentType = '';
        const typeMatch = noDate.match(/\((Freelance|Full.?time|Part.?time|Contract|Intern(?:ship)?)\)/i);
        if (typeMatch) employmentType = typeMatch[1];
        else if (/freelance/i.test(entryText))  employmentType = 'Freelance';
        else if (/intern/i.test(entryText))     employmentType = 'Internship';
        else                                     employmentType = 'Full-time';
        jobTitle = jobTitle.replace(/\((?:Freelance|Full.?time|Part.?time|Contract|Intern(?:ship)?)\)/i, '').trim();

        data.experience!.push({
          company: company.trim() || 'Unknown Company',
          jobTitle: jobTitle.trim() || 'Unknown Role',
          employmentType,
          location: '',
          startDate: dates[0] || '',
          endDate: dates[1] || (dates[0] ? 'Present' : ''),
          duration: '',
          currentJob: !dates[1] || /present|current/i.test(dates[1] || ''),
          description: '',  // Intentionally empty – we only show title/company/dates in UI
          bullets,
          technologies: extractTechFromText(entryText)
        });
      }
    }

    // ── EDUCATION ─────────────────────────────────────────────────────────
    else if (section.title === 'Education') {
      const chunks = fullText.trim().split(/\n{2,}/);
      const normalizedChunks = chunks.length > 1 ? chunks : [fullText];
      const degreeRE = /B\.?Tech|M\.?Tech|B\.?E\.?|B\.?Sc|M\.?Sc|MBA|Ph\.?D|CBSE|ICSE|Class\s+[XVI]+|Bachelor|Master|Post\s*Graduate/i;

      for (const chunk of normalizedChunks) {
        const lines = chunk.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (!lines.length) continue;
        const chunkFull = lines.join(' ');

        const cgpaMatch  = chunkFull.match(/(\d+\.?\d*)\s*(?:CGPA|GPA|CPI)/i);
        const pctMatch   = chunkFull.match(/(\d+\.?\d*)\s*%/);
        const dates      = extractDates(chunkFull);

        const instituteLine = lines.find(l => degreeRE.test(l)) || lines[0];
        const splitParts    = instituteLine.split(/[|,]/).map(p => p.trim()).filter(p => p.length > 0);
        let degree    = splitParts[0] || '';
        let institute = splitParts[1] || splitParts[0] || '';
        let branch    = '';

        if (degree.includes('-')) { const [d, b] = degree.split('-').map(s => s.trim()); degree = d; branch = b || ''; }
        if (DATE_REGEX.lastIndex = 0, DATE_REGEX.test(institute) || /^\d+/.test(institute)) { institute = splitParts[2] || institute; }
        institute = institute.replace(/\d+\.?\d*\s*(?:CGPA|GPA|CPI|%)/ig, '').replace(/\(.*?\)/g, '').trim();
        institute = institute.split(/\d{4}/)[0].trim() || institute;

        data.education!.push({
          institute: institute || 'Unknown Institute',
          degree: degree || '',
          branch, major: branch, minor: '',
          cgpa: cgpaMatch ? cgpaMatch[1] : '',
          percentage: pctMatch ? pctMatch[1] + '%' : '',
          location: '',
          startDate: dates[0] || '',
          endDate: dates[1] || '',
          currentStatus: /present|current/i.test(dates[1] || '') || !dates[1] ? 'Ongoing' : 'Completed',
          coursework: []
        });
      }
    }

    // ── PROJECTS ──────────────────────────────────────────────────────────
    else if (section.title === 'Projects') {
      // A project header line has ONE of:
      //   (a) "(Project Link)", "(Demo Video)", "(GitHub)" marker
      //   (b) "ProjectName: Tech1 · Tech2" — colon then tech with ·
      //   (c) "ProjectNameTech1 · Tech2 · Tech3" — tech inline with · (no colon)
      // We do NOT split on "non-bullet after bullet" because description lines can follow bullets.

      const isProjectHeader = (line: string): boolean => {
        if (isBulletLine(line)) return false;
        const hasMarker    = /\(project\s*link\)|\(demo\s*video\)|\(github\)|\(live\)/i.test(line);
        const hasColonTech = /:\s*[A-Za-z]/.test(line) && line.includes('·');
        const hasInlineTech = line.includes('·') && line.length < 120;
        return hasMarker || hasColonTech || hasInlineTech;
      };

      const projectEntries: string[][] = [];
      let curP: string[] = [];

      for (const line of allLines) {
        if (isProjectHeader(line)) {
          if (curP.length > 0) projectEntries.push(curP);
          curP = [line];
        } else {
          curP.push(line);
        }
      }
      if (curP.length > 0) projectEntries.push(curP);

      for (const entry of projectEntries) {
        const entryText  = entry.join('\n');
        if (entryText.trim().length < 10) continue;

        const lines    = entry;
        const bullets  = lines.filter(isBulletLine).map(cleanBullet);
        const nonBullets = lines.filter(l => !isBulletLine(l));
        const headerLine = nonBullets[0] || lines[0] || '';

        // Project name = everything before "(" or ":" or "·"
        let projectName = headerLine
          .replace(/\(.*?\)/g, '')   // strip (Project Link) etc.
          .split(/[:\u00B7]/)[0]     // take before colon or ·
          .trim();

        // Tech stack: from colon portion of header, then supplement from full description
        let techStack: string[] = [];
        const colonIdx = headerLine.indexOf(':');
        if (colonIdx !== -1) {
          const techStr = headerLine.substring(colonIdx + 1).trim();
          techStack = techStr.split(/[·•,\|]/).map(t => t.trim()).filter(t => t.length > 0 && t.length < 35);
        }
        // Also check for inline "·" separated tech (no colon), e.g. "Sweat-X(Demo Video)React Native · Node.js"
        if (techStack.length === 0 && headerLine.includes('·')) {
          // Split on · and the part after the project name
          const afterName = headerLine.replace(/\(.*?\)/g, '').replace(projectName, '').trim();
          if (afterName.includes('·')) {
            techStack = afterName.split(/[·•,\|]/).map(t => t.trim()).filter(t => t.length > 0 && t.length < 35);
          }
        }

        // Supplement tech stack with keywords extracted from bullets/description
        const techFromDesc = extractTechFromText(entryText);
        const combined = [...new Set([...techStack, ...techFromDesc])];
        techStack = combined;

        // Links from annotated blocks (look for project-specific GitHub links)
        let githubRepository: string | undefined;
        let liveUrl: string | undefined;
        let deploymentUrl: string | undefined;
        for (const b of annotatedBlocks) {
          const lnk = getLinksFromBlock(b);
          if (lnk.github && !githubRepository) githubRepository = lnk.github;
          if (lnk.live && !liveUrl) liveUrl = lnk.live;
          if (lnk.deployment && !deploymentUrl) deploymentUrl = lnk.deployment;
        }

        const dates = extractDates(entryText);

        data.projects!.push({
          projectName: projectName || 'Unknown Project',
          subtitle: '',
          techStack,
          description: bullets.join('\n'),  // Full bullet text as description
          bullets,
          githubRepository,
          liveUrl,
          deploymentUrl,
          demoLink: undefined, appStoreLink: undefined, playStoreLink: undefined,
          duration: dates.length > 0 ? `${dates[0]} – ${dates[1] || 'Present'}` : '',
          role: '',
          features: bullets,
          aiFeatures: bullets.filter(b => /AI|GPT|Gemini|ML|model|neural|intelligence/i.test(b)),
          performanceImprovements: bullets.filter(b => /LCP|performance|optim|reduc|faster|improv/i.test(b)),
          metrics: bullets.filter(b => /\d+[\+kKmM%]?\s+(?:users?|students?|teams?|downloads?|stars?)/i.test(b)),
          userNumbers: '', downloads: '', awards: [],
          technologies: techStack
        });
      }
    }

    // ── ACHIEVEMENTS ──────────────────────────────────────────────────────
    else if (section.title === 'Achievements') {
      const items = allLines
        .map(l => cleanBullet(l))
        .filter(l =>
          l.length > 5 &&
          !URL_REGEX.test(l) &&                       // skip bare URL lines
          !l.match(EMAIL_REGEX) &&                    // skip email lines
          !l.match(/^ACHIEVEMENTS$/i) &&              // skip the heading itself
          !l.match(/^Phone:|^Email:|^LinkedIn|^Github/i)  // skip header residue
        );
      // Remove duplicates (same text appearing twice)
      data.achievements = [...new Set(items)];
    }

    // ── CERTIFICATIONS ────────────────────────────────────────────────────
    else if (section.title === 'Certifications') {
      data.certifications = [...new Set(
        allLines.map(l => cleanBullet(l)).filter(l => l.length > 3 && !URL_REGEX.test(l))
      )];
    }

    // ── PUBLICATIONS ──────────────────────────────────────────────────────
    else if (section.title === 'Publications') {
      data.publications = allLines.map(l => cleanBullet(l)).filter(l => l.length > 3);
    }

    // ── VOLUNTEERING ─────────────────────────────────────────────────────
    else if (section.title === 'Volunteering') {
      const chunks2 = fullText.split(/\n{2,}/);
      for (const ch of chunks2) {
        const ls = ch.split('\n').filter(l => l.trim().length > 0);
        if (ls.length > 0) data.volunteer!.push({ organization: ls[0].trim(), role: ls[1]?.trim() || '', description: ls.slice(2).map(l => l.trim()) });
      }
    }

    // ── LEADERSHIP ────────────────────────────────────────────────────────
    else if (section.title === 'Leadership') {
      const chunks3 = fullText.split(/\n{2,}/);
      for (const ch of chunks3) {
        const ls = ch.split('\n').filter(l => l.trim().length > 0);
        if (ls.length > 0) data.leadership!.push({ organization: ls[0].trim(), role: ls[1]?.trim() || '', description: ls.slice(2).map(l => l.trim()) });
      }
    }

    // ── SKILLS ────────────────────────────────────────────────────────────
    else if (section.title === 'Skills') {
      const mapCat = (label: string): keyof NonNullable<typeof data.skills> => {
        const lo = label.toLowerCase();
        if (lo.match(/language|programming|\bc\+\+|java(?!script)|python|ruby|\bgo\b|rust|swift|kotlin/)) return 'languages';
        if (lo.match(/front|ui|css|html|react|vue|angular|native/)) return 'frontend';
        if (lo.match(/back|node|express|server|api|django|flask/)) return 'backend';
        if (lo.match(/framework|librar/)) return 'frameworks';
        if (lo.match(/database|sql|mongo|postgres|redis|supabase/)) return 'databases';
        if (lo.match(/cloud|aws|gcp|azure/)) return 'cloud';
        if (lo.match(/devops|ci\/cd|docker|kubernetes|deploy/)) return 'devops';
        if (lo.match(/tool|git|version|platform|performance|core cs|core web/)) return 'tools';
        return 'others';
      };

      let curCat: keyof NonNullable<typeof data.skills> = 'others';
      for (const line of allLines) {
        const cIdx = line.indexOf(':');
        if (cIdx > 0 && cIdx < 30) {
          const catLabel = line.substring(0, cIdx).trim();
          const itemsStr = line.substring(cIdx + 1).trim();
          curCat = mapCat(catLabel);
          if (itemsStr.length > 0) {
            const items = itemsStr.split(/[,·|]/).map(i => i.trim()).filter(i => i.length > 0 && i.length < 40);
            (data.skills![curCat] as string[]).push(...items);
          }
        } else {
          const items = cleanBullet(line).split(/[,·|]/).map(i => i.trim()).filter(i => i.length > 0 && i.length < 40);
          (data.skills![curCat] as string[]).push(...items);
        }
      }
      for (const key of Object.keys(data.skills!) as Array<keyof NonNullable<typeof data.skills>>) {
        (data.skills![key] as string[]) = [...new Set((data.skills![key] as string[]))];
      }
    }
  }

  return data;
}
