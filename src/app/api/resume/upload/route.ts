import { NextRequest, NextResponse } from 'next/server';
import { parseResumeFile } from '@/lib/resume/parser';
import { extractStructuredData } from '@/lib/resume/extractor';
import { enrichPortfolioData, EnrichedData } from '@/lib/resume/enricher';
import { mergeResumeAndExternalData } from '@/lib/resume/merger';

export async function POST(req: NextRequest) {
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
    try {
      extractedText = await parseResumeFile(buffer, file.name);
    } catch (parseError: any) {
      console.error('Error during file text parsing:', parseError);
      return NextResponse.json({ 
        error: `Parsing Error: Could not read document text. ${parseError.message || parseError}` 
      }, { status: 422 });
    }

    if (!extractedText.trim()) {
      return NextResponse.json({ error: 'The uploaded document appears to be empty or unscannable.' }, { status: 422 });
    }

    // 5. LLM Structured data extraction & enrichment
    try {
      const extractionResult = await extractStructuredData(extractedText);
      
      let externalData: EnrichedData = { github: [], linkedin: [], coding: [], portfolio: [], otherLinks: [] };
      let mergedData = extractionResult.data;

      try {
        // Find, validate, and scrape external links concurrently
        externalData = await enrichPortfolioData(extractedText);
        // Merge scraped stats with original resume JSON
        mergedData = mergeResumeAndExternalData(extractionResult.data, externalData);
      } catch (enrichError) {
        console.error('Enrichment or merging failed, proceeding with original resume data:', enrichError);
      }

      return NextResponse.json({
        success: true,
        extractedText: extractedText,
        isDemo: extractionResult.isDemo,
        resumeData: extractionResult.data,
        externalData: externalData,
        mergedData: mergedData
      });
    } catch (extractionError: any) {
      console.error('Error during AI data extraction:', extractionError);
      return NextResponse.json({ 
        error: `AI Extraction Error: Failed to structure parsed resume text. ${extractionError.message || extractionError}` 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Server upload error:', error);
    return NextResponse.json({ error: error.message || 'An unexpected server error occurred.' }, { status: 500 });
  }
}
