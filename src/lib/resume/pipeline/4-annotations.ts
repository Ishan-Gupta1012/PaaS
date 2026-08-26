import { PdfDocument, TextBlock } from './types';

export async function extractAnnotations(pdfDoc: PdfDocument, blocks: TextBlock[]): Promise<TextBlock[]> {
  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const annotations = await page.getAnnotations();
    
    for (const anno of annotations) {
      if (anno.subtype === 'Link' && anno.url) {
        const rect = anno.rect || [0, 0, 0, 0]; // [x, y, width, height] roughly
        
        let foundOverlap = false;
        
        // Find the block that overlaps with this annotation
        for (const block of blocks) {
          // AABB overlap check with a small margin of error (e.g., 10 units)
          const margin = 10;
          const isOverlapping = 
            rect[0] <= block.x + block.width + margin &&
            rect[2] >= block.x - margin &&
            rect[1] <= block.y + block.height + margin &&
            rect[3] >= block.y - margin;
            
          if (isOverlapping) {
            block.annotations.push({
              url: anno.url,
              rect: rect
            });
            if (!block.text.includes(anno.url)) {
              block.text += ` ${anno.url}`;
            }
            foundOverlap = true;
          }
        }
        
        // CRITICAL: If no overlap was found, we must not lose this annotation.
        // We will attach it to the first block in the document to ensure the global pass processes it.
        if (!foundOverlap && blocks.length > 0) {
           blocks[0].annotations.push({
              url: anno.url,
              rect: rect
           });
        }
      }
    }
  }
  return blocks;
}
