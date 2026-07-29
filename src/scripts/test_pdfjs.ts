import fs from 'fs';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

async function extractText(pdfPath: string): Promise<string> {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
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

async function main() {
  try {
    const text = await extractText('C:/Users/aparna jha/Downloads/resume-example.pdf');
    console.log('--- EXTRACTED TEXT FROM PDFJS-DIST ---');
    console.log(text);
  } catch (err) {
    console.error('Error during extraction:', err);
  }
}

main();
