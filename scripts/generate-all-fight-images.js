#!/usr/bin/env node

/**
 * Generate stats images for all UFC fights
 */

const { generateStatsImage } = require('./generate-stats-image.js');
const path = require('path');

const fights = [
  {
    title: 'GAETHJE VS PIMBLETT',
    fighterA: 'JUSTIN GAETHJE',
    fighterB: 'PADDY PIMBLETT',
    bar1: { red: 55, blue: 45 },   // ODDS ANALYSIS
    bar2: { red: 62, blue: 38 },   // FIGHTERS ANALYSIS
    bar3: { red: 48, blue: 52 },   // SENTIMENT ANALYSIS
    eventDate: 'UFC 324'
  },
  {
    title: 'HARRISON VS NUNES',
    fighterA: 'KAYLA HARRISON',
    fighterB: 'AMANDA NUNES',
    bar1: { red: 35, blue: 65 },
    bar2: { red: 40, blue: 60 },
    bar3: { red: 38, blue: 62 },
    eventDate: 'UFC 324'
  },
  {
    title: "O'MALLEY VS YADONG",
    fighterA: "SEAN O'MALLEY",
    fighterB: 'SONG YADONG',
    bar1: { red: 68, blue: 32 },
    bar2: { red: 72, blue: 28 },
    bar3: { red: 75, blue: 25 },
    eventDate: 'UFC 324'
  },
  {
    title: 'ACOSTA VS LEWIS',
    fighterA: 'WALDO CORTES ACOSTA',
    fighterB: 'DERRICK LEWIS',
    bar1: { red: 42, blue: 58 },
    bar2: { red: 38, blue: 62 },
    bar3: { red: 45, blue: 55 },
    eventDate: 'UFC 324'
  },
  {
    title: 'ALLEN VS SILVA',
    fighterA: 'ARNOLD ALLEN',
    fighterB: 'JEAN SILVA',
    bar1: { red: 52, blue: 48 },
    bar2: { red: 55, blue: 45 },
    bar3: { red: 50, blue: 50 },
    eventDate: 'UFC 324'
  },
  {
    title: 'GRASSO VS NAMAJUNAS',
    fighterA: 'ALEXA GRASSO',
    fighterB: 'ROSE NAMAJUNAS',
    bar1: { red: 48, blue: 52 },
    bar2: { red: 45, blue: 55 },
    bar3: { red: 52, blue: 48 },
    eventDate: 'UFC 324'
  },
  {
    title: 'NURMAGOMEDOV VS FIGUEIREDO',
    fighterA: 'UMAR NURMAGOMEDOV',
    fighterB: 'DEIVESON FIGUEIREDO',
    bar1: { red: 70, blue: 30 },
    bar2: { red: 65, blue: 35 },
    bar3: { red: 68, blue: 32 },
    eventDate: 'UFC 325'
  },
  {
    title: 'GAUTIER VS PULYAEV',
    fighterA: 'ATEBA GAUTIER',
    fighterB: 'ANDREY PULYAEV',
    bar1: { red: 55, blue: 45 },
    bar2: { red: 50, blue: 50 },
    bar3: { red: 58, blue: 42 },
    eventDate: 'UFC 325'
  },
  {
    title: 'VOLKANOVSKI VS LOPES',
    fighterA: 'ALEXANDER VOLKANOVSKI',
    fighterB: 'DIEGO LOPES',
    bar1: { red: 58, blue: 42 },
    bar2: { red: 62, blue: 38 },
    bar3: { red: 55, blue: 45 },
    eventDate: 'UFC 325'
  }
];

async function generateAllImages() {
  console.log('🥊 Generating UFC Fight Stats Images');
  console.log('=====================================\n');

  const outputDir = path.join(__dirname, '..', 'public', 'generated-fighters');
  
  for (const fight of fights) {
    const filename = fight.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') + '.png';
    const outputPath = path.join(outputDir, filename);
    
    console.log(`Generating: ${fight.title}`);
    console.log(`  Fighter A: ${fight.fighterA} (${fight.bar1.red}% / ${fight.bar2.red}% / ${fight.bar3.red}%)`);
    console.log(`  Fighter B: ${fight.fighterB} (${fight.bar1.blue}% / ${fight.bar2.blue}% / ${fight.bar3.blue}%)`);
    
    const result = await generateStatsImage(fight, outputPath);
    
    if (result.success) {
      console.log(`  ✅ Saved: ${filename}\n`);
    } else {
      console.error(`  ❌ Error: ${result.error}\n`);
    }
  }
  
  console.log('=====================================');
  console.log('✅ All images generated!');
  console.log(`📁 Output directory: ${outputDir}`);
}

generateAllImages().catch(console.error);

