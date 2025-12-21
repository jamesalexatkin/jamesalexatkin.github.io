#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple recursive copy function
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Create vendor directory and copy dependencies
const copies = [
  { src: 'node_modules/bootstrap/dist/js', dest: 'vendor/bootstrap/js' },
  { src: 'node_modules/@fortawesome', dest: 'vendor/fontawesome-free' },
  { src: 'node_modules/jquery/dist', dest: 'vendor/jquery' },
  { src: 'node_modules/jquery.easing', dest: 'vendor/jquery-easing' },
  { src: 'node_modules/magnific-popup/dist', dest: 'vendor/magnific-popup' },
];

copies.forEach(({ src, dest }) => {
  try {
    if (fs.existsSync(src)) {
      console.log(`Copying ${src} → ${dest}`);
      copyDir(src, dest);
    } else {
      console.warn(`⚠️  Source not found: ${src}`);
    }
  } catch (err) {
    console.error(`❌ Error copying ${src}:`, err.message);
  }
});

console.log('✓ Vendor copy complete');
