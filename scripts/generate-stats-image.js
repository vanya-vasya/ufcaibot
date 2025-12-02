#!/usr/bin/env node

/**
 * UFC Stats Bars Image Generator Script (JavaScript version)
 * 
 * Generates a PNG image with three analysis bars matching the UFC fight stats design.
 * Each bar shows red (Fighter A) vs blue (Fighter B) percentages that sum to 100%.
 * 
 * Usage:
 *   node scripts/generate-stats-image.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Bar labels
const BAR_LABELS = [
  'ODDS ANALYSIS',
  'FIGHTERS ANALYSIS',
  'SENTIMENT ANALYSIS'
];

/**
 * Generate SVG for the stats bars visualization
 */
function generateStatsSVG(input) {
  const { title, bar1, bar2, bar3, fighterA, fighterB, eventDate } = input;
  const bars = [bar1, bar2, bar3];
  
  // Dimensions
  const width = 1200;
  const height = 1200;
  const cardWidth = 1000;
  const cardHeight = 700;
  const cardX = (width - cardWidth) / 2;
  const cardY = (height - cardHeight) / 2;
  
  // Bar dimensions
  const barWidth = 800;
  const barHeight = 50;
  const barStartX = (width - barWidth) / 2;
  const barGap = 120;
  const firstBarY = cardY + 220;
  
  // Colors
  const redColor = '#D93025';
  const blueColor = '#1A73E8';
  const cardBgColor = '#16213e';
  const textColor = '#ffffff';
  const mutedTextColor = '#8892b0';
  
  // Generate bar elements
  const barElements = bars.map((bar, index) => {
    const barY = firstBarY + (index * barGap);
    const redWidth = (bar.red / 100) * barWidth;
    const blueWidth = (bar.blue / 100) * barWidth;
    const label = BAR_LABELS[index];
    
    return `
      <g>
        <text x="${width / 2}" y="${barY - 15}" 
              text-anchor="middle" 
              font-family="Arial Black, sans-serif" 
              font-size="20" 
              font-weight="bold"
              fill="${mutedTextColor}"
              letter-spacing="2">
          ${label}
        </text>
        
        <rect x="${barStartX}" y="${barY}" 
              width="${barWidth}" height="${barHeight}" 
              fill="#0a0a14" rx="4" ry="4"/>
        
        <rect x="${barStartX}" y="${barY}" 
              width="${redWidth}" height="${barHeight}" 
              fill="${redColor}" rx="4" ry="4"/>
        
        <rect x="${barStartX + barWidth - blueWidth}" y="${barY}" 
              width="${blueWidth}" height="${barHeight}" 
              fill="${blueColor}" rx="4" ry="4"/>
        
        <text x="${barStartX + 15}" y="${barY + 33}" 
              font-family="Arial Black, sans-serif" 
              font-size="22" 
              font-weight="bold"
              fill="${textColor}">
          ${bar.red}%
        </text>
        
        <text x="${barStartX + barWidth - 15}" y="${barY + 33}" 
              text-anchor="end"
              font-family="Arial Black, sans-serif" 
              font-size="22" 
              font-weight="bold"
              fill="${textColor}">
          ${bar.blue}%
        </text>
      </g>
    `;
  }).join('\n');

  // Calculate font size based on name length
  const getFighterFontSize = (name) => {
    if (!name) return 28;
    if (name.length > 18) return 20;
    if (name.length > 14) return 24;
    return 28;
  };
  
  const fighterAFontSize = getFighterFontSize(fighterA);
  const fighterBFontSize = getFighterFontSize(fighterB);

  const fighterNamesSection = (fighterA || fighterB) ? `
    <text x="${cardX + 80}" y="${cardY + 140}" 
          font-family="Arial Black, sans-serif" 
          font-size="${fighterAFontSize}" 
          font-weight="bold"
          fill="${redColor}">
      ${fighterA || 'FIGHTER A'}
    </text>
    <text x="${cardX + cardWidth - 80}" y="${cardY + 140}" 
          text-anchor="end"
          font-family="Arial Black, sans-serif" 
          font-size="${fighterBFontSize}" 
          font-weight="bold"
          fill="${blueColor}">
      ${fighterB || 'FIGHTER B'}
    </text>
  ` : '';

  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="20" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
    
    <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${redColor};stop-opacity:0.3" />
      <stop offset="50%" style="stop-color:transparent;stop-opacity:0" />
      <stop offset="100%" style="stop-color:${blueColor};stop-opacity:0.3" />
    </linearGradient>
  </defs>
  
  <rect x="${cardX}" y="${cardY}" 
        width="${cardWidth}" height="${cardHeight}" 
        fill="${cardBgColor}" 
        rx="16" ry="16"
        filter="url(#cardShadow)"/>
  
  <rect x="${cardX}" y="${cardY}" 
        width="${cardWidth}" height="100" 
        fill="url(#headerGradient)" 
        rx="16" ry="16"/>
  
  <g>
    <text x="${cardX + 40}" y="${cardY + 45}" 
          font-family="Arial Black, sans-serif" 
          font-size="14" 
          font-weight="bold"
          fill="${mutedTextColor}"
          letter-spacing="3">
      ANALYSIS
    </text>
    
    ${eventDate ? `
    <text x="${cardX + 40}" y="${cardY + 70}" 
          font-family="Arial Black, sans-serif" 
          font-size="12" 
          fill="${mutedTextColor}">
      ${eventDate}
    </text>
    ` : ''}
    
    <text x="${width / 2}" y="${cardY + 100}" 
          text-anchor="middle"
          font-family="Arial Black, sans-serif" 
          font-size="${title.length > 25 ? 30 : title.length > 20 ? 36 : 42}" 
          font-weight="bold"
          fill="${textColor}"
          letter-spacing="${title.length > 25 ? 2 : 4}">
      ${title.toUpperCase()}
    </text>
  </g>
  
  ${fighterNamesSection}
  
  ${barElements}
  
  <text x="${width / 2}" y="${cardY + cardHeight - 30}" 
        text-anchor="middle"
        font-family="Arial Black, sans-serif" 
        font-size="14" 
        fill="${mutedTextColor}"
        letter-spacing="2">
    UFC AI ANALYSIS
  </text>
</svg>
  `.trim();
  
  return svg;
}

/**
 * Generate UFC stats image
 * @param {Object} input - Input data
 * @param {string} input.title - Fight title
 * @param {Object} input.bar1 - {red, blue} percentages for ODDS ANALYSIS
 * @param {Object} input.bar2 - {red, blue} percentages for FIGHTERS ANALYSIS
 * @param {Object} input.bar3 - {red, blue} percentages for SENTIMENT ANALYSIS
 * @param {string} [input.fighterA] - Fighter A name
 * @param {string} [input.fighterB] - Fighter B name
 * @param {string} [input.eventDate] - Event date
 * @param {string} [outputPath] - Optional file path to save
 */
async function generateStatsImage(input, outputPath) {
  try {
    // Validate bars sum to 100
    const bars = [input.bar1, input.bar2, input.bar3];
    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i];
      if (Math.abs(bar.red + bar.blue - 100) > 0.1) {
        throw new Error(`Bar ${i + 1} percentages must sum to 100 (got ${bar.red} + ${bar.blue})`);
      }
    }

    const svg = generateStatsSVG(input);
    
    const pngBuffer = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();
    
    if (outputPath) {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(outputPath, pngBuffer);
      return { success: true, path: outputPath, buffer: pngBuffer };
    }
    
    return { success: true, buffer: pngBuffer };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// EXAMPLE INVOCATION
// ============================================

async function main() {
  // Example input matching the reference design
  const exampleInput = {
    title: 'YAN VS MCGHEE',
    bar1: { red: 72, blue: 28 },   // ODDS ANALYSIS
    bar2: { red: 65, blue: 35 },   // FIGHTERS ANALYSIS  
    bar3: { red: 58, blue: 42 },   // SENTIMENT ANALYSIS
    fighterA: 'PETR YAN',
    fighterB: 'DEIVESON MCGHEE',
    eventDate: 'JUL. 26, 2025'
  };

  const outputPath = path.join(__dirname, '..', 'public', 'generated-fighters', 'example-stats.png');

  console.log('🥊 UFC Stats Image Generator');
  console.log('============================\n');
  console.log('Input data:');
  console.log(JSON.stringify(exampleInput, null, 2));
  console.log('\nGenerating image...\n');
  
  const result = await generateStatsImage(exampleInput, outputPath);
  
  if (result.success) {
    console.log('✅ Image generated successfully!');
    console.log(`📁 Saved to: ${result.path}`);
    console.log(`📊 Buffer size: ${result.buffer.length} bytes`);
  } else {
    console.error('❌ Error:', result.error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

// Export for use as module
module.exports = { generateStatsImage, generateStatsSVG };

