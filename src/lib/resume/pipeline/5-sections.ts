import { Section, TextBlock } from './types';

// All known section header aliases → standard category name
const SECTION_ALIASES: Array<{ pattern: RegExp; category: string }> = [
  { pattern: /^(internship\s*[&\/]?\s*experience|work\s*experience|professional\s*experience|employment\s*history|career\s*history|experience|internship[s]?|industry\s*experience)$/i, category: 'Experience' },
  { pattern: /^(education|academics|academic\s*background|qualifications|educational\s*qualifications?)$/i, category: 'Education' },
  { pattern: /^(projects?|academic\s*projects?|personal\s*projects?|professional\s*projects?|selected\s*projects?|major\s*projects?|key\s*projects?|notable\s*projects?)$/i, category: 'Projects' },
  { pattern: /^(achievements?|awards?|honors?|accomplishments?|recognition|competitions?|hackathons?)$/i, category: 'Achievements' },
  { pattern: /^(technical\s*skills?|skills?|technologies|tech\s*stack|programming\s*languages?|frameworks?|competencies|expertise|tools?\s*&\s*platforms?|technical\s*expertise|languages?\s*&\s*technologies)$/i, category: 'Skills' },
  { pattern: /^(certifications?|licenses?|courses?|certificates?|training)$/i, category: 'Certifications' },
  { pattern: /^(publications?|papers?|articles?|research\s*papers?)$/i, category: 'Publications' },
  { pattern: /^(research|research\s*experience)$/i, category: 'Research' },
  { pattern: /^(volunteer\s*experience|volunteering|community\s*service|social\s*work)$/i, category: 'Volunteering' },
  { pattern: /^(leadership|positions?\s*of\s*responsibility|extracurricular\s*activities?|extracurriculars?|activities?|clubs?)$/i, category: 'Leadership' },
];

function matchSectionHeader(line: string): string | null {
  const trimmed = line.trim();
  // Must be short enough to be a heading
  if (trimmed.length === 0 || trimmed.length > 60) return null;
  // Must not end in sentence punctuation
  if (/[.!?]$/.test(trimmed)) return null;

  for (const { pattern, category } of SECTION_ALIASES) {
    if (pattern.test(trimmed)) return category;
  }
  return null;
}

/**
 * Text-based section detector.
 * Works on the raw text string directly (line by line) instead of relying on PDF block metadata.
 * This is more reliable when layout analysis merges blocks incorrectly.
 */
export function detectSectionsFromText(rawText: string): Section[] {
  const lines = rawText.split('\n');
  const sections: Section[] = [];

  let currentCategory = 'Personal';
  let currentLines: string[] = [];

  const flushSection = () => {
    if (currentLines.length > 0 || sections.length === 0) {
      const block: TextBlock = {
        text: currentLines.join('\n'),
        x: 0, y: 0, width: 0, height: 0,
        fontSize: 12, isBold: false, page: 1,
        annotations: []
      };
      sections.push({ title: currentCategory, blocks: [block] });
    }
    currentLines = [];
  };

  for (const line of lines) {
    const matched = matchSectionHeader(line);
    if (matched) {
      flushSection();
      currentCategory = matched;
    } else {
      // Skip the line if it's just a URL-only line that belongs in personal header
      currentLines.push(line);
    }
  }
  flushSection();

  return sections;
}

// ──────────────────────────────────────────────────────────────────────────
// Keep block-based detect for backward compat (used by index.ts)
// ──────────────────────────────────────────────────────────────────────────
export function detectSections(blocks: TextBlock[]): Section[] {
  // Build raw text from blocks and use the text-based detector
  const rawText = blocks.map(b => b.text).join('\n');
  const textSections = detectSectionsFromText(rawText);

  // Copy annotation data from original blocks into the matching section's blocks
  // (so hyperlink extraction still works)
  const annotatedBlocks = blocks.filter(b => b.annotations.length > 0);

  for (const section of textSections) {
    // Find which original blocks belong to this section by text overlap
    const sectionText = section.blocks.map(b => b.text).join('\n');
    const matchingAnnotated = annotatedBlocks.filter(b =>
      sectionText.includes(b.text.substring(0, 20))
    );
    if (matchingAnnotated.length > 0) {
      section.blocks.push(...matchingAnnotated);
    }
  }

  return textSections;
}
