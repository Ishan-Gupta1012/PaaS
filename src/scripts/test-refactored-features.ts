import { extractStructuredData } from '../lib/resume/extractor';

async function testPipeline() {
  console.log('==================================================');
  console.log('TESTING FALLBACK REFINEMENTS & REFACTORED FEATURES');
  console.log('==================================================\n');

  // Test Case: Visual delimiters, HTML tags, wrapped sentences, truncated dates, raw headers, and languages.
  const sampleResumeText = `
John Doe
+91 98765 43210 | Delhi, India | email@domain.com | github.com/alexsharma-dev | leetcode.com/u/alexsharma-dev

<tr><td>WORK EXPERIENCE</td></tr>
Senior Developer
Company ABC
Jun 2025 - Aug 2025
- Led team of 5 developers to build high-performance services.
- Managed database migrations.
- Collaborated with product managers.
- Maintained code quality.

Software Engineer [NodeJS, MongoDB]
2022 - 2023
- Developed backend microservices using Express.
- Optimized queries to reduce latency.

<tr><td>KEY PROJECTS</td></tr>
<tr><td>E-Commerce Platform (React, NestJS)</td></tr>
<tr><td>2024</td></tr>
<tr><td>- Built a secure storefront with stripe integration.</td></tr>
<tr><td>- Designed responsive checkout flows.</td></tr>

CERTIFICATIONS & ACHIEVEMENTS
- AWS Certified Solutions Architect
- Winner of Smart India Hackathon 2024
- Solved 400+ problems across LeetCode &
  Codeforces on Graph Theory and Dynamic Programming.
- Completed Coursera Specialization in Machine Learning
- Top 10% Rank in JEE Advanced

LANGUAGES
- C++, Java, JavaScript, HTML, CSS, Rust, PHP
- English, Hindi
`;

  console.log('Extracting structured data from sample resume...');
  // Force Demo Mode by temporarily clearing API key if present, so we test fallback logic
  const originalKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  
  const result = await extractStructuredData(sampleResumeText);
  
  // Restore key
  process.env.GEMINI_API_KEY = originalKey;

  if (!result.success) {
    console.error('FAIL: Extraction failed.');
    process.exit(1);
  }

  const { data } = result;

  console.log('Extracted Data:', JSON.stringify(data, null, 2));

  let passed = true;

  // 1. Verify Header and Contact Extraction
  if (data.personal_information?.phone === '+91 98765 43210') {
    console.log('✓ PASS: Phone number successfully extracted.');
  } else {
    console.error('✗ FAIL: Phone number not extracted. Got:', data.personal_information?.phone);
    passed = false;
  }

  if (data.personal_information?.location === 'Delhi, India') {
    console.log('✓ PASS: Location successfully extracted.');
  } else {
    console.error('✗ FAIL: Location not extracted. Got:', data.personal_information?.location);
    passed = false;
  }

  // 2. Verify Social URLs (with hyphens)
  if (data.social_links?.github === 'https://github.com/alexsharma-dev') {
    console.log('✓ PASS: GitHub profile URL successfully matched with hyphen intact.');
  } else {
    console.error('✗ FAIL: GitHub URL hyphen split. Got:', data.social_links?.github);
    passed = false;
  }

  // 3. Verify Combined Section Splitting & Classification
  const achievements = data.achievements || [];
  const certifications = data.certifications || [];

  // Check that the header itself is NOT in either array
  if (certifications.includes('CERTIFICATIONS & ACHIEVEMENTS') || achievements.includes('CERTIFICATIONS & ACHIEVEMENTS')) {
    console.error('✗ FAIL: Section header string leaked into the array elements.');
    passed = false;
  } else {
    console.log('✓ PASS: Section header string sanitized and stripped.');
  }

  if (certifications.includes('AWS Certified Solutions Architect') && certifications.includes('Completed Coursera Specialization in Machine Learning')) {
    console.log('✓ PASS: Certifications correctly routed.');
  } else {
    console.error('✗ FAIL: Certifications missing. Got:', certifications);
    passed = false;
  }

  // Sentence rejoining check
  const joinedAchievement = achievements.find(a => a.includes('Solved 400+ problems across LeetCode & Codeforces'));
  if (joinedAchievement) {
    console.log('✓ PASS: Fragmented multi-line achievement bullet point successfully joined.');
  } else {
    console.error('✗ FAIL: Achievement sentence fragmentation. Got achievements:', achievements);
    passed = false;
  }

  // 4. Verify Work Experience Date Ranges and Bullet Retention
  const jobs = data.work_experience || [];
  const ABCJob = jobs.find(j => j.company === 'Company ABC');
  
  if (ABCJob) {
    if (ABCJob.date_range === 'Jun 2025 - Aug 2025') {
      console.log('✓ PASS: Date range successfully extracted without year truncation.');
    } else {
      console.error('✗ FAIL: Date range truncated. Got:', ABCJob.date_range);
      passed = false;
    }

    if (ABCJob.bullets && ABCJob.bullets.length === 4) {
      console.log('✓ PASS: All 4 work experience bullet points successfully retained.');
    } else {
      console.error('✗ FAIL: Truncated experience bullets. Got bullets count:', ABCJob.bullets?.length, 'bullets:', ABCJob.bullets);
      passed = false;
    }
  } else {
    console.error('✗ FAIL: Company ABC job block not parsed.');
    passed = false;
  }

  // 5. Verify HTML Stripping and Project Container Extraction
  const projs = data.projects || [];
  const ecomProj = projs.find(p => p.title === 'E-Commerce Platform');
  if (ecomProj) {
    console.log('✓ PASS: Project container successfully extracted from HTML table rows.');
    if (JSON.stringify(ecomProj.tech_stack) === JSON.stringify(['React', 'NestJS'])) {
      console.log('✓ PASS: Project tech stack parsed successfully from inline brackets.');
    } else {
      console.error('✗ FAIL: Project tech stack parsing failed. Got:', ecomProj.tech_stack);
      passed = false;
    }
  } else {
    console.error('✗ FAIL: Project container empty or HTML table row block failed parsing.');
    passed = false;
  }

  // 6. Verify Languages Parsing
  const langs = data.languages || [];
  console.log('Parsed Languages:', langs);
  const expectedLangs = ['C++', 'Java', 'JavaScript', 'HTML', 'CSS', 'Rust', 'PHP', 'English', 'Hindi'];
  const missingLangs = expectedLangs.filter(l => !langs.includes(l));
  
  if (missingLangs.length === 0) {
    console.log('✓ PASS: All expected languages successfully extracted.');
  } else {
    console.error('✗ FAIL: Missing expected languages:', missingLangs);
    passed = false;
  }

  console.log('\n==================================================');
  if (passed) {
    console.log('ALL FALLBACK REFINEMENT TESTS PASSED!');
    process.exit(0);
  } else {
    console.error('SOME FALLBACK REFINEMENT TESTS FAILED.');
    process.exit(1);
  }
}

testPipeline().catch(err => {
  console.error(err);
  process.exit(1);
});
