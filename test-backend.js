const { detectSections } = require('./src/lib/resume/pipeline/5-sections');
const { extractStructuredInfo } = require('./src/lib/resume/pipeline/6-structured');
const { normalizeData } = require('./src/lib/resume/pipeline/7-normalizer');

const blocks = [
  { text: 'Ishan Gupta', fontSize: 16, isBold: true, page: 1, annotations: [] },
  { text: 'Experience', fontSize: 14, isBold: true, page: 1, annotations: [] },
  { text: 'Google', fontSize: 12, isBold: true, page: 1, annotations: [] },
  { text: 'Software Engineer', fontSize: 12, isBold: false, page: 1, annotations: [] },
  { text: 'Jan 2020 - Present', fontSize: 12, isBold: false, page: 1, annotations: [] },
  { text: '• Built things', fontSize: 12, isBold: false, page: 1, annotations: [] }
];

const sections = detectSections(blocks);
console.log('Detected Sections:', sections.map(s => s.title));

const structured = extractStructuredInfo(sections);
console.log('Structured:', JSON.stringify(structured.experience, null, 2));

const normalized = normalizeData(structured);
console.log('Normalized:', JSON.stringify(normalized.experience, null, 2));
