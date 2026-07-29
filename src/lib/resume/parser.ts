import mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

/**
 * Helper to parse a PDF buffer using pdfjs-dist.
 */
async function parseWithPdfJs(buffer: Buffer): Promise<string> {
  const data = new Uint8Array(buffer);
  const loadingTask = pdfjs.getDocument({
    data,
    useSystemFonts: true,
    disableFontFace: true
  });
  
  const pdfDocument = await loadingTask.promise;
  const numPages = pdfDocument.numPages;
  let fullText = '';

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const textContent = await page.getTextContent();
    let lastY = -1;
    let pageText = '';

    for (const item of textContent.items) {
      if ('str' in item) {
        const y = item.transform[5];
        
        if (lastY !== -1 && Math.abs(y - lastY) > 5) {
          pageText += '\n';
        } else if (lastY !== -1 && 'hasPageSpace' in item && item.hasPageSpace) {
          pageText += ' ';
        }
        
        pageText += item.str;
        lastY = y;
      }
    }
    
    fullText += pageText + '\n\n';
  }

  return fullText;
}

/**
 * Helper to parse a PDF buffer using pdf2json.
 */
async function parseWithPdf2Json(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const PDFParser = require('pdf2json');
      const pdfParser = new PDFParser(null, 1);

      pdfParser.on('pdfParser_dataError', (errData: any) => {
        reject(new Error(errData?.parserError || 'Unknown pdf2json parsing error'));
      });

      pdfParser.on('pdfParser_dataReady', () => {
        try {
          const text = pdfParser.getRawTextContent();
          resolve(text || '');
        } catch (err) {
          reject(err);
        }
      });

      pdfParser.parseBuffer(buffer);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Extracts plain text from a resume buffer based on the filename extension.
 * Runs entirely on the server to prevent worker bundling crashes.
 * 
 * @param buffer - The binary file contents.
 * @param filename - The name of the file (to determine type).
 * @returns The extracted plain text content.
 */
export async function parseResumeFile(buffer: Buffer, filename: string): Promise<string> {
  const name = filename.toLowerCase();

  if (name.endsWith('.pdf')) {
    if (buffer.length < 4 || buffer.toString('ascii', 0, 4) !== '%PDF') {
      throw new Error('The uploaded PDF file is invalid or corrupted (missing %PDF header).');
    }

    const errors: string[] = [];

    // --- PARSER A: pdfjs-dist (Recommended, layout-preserving) ---
    try {
      console.log(`[Parser A: pdfjs-dist] Attempting text extraction...`);
      const text = await parseWithPdfJs(buffer);
      if (text && text.trim()) {
        return text;
      }
      throw new Error('pdfjs-dist returned empty text content.');
    } catch (err: any) {
      console.warn(`[Parser A: pdfjs-dist] Failed to extract text:`, err.message || err);
      errors.push(`pdfjs-dist error: ${err.message || err}`);
    }

    // --- PARSER B: pdf-parse (Fallback) ---
    try {
      console.log(`[Parser B: pdf-parse] Attempting fallback extraction...`);
      const pdfParse = require('pdf-parse/lib/pdf-parse.js');
      const data = await pdfParse(buffer);
      if (data && data.text && data.text.trim()) {
        return data.text;
      }
      throw new Error('pdf-parse returned empty text content.');
    } catch (err: any) {
      console.warn(`[Parser B: pdf-parse] Failed to extract text:`, err.message || err);
      errors.push(`pdf-parse error: ${err.message || err}`);
    }

    // --- PARSER C: pdf2json (Fallback) ---
    try {
      console.log(`[Parser C: pdf2json] Attempting fallback parsing...`);
      const text = await parseWithPdf2Json(buffer);
      if (text && text.trim()) {
        return text;
      }
      throw new Error('pdf2json returned empty text content.');
    } catch (err: any) {
      console.error(`[Parser C: pdf2json] Failed to extract text:`, err.message || err);
      errors.push(`pdf2json error: ${err.message || err}`);
    }

    throw new Error(`All PDF parsers failed to extract text:\n- ${errors.join('\n- ')}`);
  } 
  
  if (name.endsWith('.docx')) {
    if (buffer.length < 4 || buffer.toString('ascii', 0, 2) !== 'PK') {
      throw new Error('The uploaded DOCX file is invalid or corrupted (missing PK header).');
    }

    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || '';
    } catch (error: any) {
      console.error(`[DOCX Parser: mammoth] Failed to extract text:`, error.message || error);
      throw new Error(`Failed to parse DOCX resume: ${error.message || error}`);
    }
  }

  throw new Error('Unsupported file extension. Only .pdf and .docx are supported.');
}
