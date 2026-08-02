import { NextRequest, NextResponse } from 'next/server';
import { processResumePipeline } from '@/lib/resume/pipeline';
import { enrichPortfolioData } from '@/lib/resume/enricher';

export async function POST(req: NextRequest) {
  const startTime = performance.now();
  console.log('[1/4] Resume uploaded (Deterministic Pipeline)');

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No resume file uploaded.' }, { status: 400 });
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds the 5MB limit.' }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.pdf')) {
      return NextResponse.json({ error: 'Unsupported file type. Only PDF files are allowed.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('[2/4] Executing 8-Stage Deterministic Pipeline');
    const { portfolio, rawText } = await processResumePipeline(buffer);

    console.log('[3/4] Enrichment (Optional)');
    let externalData: { github: unknown[]; linkedin: unknown[]; coding: unknown[]; portfolio: unknown[]; otherLinks: unknown[] } = { github: [], linkedin: [], coding: [], portfolio: [], otherLinks: [] };
    try {
      // Basic extraction of links from raw text for enrichment
      externalData = await enrichPortfolioData(rawText);
    } catch (e) {
      console.error('Enrichment failed', e);
    }

    console.log('[4/4] Pipeline Complete');
    const totalTime = performance.now() - startTime;
    console.log(`Total Processing Time: ${(totalTime / 1000).toFixed(2)}s`);

    return NextResponse.json({
      success: true,
      extractedText: rawText,
      detectedUrls: [],
      detectedSections: portfolio, // Sending full portfolio for debug view if needed
      isDemo: false,
      demoReason: null,
      resumeData: portfolio, // Deprecated name, keeping for backward compatibility
      externalData: externalData,
      mergedData: portfolio, // In this new pipeline, the structured data is the merged data
      debugInfo: { pipeline: 'deterministic-v1' }
    });

  } catch (error: unknown) {
    console.error('Server upload error:', error);
    const msg = error instanceof Error ? error.message : 'An unexpected server error occurred.';
    return NextResponse.json({ error: msg }, { status: 500 });

  }
}
