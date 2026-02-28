#!/usr/bin/env node

/**
 * Quick test script for fighter image generation
 * Run with: node test-image-generation.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 UFC AI Bot - Fighter Image Generation Diagnostic\n');

// 1. Check .env.local
console.log('1️⃣ Checking environment variables...');
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const hasOpenAIKey = envContent.includes('OPENAI_API_KEY=');
  if (hasOpenAIKey) {
    const keyLine = envContent.split('\n').find(line => line.startsWith('OPENAI_API_KEY='));
    const keyPreview = keyLine ? keyLine.substring(0, 30) + '...' : 'Not found';
    console.log('   ✅ OPENAI_API_KEY found:', keyPreview);
  } else {
    console.log('   ❌ OPENAI_API_KEY not found in .env.local');
  }
} else {
  console.log('   ❌ .env.local file not found');
}

// 2. Check API route exists
console.log('\n2️⃣ Checking API route...');
const apiRoutePath = path.join(__dirname, 'app', 'api', 'generate-fighter-image', 'route.ts');
if (fs.existsSync(apiRoutePath)) {
  console.log('   ✅ API route exists:', apiRoutePath);
} else {
  console.log('   ❌ API route not found:', apiRoutePath);
}

// 3. Check public directory
console.log('\n3️⃣ Checking public directory...');
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  console.log('   ✅ Public directory exists:', publicDir);
} else {
  console.log('   ❌ Public directory not found');
}

// 4. Check components
console.log('\n4️⃣ Checking components...');
const dashboardPath = path.join(__dirname, 'app', '(dashboard)', 'dashboard', 'page.tsx');
const articlePath = path.join(__dirname, 'components', 'dashboard', 'UFCArticle.tsx');

if (fs.existsSync(dashboardPath)) {
  const dashboardContent = fs.readFileSync(dashboardPath, 'utf-8');
  const hasImageGeneration = dashboardContent.includes('generate-fighter-image');
  console.log('   ✅ Dashboard page exists');
  console.log('   ' + (hasImageGeneration ? '✅' : '❌') + ' Image generation code present');
} else {
  console.log('   ❌ Dashboard page not found');
}

if (fs.existsSync(articlePath)) {
  const articleContent = fs.readFileSync(articlePath, 'utf-8');
  const hasImageDisplay = articleContent.includes('imageUrl');
  console.log('   ✅ UFCArticle component exists');
  console.log('   ' + (hasImageDisplay ? '✅' : '❌') + ' Image display code present');
} else {
  console.log('   ❌ UFCArticle component not found');
}

// 5. Summary
console.log('\n📊 Summary');
console.log('=' .repeat(50));
console.log('If all checks pass, the feature should work.');
console.log('If server is running, restart it with: npm run dev');
console.log('\n📝 Next steps:');
console.log('1. Restart dev server (Ctrl+C, then npm run dev)');
console.log('2. Open http://localhost:3000');
console.log('3. Open DevTools (F12) → Console');
console.log('4. Enter fighter names and click VS');
console.log('5. Watch console for [Dashboard] and [Image Generation] logs');
console.log('\n🧪 To test API directly, run:');
console.log('curl -X POST http://localhost:3000/api/generate-fighter-image \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"fighterA":"Test A","fighterB":"Test B"}\'');
console.log('\n');

