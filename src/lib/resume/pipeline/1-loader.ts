import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import path from 'path';
import { PdfDocument } from './types';

// In Next.js Server Components / API routes, the fake worker dynamic import fails.
// We explicitly set the workerSrc to the resolved path.
if (typeof window === 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = path.join(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
}

export async function loadPdf(buffer: Buffer): Promise<PdfDocument> {
  const data = new Uint8Array(buffer);
  
  // Setting standardFontDataUrl might also be needed to prevent font loading issues
  const standardFontDataUrl = path.join(process.cwd(), 'node_modules/pdfjs-dist/standard_fonts/');

  const loadingTask = pdfjs.getDocument({
    data,
    useSystemFonts: true,
    disableFontFace: true,
    standardFontDataUrl
  });
  
  const pdfDocument = await loadingTask.promise;
  return pdfDocument as unknown as PdfDocument;
}
