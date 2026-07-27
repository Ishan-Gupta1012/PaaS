import fs from 'fs';
import path from 'path';
import { parseResumeFile } from '../lib/resume/parser';
import { extractStructuredData } from '../lib/resume/extractor';

interface TestCase {
  filename: string;
  expectedSuccess: boolean;
}

async function runTests() {
  console.log('==================================================');
  console.log('RUNNING AUTOMATED RESUME PARSER COMPATIBILITY TESTS');
  console.log('==================================================\n');

  // Directory containing sample PDFs in pdf-parse package
  const sampleDir = path.join(process.cwd(), 'node_modules', 'pdf-parse', 'test', 'data');
  
  if (!fs.existsSync(sampleDir)) {
    console.error(`Error: Sample directory not found at ${sampleDir}. Make sure node_modules/pdf-parse/test/data exists.`);
    process.exit(1);
  }

  const testCases: TestCase[] = [
    { filename: '01-valid.pdf', expectedSuccess: true },
    { filename: '02-valid.pdf', expectedSuccess: true },
    { filename: '03-invalid.pdf', expectedSuccess: false }, // Corrupted PDF
    { filename: '04-valid.pdf', expectedSuccess: true },
    { filename: '05-versions-space.pdf', expectedSuccess: true },
  ];

  let passedTests = 0;
  let failedTests = 0;

  for (const tc of testCases) {
    const filePath = path.join(sampleDir, tc.filename);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`[SKIP] File not found: ${tc.filename}`);
      continue;
    }

    const buffer = fs.readFileSync(filePath);
    console.log(`Testing file: ${tc.filename} (${(buffer.length / 1024).toFixed(1)} KB)`);

    try {
      const text = await parseResumeFile(buffer, tc.filename);
      
      if (tc.expectedSuccess) {
        if (text && text.trim().length > 0) {
          console.log(`  [PASS] Parsed successfully. Extracted ${text.trim().length} characters.`);
          
          // Verify that AI/Fallback structuring runs without throwing syntax/regex errors
          try {
            const extractResult = await extractStructuredData(text);
            if (extractResult && extractResult.success) {
              console.log(`  [PASS] Extractor structured data successfully (Demo Mode: ${extractResult.isDemo}). Skills: ${extractResult.data.skills?.join(', ') || 'none'}`);
              
              // Test enrichment and merging pipeline
              try {
                const { enrichPortfolioData } = require('../lib/resume/enricher');
                const { mergeResumeAndExternalData } = require('../lib/resume/merger');
                
                const external = await enrichPortfolioData(text);
                const merged = mergeResumeAndExternalData(extractResult.data, external);
                
                console.log(`  [PASS] Enrichment and Merging successful.`);
                console.log(`         GitHub: ${external.github.length}, LinkedIn: ${external.linkedin.length}, Coding: ${external.coding.length}, Portfolio: ${external.portfolio.length}`);
                console.log(`         Merged Skills Count: ${merged.skills?.length || 0}, Merged Projects Count: ${merged.projects?.length || 0}`);
                passedTests++;
              } catch (enrichErr: any) {
                console.error(`  [FAIL] Enrichment/Merging crashed: ${enrichErr.message || enrichErr}`);
                failedTests++;
              }
            } else {
              console.error(`  [FAIL] Extractor returned success=false`);
              failedTests++;
            }
          } catch (extErr: any) {
            console.error(`  [FAIL] Extractor crashed with exception: ${extErr.message || extErr}`);
            failedTests++;
          }
          console.log();
        } else {
          console.error(`  [FAIL] Parsed successfully but returned empty text.\n`);
          failedTests++;
        }
      } else {
        console.error(`  [FAIL] Expected failure, but parser succeeded and returned ${text.length} chars.\n`);
        failedTests++;
      }
    } catch (err: any) {
      if (!tc.expectedSuccess) {
        console.log(`  [PASS] Failed as expected. Error: "${err.message}"\n`);
        passedTests++;
      } else {
        console.error(`  [FAIL] Expected success, but parsing threw an error:`);
        console.error(`         ${err.stack || err.message || err}\n`);
        failedTests++;
      }
    }
  }

  console.log('==================================================');
  console.log(`TEST RUN SUMMARY:`);
  console.log(`  Passed: ${passedTests}`);
  console.log(`  Failed: ${failedTests}`);
  console.log('==================================================');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    console.log('All parser compatibility tests completed successfully!');
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Unhandled test runner error:', err);
  process.exit(1);
});
