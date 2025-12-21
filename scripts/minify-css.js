#!/usr/bin/env node

const fs = require('fs');
const CleanCSS = require('clean-css');

// Read the compiled CSS
const cssPath = 'css/creative.css';
const minCssPath = 'css/creative.min.css';

try {
  const css = fs.readFileSync(cssPath, 'utf8');
  const output = new CleanCSS().minify(css);
  
  if (output.errors.length > 0) {
    console.error('❌ CSS minification errors:');
    output.errors.forEach(err => console.error('  ', err));
    process.exit(1);
  }
  
  fs.writeFileSync(minCssPath, output.styles, 'utf8');
  console.log(`✓ CSS minified: ${cssPath} → ${minCssPath}`);
} catch (err) {
  console.error(`❌ Error minifying CSS:`, err.message);
  process.exit(1);
}
