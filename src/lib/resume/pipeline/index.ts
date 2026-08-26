import { loadPdf } from './1-loader';
import { extractTextWithLayout } from './2-extractor';
import { analyzeLayout } from './3-layout';
import { extractAnnotations } from './4-annotations';
import { detectSectionsFromText } from './5-sections';
import { extractStructuredInfo } from './6-structured';
import { normalizeData } from './7-normalizer';
import { TextBlock, ResumeData } from './types';

export async function processResumePipeline(buffer: Buffer): Promise<{
  portfolio: Partial<ResumeData>;
  rawText: string;
}> {
  console.log('[Pipeline Stage 1] Loading PDF');
  const pdfDoc = await loadPdf(buffer);

  console.log('[Pipeline Stage 2] Extracting text items');
  const textItems = await extractTextWithLayout(pdfDoc, buffer);

  console.log('[Pipeline Stage 3] Analyzing layout into blocks');
  let blocks = analyzeLayout(textItems);

  console.log('[Pipeline Stage 4] Extracting annotations');
  blocks = await extractAnnotations(pdfDoc, blocks);

  // Build the raw text string from all blocks
  const rawText = blocks.map(b => b.text).join('\n');

  console.log('[Pipeline Stage 5] Detecting sections from raw text');
  const sections = detectSectionsFromText(rawText);

  // Separate annotated blocks for hyperlink extraction ONLY
  // (Do NOT push them into section text blocks, as that pollutes fullText)
  const annotatedBlocks: TextBlock[] = blocks.filter(b => b.annotations.length > 0);

  console.log('[Pipeline Stage 5] Detected sections:', sections.map(s => s.title));

  console.log('[Pipeline Stage 6] Extracting structured data');
  const rawData = extractStructuredInfo(sections, annotatedBlocks);

  console.log('[Pipeline Stage 7] Normalizing data');
  const normalizedData = normalizeData(rawData);

  console.log('[Pipeline Stage 8] Done. Experience:', normalizedData.experience?.length, 'Projects:', normalizedData.projects?.length);

  return {
    portfolio: normalizedData,
    rawText
  };
}
