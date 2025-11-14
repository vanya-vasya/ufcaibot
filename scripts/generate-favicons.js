/**
 * Favicon Generator Script
 * 
 * This script generates favicon files in multiple sizes from a source image.
 * 
 * Prerequisites:
 * npm install sharp --save-dev
 * 
 * Usage:
 * 1. Place your source image as 'favicon-source.png' in the public folder
 * 2. Run: node scripts/generate-favicons.js
 * 3. Favicons will be generated in the public folder
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-192x192.png', size: 192 },
  { name: 'favicon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

const publicDir = path.join(__dirname, '..', 'public');
const sourceImage = path.join(publicDir, 'favicon-source.png');

async function generateFavicons() {
  try {
    // Check if source image exists
    await fs.access(sourceImage);
    console.log('✓ Source image found');

    // Generate each size
    for (const { name, size } of sizes) {
      const outputPath = path.join(publicDir, name);
      
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated ${name} (${size}x${size})`);
    }

    // Generate favicon.ico (32x32 is standard)
    const icoPath = path.join(publicDir, 'favicon.ico');
    await sharp(sourceImage)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(icoPath);
    
    console.log('✓ Generated favicon.ico');
    console.log('\n✓ All favicons generated successfully!');
    console.log('\nNext steps:');
    console.log('1. Check the generated files in the public folder');
    console.log('2. The layout.tsx has been updated with new favicon references');
    console.log('3. Deploy your changes');
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('\n✗ Error: Source image not found!');
      console.error(`Please place your favicon source image at: ${sourceImage}`);
      console.error('The image should be at least 512x512px with a white background.');
    } else {
      console.error('\n✗ Error generating favicons:', error.message);
    }
    process.exit(1);
  }
}

generateFavicons();

