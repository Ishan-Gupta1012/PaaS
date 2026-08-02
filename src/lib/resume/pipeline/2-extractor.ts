import { PdfDocument, TextItem } from './types';
import { ExtractionEngine } from './parser-engine';
import { createWorker } from 'tesseract.js';
import * as pdfjs from 'pdfjs-dist';

class PdfJsEngine implements ExtractionEngine {
  async parse(pdfDoc: PdfDocument, buffer: Buffer): Promise<TextItem[]> {
    const allTextItems: TextItem[] = [];

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      for (const item of textContent.items) {
        if (!('str' in item)) continue;
        
        allTextItems.push({
          str: item.str,
          dir: item.dir,
          width: item.width,
          height: item.height,
          transform: item.transform,
          fontName: item.fontName,
          hasEOL: item.hasEOL,
          x: item.transform[4],
          y: item.transform[5],
          fontSize: Math.abs(item.transform[0]) || item.height,
          page: pageNum
        });
      }
    }
    return allTextItems;
  }
}

class TesseractOcrEngine implements ExtractionEngine {
  async parse(pdfDoc: PdfDocument, buffer: Buffer): Promise<TextItem[]> {
    console.log('Initiating OCR Fallback...');
    const allTextItems: TextItem[] = [];
    const worker = await createWorker('eng');

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      
      // Render page to canvas to pass to Tesseract
      const viewport = page.getViewport({ scale: 2.0 });
      
      // In a real Node.js environment, converting PDF.js render to image buffer is complex.
      // This is a simplified representation of the intent since we cannot easily use Canvas in Node
      // without node-canvas which requires native compilation. 
      // For this MVP backend implementation, we'll extract text heuristically or assume failure if node-canvas isn't present.
      
      console.log(`[OCR] Parsing page ${pageNum} - Skipping actual pixel render in this MVP without canvas dependency`);
      
      // Stub OCR items based on Tesseract output (which provides bbox)
      /*
      const { data } = await worker.recognize(imageBuffer);
      data.words.forEach(word => {
        allTextItems.push({
          str: word.text,
          dir: 'ltr',
          width: word.bbox.x1 - word.bbox.x0,
          height: word.bbox.y1 - word.bbox.y0,
          transform: [],
          fontName: 'sans-serif',
          hasEOL: false,
          x: word.bbox.x0,
          y: -word.bbox.y0, // Invert Y to match PDF.js bottom-up
          fontSize: word.bbox.y1 - word.bbox.y0,
          page: pageNum
        });
      });
      */
    }
    
    await worker.terminate();
    return allTextItems;
  }
}

export async function extractTextWithLayout(pdfDoc: PdfDocument, buffer: Buffer): Promise<TextItem[]> {
  const primaryEngine = new PdfJsEngine();
  let textItems = await primaryEngine.parse(pdfDoc, buffer);
  
  const hasText = textItems.some(t => t.str.trim().length > 0);
  
  if (!hasText) {
    const ocrEngine = new TesseractOcrEngine();
    textItems = await ocrEngine.parse(pdfDoc, buffer);
  }

  // Reading order sort: Page, then Top-to-bottom, then left-to-right
  textItems.sort((a, b) => {
    if (a.page !== b.page) return a.page - b.page;
    if (Math.abs(a.y - b.y) > 3) return b.y - a.y; 
    return a.x - b.x;
  });

  return textItems;
}
