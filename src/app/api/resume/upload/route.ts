import { NextRequest, NextResponse } from 'next/server';
import { parseResumeFile } from '@/lib/resume/parser';
import { extractStructuredData } from '@/lib/resume/extractor';
import { enrichPortfolioData, EnrichedData, detectUrls } from '@/lib/resume/enricher';
import { mergeResumeAndExternalData } from '@/lib/resume/merger';

export async function POST(req: NextRequest) {
  const startTime = performance.now();
  console.log('[1/8] Resume uploaded');

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    // 1. File existence validation
    if (!file) {
      return NextResponse.json({ error: 'No resume file uploaded.' }, { status: 400 });
    }

    // 2. File size validation (limit to 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds the 5MB limit.' }, { status: 400 });
    }

    // 3. File type validation
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.pdf') && !fileName.endsWith('.docx')) {
      return NextResponse.json({ error: 'Unsupported file type. Only PDF and DOCX files are allowed.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Server-side text extraction
    let extractedText = '';
    const parseStart = performance.now();
    try {
      console.log('\n=============================================');
      console.log('--- STAGE 1: PDF Upload & Text Extraction ---');
      extractedText = await parseResumeFile(buffer, file.name);
      console.log('--- STAGE 2: Raw PDF Text (First 300 chars) ---');
      console.log(extractedText.substring(0, 300) + '...');
    } catch (parseError: any) {
      console.error('Error during file text parsing:', parseError);
      return NextResponse.json({ 
        error: `Parsing Error: Could not read document text. ${parseError.message || parseError}` 
      }, { status: 422 });
    }
    const parseEnd = performance.now();
    console.log('[2/8] PDF parsed successfully');
    console.log('[3/8] Raw text extracted');

    if (!extractedText.trim()) {
      return NextResponse.json({ error: 'The uploaded document appears to be empty or unscannable.' }, { status: 422 });
    }

    // Heuristical check for broken layout (words merged / lack of spaces)
    const spaceCount = (extractedText.match(/ /g) || []).length;
    const totalChars = extractedText.trim().length;
    if (totalChars > 150 && spaceCount < (totalChars * 0.04)) {
      return NextResponse.json({
        error: 'PDF parsing corrupt layout detected (insufficient spacing). The extracted text lacks proper word boundaries. Please verify the raw text in the Debug panel.',
        extractedText: extractedText,
        debugInfo: {
          rawPdfText: extractedText,
          cleanedText: extractedText,
          detectedSections: [],
          llmInputs: { error: 'Aborted: Corrupted layout detected.' },
          extractedJson: { error: 'LLM was not called due to corrupted layout.' }
        }
      }, { status: 422 });
    }

    // 5. LLM Structured data extraction & enrichment
    const geminiStart = performance.now();
    let extractionResult;
    try {
      console.log('--- STAGE 3 & 4: Section Detection & Text Cleaning ---');
      extractionResult = await extractStructuredData(extractedText);
      console.log('Detected Sections list:', extractionResult.detectedSections);
    } catch (extractionError: any) {
      console.error('Error during AI data extraction:', extractionError);
      return NextResponse.json({ 
        error: `AI Extraction Error: Failed to structure parsed resume text. ${extractionError.message || extractionError}` 
      }, { status: 500 });
    }
    const geminiEnd = performance.now();

    const enrichStart = performance.now();
    let externalData: EnrichedData = { github: [], linkedin: [], coding: [], portfolio: [], otherLinks: [] };
    let mergedData = extractionResult.data;

    try {
      // Find, validate, and scrape external links concurrently from the personal contact section only
      const contactText = extractionResult.sections?.personal || extractedText;
      externalData = await enrichPortfolioData(contactText);
      console.log('[7/8] External profile enrichment completed');
    } catch (enrichError) {
      console.error('Enrichment failed, proceeding with original resume data:', enrichError);
    }
    const enrichEnd = performance.now();

    const mergeStart = performance.now();
    try {
      console.log('--- STAGE 6: Merging Resume with External Profiles ---');
      // Merge scraped stats with original resume JSON
      mergedData = mergeResumeAndExternalData(extractionResult.data, externalData);
      console.log('--- STAGE 7: Final Merged Portfolio ---');
      console.log('Merged portfolio compiled successfully.');
    } catch (mergeError) {
      console.error('Merging failed, proceeding with original resume data:', mergeError);
    }
    const mergeEnd = performance.now();

    console.log('[8/8] JSON stored successfully');
    console.log('Request completed');

    const totalTime = performance.now() - startTime;
    const pdfDuration = parseEnd - parseStart;
    const geminiDuration = geminiEnd - geminiStart;
    const enrichDuration = enrichEnd - enrichStart;
    const mergeDuration = mergeEnd - mergeStart;

    console.log('\n=============================================');
    console.log('--- RESUME PROCESSING TIMING REPORT ---');
    console.log(`PDF Parsing ........ ${(pdfDuration / 1000).toFixed(2)}s (${pdfDuration.toFixed(0)}ms)`);
    console.log(`Gemini ............. ${(geminiDuration / 1000).toFixed(2)}s`);
    console.log(`Enrichments ........ ${(enrichDuration / 1000).toFixed(2)}s`);
    console.log(`Merge JSON ......... ${mergeDuration.toFixed(0)}ms`);
    console.log(`Total .............. ${(totalTime / 1000).toFixed(2)}s`);
    console.log('=============================================\n');

    const allUrls = detectUrls(extractedText);

    return NextResponse.json({
      success: true,
      extractedText: extractedText,
      detectedUrls: allUrls,
      detectedSections: extractionResult.detectedSections,
      isDemo: extractionResult.isDemo,
      demoReason: extractionResult.demoReason,
      resumeData: extractionResult.data,
      externalData: externalData,
      mergedData: mergedData,
      debugInfo: extractionResult.debugInfo
    });

  } catch (error: any) {
    console.error('Server upload error:', error);
    return NextResponse.json({ error: error.message || 'An unexpected server error occurred.' }, { status: 500 });
  }
}
