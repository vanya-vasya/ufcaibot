#!/usr/bin/env node

/**
 * Blog Image Audit Script
 * Tests all image URLs used in blog articles and reports broken links
 */

const https = require('https');
const http = require('http');

// Current mock articles from the API route
const mockArticles = [
  {
    id: "1",
    title: "Some on social media say taping your mouth shut is a sleep hack. But it's not backed by science, and health risks include suffocation",
    url: "https://fortune.com/2025/09/27/mouth-tape-sleep-hack-snoring-apnea-suffocation-risk/",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80",
    category: "Health"
  },
  {
    id: "2",
    title: "NFL office shooter had low-level CTE, NYC medical examiner finds",
    url: "https://fortune.com/2025/09/26/shane-tamura-cte-concussion-nfl-office-shooter-blackstone/",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    category: "Health"
  },
  {
    id: "3", 
    title: "The 5 Best Testosterone Boosters of 2025: Tested and Reviewed",
    url: "https://fortune.com/article/best-testosterone-boosters/",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    category: "Health"
  },
  {
    id: "4",
    title: "The Best Probiotic Supplements for Women (2025): Expert Approved",
    url: "https://fortune.com/article/best-probiotics-for-women/",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80",
    category: "Health"
  },
  {
    id: "5",
    title: "International expats in the United States are running away to Panama in retirement, enjoying the same quality of life for 40% less than back home",
    url: "https://fortune.com/2025/09/26/international-expats-united-states-and-in-retirement-are-running-away-to-panama-enjoying-the-same-quality-of-life-affordable-living-for-40-less-than-back-home-in-the-west-savings-investment-inflation/",
    image: "https://images.unsplash.com/photo-1544737151607-6e4b99e82d78?w=800&q=80",
    category: "Lifestyle"
  },
  {
    id: "6",
    title: "Meta's new AI dating bot is designed to combat burnout and swipe fatigue on dating apps",
    url: "https://fortune.com/2025/09/26/meta-facebook-ai-dating-bot-burnout-swipe-fatigue/",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80",
    category: "Technology"
  }
];

// Function to test if an image URL is accessible
function testImageUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, (res) => {
      const { statusCode, statusMessage } = res;
      
      if (statusCode >= 200 && statusCode < 300) {
        resolve({ 
          url, 
          status: 'OK', 
          statusCode,
          contentType: res.headers['content-type'],
          contentLength: res.headers['content-length']
        });
      } else {
        resolve({ 
          url, 
          status: 'ERROR', 
          statusCode, 
          statusMessage,
          error: `HTTP ${statusCode}: ${statusMessage}`
        });
      }
      
      // Destroy the response to free up memory
      res.destroy();
    });
    
    req.on('error', (err) => {
      resolve({ 
        url, 
        status: 'ERROR', 
        error: err.message 
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ 
        url, 
        status: 'ERROR', 
        error: 'Request timeout' 
      });
    });
  });
}

// Main audit function
async function auditImages() {
  console.log('🔍 Blog Image Audit Report');
  console.log('=' .repeat(50));
  console.log(`Testing ${mockArticles.length} article images...\n`);
  
  const results = [];
  
  for (const article of mockArticles) {
    console.log(`Testing: ${article.title.substring(0, 60)}...`);
    const result = await testImageUrl(article.image);
    
    results.push({
      id: article.id,
      title: article.title,
      category: article.category,
      fortuneUrl: article.url,
      imageUrl: article.image,
      imageStatus: result.status,
      statusCode: result.statusCode,
      error: result.error,
      contentType: result.contentType,
      contentLength: result.contentLength
    });
    
    if (result.status === 'OK') {
      console.log(`✅ OK (${result.statusCode}) - ${result.contentType}`);
    } else {
      console.log(`❌ BROKEN (${result.statusCode || 'N/A'}) - ${result.error}`);
    }
    console.log('');
  }
  
  // Summary
  const brokenImages = results.filter(r => r.imageStatus !== 'OK');
  const workingImages = results.filter(r => r.imageStatus === 'OK');
  
  console.log('\n📊 SUMMARY');
  console.log('=' .repeat(30));
  console.log(`✅ Working images: ${workingImages.length}`);
  console.log(`❌ Broken images: ${brokenImages.length}`);
  
  if (brokenImages.length > 0) {
    console.log('\n🚨 BROKEN IMAGES TO FIX:');
    brokenImages.forEach((img, index) => {
      console.log(`\n${index + 1}. Article ID: ${img.id}`);
      console.log(`   Title: ${img.title.substring(0, 80)}...`);
      console.log(`   Category: ${img.category}`);
      console.log(`   Current Image: ${img.imageUrl}`);
      console.log(`   Error: ${img.error}`);
      console.log(`   Fortune Source: ${img.fortuneUrl}`);
    });
  }
  
  // Export results for use in fixes
  return results;
}

// Run the audit
if (require.main === module) {
  auditImages()
    .then(() => {
      console.log('\n✅ Image audit complete!');
    })
    .catch((err) => {
      console.error('❌ Audit failed:', err);
      process.exit(1);
    });
}

module.exports = { auditImages, testImageUrl };
