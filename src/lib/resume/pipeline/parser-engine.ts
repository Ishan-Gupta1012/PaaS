import { PdfDocument, TextItem } from './types';

export interface ExtractionEngine {
  parse(pdfDoc: PdfDocument, buffer: Buffer): Promise<TextItem[]>;
}
