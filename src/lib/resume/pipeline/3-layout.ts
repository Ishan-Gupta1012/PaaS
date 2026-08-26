import { TextItem, TextBlock } from './types';

// Simple 1D clustering using K-Means style to find columns based on X coordinates
function clusterColumns(items: TextItem[]): number[] {
  const xCoords = items.map(i => i.x).sort((a, b) => a - b);
  if (xCoords.length === 0) return [];
  
  const columns: number[] = [xCoords[0]];
  for (let i = 1; i < xCoords.length; i++) {
    // If gap between X coordinates is larger than 100px, it's likely a new column
    if (xCoords[i] - xCoords[i-1] > 100) {
      columns.push(xCoords[i]);
    }
  }
  return columns;
}

export function analyzeLayout(textItems: TextItem[]): TextBlock[] {
  const blocks: TextBlock[] = [];
  let currentBlock: TextBlock | null = null;
  
  // Sort by page first
  const pages = [...new Set(textItems.map(t => t.page))];
  
  for (const pageNum of pages) {
    const pageItems = textItems.filter(t => t.page === pageNum);
    
    // Multi-column clustering
    const columns = clusterColumns(pageItems);
    
    // Sort items by Column -> Top-to-Bottom -> Left-to-Right
    pageItems.sort((a, b) => {
      // Find which column each belongs to
      const colA = columns.findIndex(c => Math.abs(a.x - c) < 50);
      const colB = columns.findIndex(c => Math.abs(b.x - c) < 50);
      
      if (colA !== colB && colA !== -1 && colB !== -1) return colA - colB;
      if (Math.abs(a.y - b.y) > 3) return b.y - a.y; 
      return a.x - b.x;
    });

    for (let i = 0; i < pageItems.length; i++) {
      const item = pageItems[i];
      
      if (!item.str.trim()) continue;
      
      const isBold = item.fontName.toLowerCase().includes('bold');
      
      // Bullet detection
      let textStr = item.str;
      const isBullet = ['•', '-', '', '➢'].includes(textStr.trim());
      if (isBullet) textStr = '• '; // Standardize
      
      if (!currentBlock) {
        currentBlock = {
          text: textStr,
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height,
          fontSize: item.fontSize,
          isBold: isBold,
          page: pageNum,
          annotations: []
        };
        blocks.push(currentBlock);
      } else {
        const verticalGap = Math.abs(currentBlock.y - item.y);
        const horizontalGap = item.x - (currentBlock.x + currentBlock.width);
        
        const isSameLine = verticalGap <= item.fontSize * 0.5;
        const isNextLineInParagraph = !isSameLine && verticalGap < item.fontSize * 2.0;
        const isSameFont = Math.abs(currentBlock.fontSize - item.fontSize) < 1;
        
        // Table cell detection heuristics (large horizontal gap on same line)
        const isTableCell = isSameLine && horizontalGap > 30;
        
        if ((isSameLine && horizontalGap < item.fontSize * 2.5) || 
            (isNextLineInParagraph && isSameFont && Math.abs(currentBlock.x - item.x) < item.fontSize * 4) ||
            isTableCell) {
          
          if (isTableCell) {
            currentBlock.text += ' | '; // Table column separator
          } else if (isSameLine && horizontalGap > item.fontSize * 0.2) {
            currentBlock.text += ' ';
          } else if (!isSameLine) {
            currentBlock.text += '\n';
          }
          
          currentBlock.text += textStr;
          
          currentBlock.width = Math.max(currentBlock.width, item.x + item.width - currentBlock.x);
          currentBlock.y = Math.min(currentBlock.y, item.y);
          currentBlock.height = Math.max(currentBlock.height, item.height + verticalGap);
          
        } else {
          currentBlock = {
            text: textStr,
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height,
            fontSize: item.fontSize,
            isBold: isBold,
            page: pageNum,
            annotations: []
          };
          blocks.push(currentBlock);
        }
      }
    }
  }
  
  return blocks;
}
