import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Types for the stats image generation
export interface BarData {
  red: number;  // Fighter A percentage (0-100)
  blue: number; // Fighter B percentage (0-100)
}

export interface StatsImageInput {
  title: string;                    // Fight title text (e.g., "YAN VS MCGHEE")
  bar1: BarData;                    // ODDS ANALYSIS
  bar2: BarData;                    // FIGHTERS ANALYSIS
  bar3: BarData;                    // SENTIMENT ANALYSIS
  fighterA?: string;                // Fighter A name (left side)
  fighterB?: string;                // Fighter B name (right side)
  eventDate?: string;               // Event date (e.g., "JUL. 26, 2025")
}

export interface GeneratedImageResult {
  success: boolean;
  path?: string;
  buffer?: Buffer;
  error?: string;
}

// Bar labels as specified
const BAR_LABELS = [
  'ODDS ANALYSIS',
  'FIGHTERS ANALYSIS',
  'SENTIMENT ANALYSIS'
];

// Generate SVG for the stats bars visualization
const generateStatsSVG = (input: StatsImageInput): string => {
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
  const redColor = '#D93025';    // Fighter A (red)
  const blueColor = '#1A73E8';   // Fighter B (blue)
  const bgColor = '#1a1a2e';     // Dark background
  const cardBgColor = '#16213e'; // Card background
  const textColor = '#ffffff';   // White text
  const mutedTextColor = '#8892b0'; // Muted text
  
  // Generate bar elements
  const barElements = bars.map((bar, index) => {
    const barY = firstBarY + (index * barGap);
    const redWidth = (bar.red / 100) * barWidth;
    const blueWidth = (bar.blue / 100) * barWidth;
    const label = BAR_LABELS[index];
    
    return `
      <!-- Bar ${index + 1}: ${label} -->
      <g>
        <!-- Label -->
        <text x="${width / 2}" y="${barY - 15}" 
              text-anchor="middle" 
              font-family="'UFC Sans', Arial Black, sans-serif" 
              font-size="20" 
              font-weight="bold"
              fill="${mutedTextColor}"
              letter-spacing="2">
          ${label}
        </text>
        
        <!-- Bar background -->
        <rect x="${barStartX}" y="${barY}" 
              width="${barWidth}" height="${barHeight}" 
              fill="#0a0a14" rx="4" ry="4"/>
        
        <!-- Red portion (Fighter A - left side) -->
        <rect x="${barStartX}" y="${barY}" 
              width="${redWidth}" height="${barHeight}" 
              fill="${redColor}" rx="4" ry="4"/>
        
        <!-- Blue portion (Fighter B - right side) -->
        <rect x="${barStartX + barWidth - blueWidth}" y="${barY}" 
              width="${blueWidth}" height="${barHeight}" 
              fill="${blueColor}" rx="4" ry="4"/>
        
        <!-- Red percentage text -->
        <text x="${barStartX + 15}" y="${barY + 33}" 
              font-family="'UFC Sans', Arial Black, sans-serif" 
              font-size="22" 
              font-weight="bold"
              fill="${textColor}">
          ${bar.red}%
        </text>
        
        <!-- Blue percentage text -->
        <text x="${barStartX + barWidth - 15}" y="${barY + 33}" 
              text-anchor="end"
              font-family="'UFC Sans', Arial Black, sans-serif" 
              font-size="22" 
              font-weight="bold"
              fill="${textColor}">
          ${bar.blue}%
        </text>
      </g>
    `;
  }).join('\n');

  // Build fighter names display
  const fighterNamesSection = (fighterA || fighterB) ? `
    <!-- Fighter names -->
    <text x="${cardX + 80}" y="${cardY + 140}" 
          font-family="'UFC Sans', Arial Black, sans-serif" 
          font-size="32" 
          font-weight="bold"
          fill="${redColor}">
      ${fighterA || 'FIGHTER A'}
    </text>
    <text x="${cardX + cardWidth - 80}" y="${cardY + 140}" 
          text-anchor="end"
          font-family="'UFC Sans', Arial Black, sans-serif" 
          font-size="32" 
          font-weight="bold"
          fill="${blueColor}">
      ${fighterB || 'FIGHTER B'}
    </text>
  ` : '';

  // Build the complete SVG
  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Card shadow -->
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="20" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
    
    <!-- Gradient for header -->
    <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${redColor};stop-opacity:0.3" />
      <stop offset="50%" style="stop-color:transparent;stop-opacity:0" />
      <stop offset="100%" style="stop-color:${blueColor};stop-opacity:0.3" />
    </linearGradient>
  </defs>
  
  <!-- Card background with rounded corners -->
  <rect x="${cardX}" y="${cardY}" 
        width="${cardWidth}" height="${cardHeight}" 
        fill="${cardBgColor}" 
        rx="16" ry="16"
        filter="url(#cardShadow)"/>
  
  <!-- Header gradient overlay -->
  <rect x="${cardX}" y="${cardY}" 
        width="${cardWidth}" height="100" 
        fill="url(#headerGradient)" 
        rx="16" ry="16"/>
  
  <!-- Header section -->
  <g>
    <!-- "ANALYSIS" label -->
    <text x="${cardX + 40}" y="${cardY + 45}" 
          font-family="'UFC Sans', Arial Black, sans-serif" 
          font-size="14" 
          font-weight="bold"
          fill="${mutedTextColor}"
          letter-spacing="3">
      ANALYSIS
    </text>
    
    <!-- Event date if provided -->
    ${eventDate ? `
    <text x="${cardX + 40}" y="${cardY + 70}" 
          font-family="'UFC Sans', Arial Black, sans-serif" 
          font-size="12" 
          fill="${mutedTextColor}">
      ${eventDate}
    </text>
    ` : ''}
    
    <!-- Fight title -->
    <text x="${width / 2}" y="${cardY + 100}" 
          text-anchor="middle"
          font-family="'UFC Sans', Arial Black, sans-serif" 
          font-size="42" 
          font-weight="bold"
          fill="${textColor}"
          letter-spacing="4">
      ${title.toUpperCase()}
    </text>
  </g>
  
  ${fighterNamesSection}
  
  <!-- Stats bars -->
  ${barElements}
  
  <!-- Footer branding -->
  <text x="${width / 2}" y="${cardY + cardHeight - 30}" 
        text-anchor="middle"
        font-family="'UFC Sans', Arial Black, sans-serif" 
        font-size="14" 
        fill="${mutedTextColor}"
        letter-spacing="2">
    UFC AI ANALYSIS
  </text>
</svg>
  `.trim();
  
  return svg;
};

/**
 * Generate a UFC stats bars image from input data
 * 
 * @param input - The stats data including title and bar percentages
 * @param outputPath - Optional file path to save the image
 * @returns Promise with the result containing buffer and/or path
 */
export const generateStatsImage = async (
  input: StatsImageInput,
  outputPath?: string
): Promise<GeneratedImageResult> => {
  try {
    // Validate input
    const bars = [input.bar1, input.bar2, input.bar3];
    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i];
      if (bar.red < 0 || bar.red > 100 || bar.blue < 0 || bar.blue > 100) {
        return {
          success: false,
          error: `Bar ${i + 1} percentages must be between 0 and 100`
        };
      }
      if (Math.abs(bar.red + bar.blue - 100) > 0.1) {
        return {
          success: false,
          error: `Bar ${i + 1} percentages must sum to 100 (got ${bar.red} + ${bar.blue} = ${bar.red + bar.blue})`
        };
      }
    }

    // Generate SVG
    const svg = generateStatsSVG(input);
    
    // Convert SVG to PNG using Sharp
    const pngBuffer = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();
    
    // Save to file if path provided
    if (outputPath) {
      // Ensure directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, pngBuffer);
      
      return {
        success: true,
        path: outputPath,
        buffer: pngBuffer
      };
    }
    
    return {
      success: true,
      buffer: pngBuffer
    };
    
  } catch (error) {
    console.error('Error generating stats image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Generate stats image and return as base64 data URL
 */
export const generateStatsImageBase64 = async (
  input: StatsImageInput
): Promise<{ success: boolean; dataUrl?: string; error?: string }> => {
  const result = await generateStatsImage(input);
  
  if (!result.success || !result.buffer) {
    return { success: false, error: result.error };
  }
  
  const base64 = result.buffer.toString('base64');
  const dataUrl = `data:image/png;base64,${base64}`;
  
  return { success: true, dataUrl };
};

// Export types
export type { StatsImageInput, BarData, GeneratedImageResult };

