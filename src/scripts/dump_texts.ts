import fs from 'fs';
const PDFParser = require('pdf2json');

const pdfParser = new PDFParser();

pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
  const page = pdfData.Pages[0];
  const texts = page.Texts.slice(0, 30);
  for (const text of texts) {
    console.log({
      x: text.x,
      w: text.w,
      sw: text.sw,
      text: decodeURIComponent(text.R[0].T)
    });
  }
});

pdfParser.parseBuffer(fs.readFileSync('C:/Users/aparna jha/Downloads/resume-example.pdf'));
