import fs from 'fs';
const PDFParser = require('pdf2json');

const pdfParser = new PDFParser();

function safeDecodeURIComponent(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    try {
      return unescape(str);
    } catch {
      return str;
    }
  }
}

pdfParser.on('pdfParser_dataError', (errData: any) => console.error(errData.parserError));
pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
  const pages = pdfData.Pages;
  let fullText = '';

  for (let pageNum = 0; pageNum < pages.length; pageNum++) {
    const page = pages[pageNum];
    const texts = page.Texts;

    // Group texts by y coordinate (with some small tolerance, e.g. 0.3)
    const lines: Record<string, any[]> = {};
    const tolerance = 0.3;

    for (const textObj of texts) {
      const y = textObj.y;
      // Find an existing line close to this y
      let foundLineKey = null;
      for (const key of Object.keys(lines)) {
        if (Math.abs(parseFloat(key) - y) < tolerance) {
          foundLineKey = key;
          break;
        }
      }

      if (foundLineKey !== null) {
        lines[foundLineKey].push(textObj);
      } else {
        lines[y.toString()] = [textObj];
      }
    }

    // Sort line keys vertically (top to bottom)
    const sortedYKeys = Object.keys(lines).sort((a, b) => parseFloat(a) - parseFloat(b));

    for (const yKey of sortedYKeys) {
      const lineItems = lines[yKey];
      // Sort items on the same line horizontally (left to right)
      lineItems.sort((a, b) => a.x - b.x);

      let lineText = '';
      let prevEndX = -1;

      for (const item of lineItems) {
        const decodedText = safeDecodeURIComponent(item.R[0].T);
        
        if (prevEndX !== -1) {
          // If there is horizontal gap, add space
          const gap = item.x - prevEndX;
          if (gap > 0.15) { // gap threshold
            lineText += ' ';
          }
        }

        lineText += decodedText;
        prevEndX = item.x + (item.w || 0);
      }

      fullText += lineText + '\n';
    }
    
    fullText += '\n'; // Page separator
  }

  console.log('RECONSTRUCTED TEXT FROM PDF2JSON:');
  console.log(fullText);
});

pdfParser.parseBuffer(fs.readFileSync('C:/Users/aparna jha/Downloads/resume-example.pdf'));
