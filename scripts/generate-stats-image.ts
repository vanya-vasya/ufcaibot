#!/usr/bin/env npx ts-node

/**
 * UFC Stats Bars Image Generator Script
 * 
 * Generates a PNG image with three analysis bars matching the UFC fight stats design.
 * Each bar shows red (Fighter A) vs blue (Fighter B) percentages that sum to 100%.
 * 
 * Usage:
 *   npx ts-node scripts/generate-stats-image.ts
 * 
 * Or import and use in code:
 *   import { generateStatsImage } from '@/lib/generate-stats-image';
 */

import path from 'path';

// Since this is a script, we need to import from relative path
import { generateStatsImage, StatsImageInput } from '../lib/generate-stats-image';

// Example invocation data
const exampleInput: StatsImageInput = {
  title: 'YAN VS MCGHEE',
  bar1: { red: 72, blue: 28 },   // ODDS ANALYSIS
  bar2: { red: 65, blue: 35 },   // FIGHTERS ANALYSIS  
  bar3: { red: 58, blue: 42 },   // SENTIMENT ANALYSIS
  fighterA: 'PETR YAN',
  fighterB: 'DEIVESON MCGHEE',
  eventDate: 'JUL. 26, 2025'
};

// Output path
const outputPath = path.join(process.cwd(), 'public', 'generated-fighters', 'example-stats.png');

async function main() {
  console.log('🥊 UFC Stats Image Generator');
  console.log('============================');
  console.log('');
  console.log('Input data:');
  console.log(JSON.stringify(exampleInput, null, 2));
  console.log('');
  console.log('Generating image...');
  
  const result = await generateStatsImage(exampleInput, outputPath);
  
  if (result.success) {
    console.log('✅ Image generated successfully!');
    console.log(`📁 Saved to: ${result.path}`);
    console.log(`📊 Buffer size: ${result.buffer?.length} bytes`);
  } else {
    console.error('❌ Error generating image:', result.error);
    process.exit(1);
  }
}

main().catch(console.error);

