const fs = require('fs');

const cssPath = 'src/app/globals.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Extract the @theme inline block
const themeMatch = css.match(/@theme inline {\n([\s\S]*?)\n}\n\n\.dark {/);
if (!themeMatch) {
  console.log("Could not find the @theme inline block.");
  process.exit(1);
}

const themeContent = themeMatch[1];
const lines = themeContent.split('\n');

let rootContent = '';
let newThemeContent = '';

for (const line of lines) {
  if (line.trim().startsWith('--color-') && line.includes('#')) {
    const parts = line.split(':');
    const varName = parts[0].trim();
    const hex = parts[1].split(';')[0].trim();
    
    // e.g. varName = "--color-error"
    const newVarName = varName.replace('--color-', '--th-');
    
    rootContent += `  ${newVarName}: ${hex};\n`;
    newThemeContent += `  ${varName}: var(${newVarName});\n`;
  } else {
    // Keep other stuff (like spacing, fonts) as is
    newThemeContent += line + '\n';
  }
}

// Extract .dark block
const darkMatch = css.match(/\.dark {\n([\s\S]*?)\n}/);
if (!darkMatch) {
  console.log("Could not find the .dark block.");
  process.exit(1);
}

const darkContent = darkMatch[1];
const darkLines = darkContent.split('\n');
let newDarkContent = '';

for (const line of darkLines) {
  if (line.trim().startsWith('--color-') && line.includes('#')) {
    const parts = line.split(':');
    const varName = parts[0].trim();
    const hex = parts[1].split(';')[0].trim();
    
    const newVarName = varName.replace('--color-', '--th-');
    newDarkContent += `  ${newVarName}: ${hex};\n`;
  } else {
    newDarkContent += line + '\n';
  }
}

// Reassemble
let newCss = css.replace(/@theme inline {\n[\s\S]*?\n}\n\n\.dark {\n[\s\S]*?\n}/, 
`:root {
${rootContent}}

.dark {
${newDarkContent}}

@theme inline {
${newThemeContent}}`);

fs.writeFileSync(cssPath, newCss);
console.log("Successfully refactored globals.css");
