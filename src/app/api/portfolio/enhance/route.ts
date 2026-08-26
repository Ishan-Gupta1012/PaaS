import { NextRequest, NextResponse } from 'next/server';
import { generateJSON } from '@/lib/llm';

export async function POST(req: NextRequest) {
  try {
    const { resumeData } = await req.json();

    if (!resumeData) {
      return NextResponse.json({ error: 'resumeData is required.' }, { status: 400 });
    }

    const prompt = `You are an expert copywriter. 
The user is generating a personal portfolio from their resume data.
I will provide you with the user's "experience" (achievements/jobs) and "projects" arrays in JSON.

CRITICAL INSTRUCTIONS:
1. ONLY modify the "description" and "highlights" (or bullets) fields.
2. Make the descriptions short, punchy, and attractive for a portfolio website.
3. DO NOT change titles, names, organizations, dates, tech stacks, or IDs.
4. DO NOT add new items or delete existing items.
5. DO NOT hallucinate any skills or information. Use ONLY what is provided.
6. Return the EXACT same JSON structure, just with enhanced descriptions and highlights.

Here is the JSON:
${JSON.stringify(resumeData, null, 2)}

Return a valid JSON object matching the input structure.`;

    const enhancedData = await generateJSON(prompt);

    return NextResponse.json({ success: true, enhancedData });
  } catch (error: unknown) {
    console.error('Enhance API error:', error);
    const msg = error instanceof Error ? error.message : 'An unexpected error occurred during enhancement.';
    
    // Check for specific API Key error
    if (msg.includes('GEMINI_API_KEY') || msg.includes('API key not valid')) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is missing or invalid. Please configure it in .env.local.' }, { status: 500 });
    }

    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
