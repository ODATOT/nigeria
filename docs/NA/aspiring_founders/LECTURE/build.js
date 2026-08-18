const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const docsDir = path.join(__dirname, 'docs');

function build() {
  console.log('Starting slide build and merge process for aspiring_founders LECTURE...');

  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const indexHtmlPath = path.join(srcDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('Error: src/index.html not found!');
    process.exit(1);
  }
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  const sessionDir = path.join(srcDir, 'session');
  let mergedSlidesHtml = '\n';

  const sessions = [
    'day1.html',
    'day2.html',
    'day3.html',
    'day4.html',
    'day5.html'
  ];

  sessions.forEach((filename, index) => {
    const sessionNum = index + 1;
    const sessionPath = path.join(sessionDir, filename);

    if (fs.existsSync(sessionPath)) {
      console.log(`Processing ${filename}...`);
      let content = fs.readFileSync(sessionPath, 'utf8');

      content = content.replace(
        /(<section\s+[^>]*\bclass=["'])([^"']*\bslide-card\b[^"']*)(["'])/g,
        `$1$2 session-${sessionNum}$3`
      );

      mergedSlidesHtml += `<!-- Start of ${filename} -->\n`;
      mergedSlidesHtml += content.trim() + '\n';
      mergedSlidesHtml += `<!-- End of ${filename} -->\n\n`;
    } else {
      console.warn(`Warning: ${filename} not found in src/session/`);
    }
  });

  const canvasTarget = '<canvas class="drawing-canvas-layer" id="drawing-canvas"></canvas>';
  if (indexHtml.includes(canvasTarget)) {
    indexHtml = indexHtml.replace(canvasTarget, `${canvasTarget}${mergedSlidesHtml}`);
    console.log('Successfully merged session slides into index.html');
  } else {
    console.error('Error: Could not find insertion target (<canvas class="drawing-canvas-layer" id="drawing-canvas"></canvas>) in index.html');
    process.exit(1);
  }

  // Inline style.css and app.js
  const stylePath = path.join(srcDir, 'style.css');
  if (fs.existsSync(stylePath)) {
    const styleCss = fs.readFileSync(stylePath, 'utf8');
    indexHtml = indexHtml.replace(
      '<link href="style.css" rel="stylesheet" />',
      `<style>\n${styleCss}\n</style>`
    );
  }

  const appJsPath = path.join(srcDir, 'app.js');
  if (fs.existsSync(appJsPath)) {
    const appJs = fs.readFileSync(appJsPath, 'utf8');
    indexHtml = indexHtml.replace(
      '<script src="app.js"></script>',
      `<script>\n${appJs}\n</script>`
    );
  }

  const outputPath = path.join(docsDir, 'index.html');
  fs.writeFileSync(outputPath, indexHtml, 'utf8');
  console.log(`Build complete! Output saved to: ${outputPath}`);
}

build();
