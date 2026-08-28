const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const sessionDir = path.join(srcDir, 'session');
const docsDir = path.join(__dirname, 'docs');
const outputHtmlPath = path.join(docsDir, 'index.html');

const sessionFiles = ['day1.html', 'day2.html', 'day3.html', 'day4.html', 'day5.html'];

console.log('Starting slide build and merge process for aspiring_founders LECTURE...');

let mergedSlidesHtml = '';

sessionFiles.forEach(file => {
  const filePath = path.join(sessionDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`Processing ${file}...`);
    const content = fs.readFileSync(filePath, 'utf8');
    mergedSlidesHtml += `\n<!-- Start of ${file} -->\n${content}\n<!-- End of ${file} -->\n`;
  } else {
    console.warn(`Warning: ${file} not found in ${sessionDir}`);
  }
});

let indexHtml = fs.readFileSync(path.join(srcDir, 'index.html'), 'utf8');

// Merge Session Slides into .slides-wrapper
const canvasTarget = '<canvas class="drawing-canvas-layer" id="drawing-canvas"></canvas>';
if (indexHtml.includes(canvasTarget)) {
  indexHtml = indexHtml.replace(canvasTarget, `${canvasTarget}${mergedSlidesHtml}`);
} else {
  console.warn('Canvas target not found in index.html');
}

// Inline style.css
const stylePath = path.join(srcDir, 'style.css');
if (fs.existsSync(stylePath)) {
  const styleCss = fs.readFileSync(stylePath, 'utf8');
  if (indexHtml.includes('<link href="style.css" rel="stylesheet" />')) {
    indexHtml = indexHtml.replace('<link href="style.css" rel="stylesheet" />', `<style>\n${styleCss}\n</style>`);
  } else {
    indexHtml = indexHtml.replace('</head>', `<style>\n${styleCss}\n</style>\n</head>`);
  }
}

// Inline app.js
const appJsPath = path.join(srcDir, 'app.js');
if (fs.existsSync(appJsPath)) {
  const appJs = fs.readFileSync(appJsPath, 'utf8');
  if (indexHtml.includes('<script src="app.js"></script>')) {
    indexHtml = indexHtml.replace('<script src="app.js"></script>', `<script>\n${appJs}\n</script>`);
  } else {
    indexHtml = indexHtml.replace('</head>', `<script>\n${appJs}\n</script>\n</head>`);
  }
}

if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

fs.writeFileSync(outputHtmlPath, indexHtml, 'utf8');
console.log(`Build complete! Output saved to: ${outputHtmlPath}`);
