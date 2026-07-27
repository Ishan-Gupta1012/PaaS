import mammoth from 'mammoth';

/**
 * Helper to parse a PDF buffer using pdf2json.
 */
async function parseWithPdf2Json(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const PDFParser = require('pdf2json');
      // Instantiate PDFParser with null context and 1 (raw text mode)
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
    // 1. Validation: Verify the file is not corrupted and starts with the PDF magic header
    if (buffer.length < 4 || buffer.toString('ascii', 0, 4) !== '%PDF') {
      throw new Error('The uploaded PDF file is invalid or corrupted (missing %PDF header).');
    }

    const errors: string[] = [];

    // --- PARSER A: pdf-parse ---
    try {
      const pdfParse = require('pdf-parse/lib/pdf-parse.js');
      const data = await pdfParse(buffer);
      if (data && data.text && data.text.trim()) {
        return data.text;
      }
      throw new Error('pdf-parse returned empty text content.');
    } catch (err: any) {
      console.warn(`[Parser A: pdf-parse] Failed to extract text:`, err.message || err);
      errors.push(`pdf-parse error: ${err.message || err}`);
    }

    // --- PARSER B: pdf2json (Fallback) ---
    try {
      console.log(`[Parser B: pdf2json] Attempting fallback parsing...`);
      const text = await parseWithPdf2Json(buffer);
      if (text && text.trim()) {
        return text;
      }
      throw new Error('pdf2json returned empty text content.');
    } catch (err: any) {
      console.error(`[Parser B: pdf2json] Failed to extract text:`, err.message || err);
      errors.push(`pdf2json error: ${err.message || err}`);
    }

    // If all parsers in the chain fail, throw a combined exception
    throw new Error(`All PDF parsers failed to extract text:\n- ${errors.join('\n- ')}`);
  } 
  
  if (name.endsWith('.docx')) {
    // Validation: Verify the file is not corrupted and starts with ZIP magic header (PK)
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
