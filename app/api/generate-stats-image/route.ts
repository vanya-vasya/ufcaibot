import { NextRequest, NextResponse } from 'next/server';
import { generateStatsImage, generateStatsImageBase64 } from '@/lib/generate-stats-image';
import type { StatsImageInput } from '@/lib/generate-stats-image';
import path from 'path';

/**
 * POST /api/generate-stats-image
 * 
 * Generate a UFC stats bars image from N8N webhook data
 * 
 * Request body:
 * {
 *   title: string,           // Fight title (e.g., "YAN VS MCGHEE")
 *   bar1: { red: number, blue: number },  // ODDS ANALYSIS
 *   bar2: { red: number, blue: number },  // FIGHTERS ANALYSIS
 *   bar3: { red: number, blue: number },  // SENTIMENT ANALYSIS
 *   fighterA?: string,       // Optional Fighter A name
 *   fighterB?: string,       // Optional Fighter B name
 *   eventDate?: string,      // Optional event date
 *   outputFormat?: 'base64' | 'file' | 'buffer'
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    const { title, bar1, bar2, bar3, fighterA, fighterB, eventDate, outputFormat = 'base64' } = body;
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    if (!bar1 || !bar2 || !bar3) {
      return NextResponse.json({ error: 'All three bars are required (bar1, bar2, bar3)' }, { status: 400 });
    }
    
    // Validate bar data
    const validateBar = (bar: any, name: string): string | null => {
      if (typeof bar.red !== 'number' || typeof bar.blue !== 'number') {
        return `${name} must have numeric red and blue values`;
      }
      if (bar.red < 0 || bar.red > 100 || bar.blue < 0 || bar.blue > 100) {
        return `${name} percentages must be between 0 and 100`;
      }
      if (Math.abs(bar.red + bar.blue - 100) > 0.1) {
        return `${name} red + blue must equal 100`;
      }
      return null;
    };
    
    const bar1Error = validateBar(bar1, 'bar1');
    const bar2Error = validateBar(bar2, 'bar2');
    const bar3Error = validateBar(bar3, 'bar3');
    
    if (bar1Error || bar2Error || bar3Error) {
      return NextResponse.json({ 
        error: bar1Error || bar2Error || bar3Error 
      }, { status: 400 });
    }
    
    const input: StatsImageInput = {
      title,
      bar1,
      bar2,
      bar3,
      fighterA,
      fighterB,
      eventDate
    };
    
    // Generate based on output format
    if (outputFormat === 'base64') {
      const result = await generateStatsImageBase64(input);
      
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      
      return NextResponse.json({
        success: true,
        dataUrl: result.dataUrl,
        format: 'base64'
      });
    }
    
    if (outputFormat === 'file') {
      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const filename = `stats-${sanitizedTitle}-${timestamp}.png`;
      const outputPath = path.join(process.cwd(), 'public', 'generated-fighters', filename);
      
      const result = await generateStatsImage(input, outputPath);
      
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      
      return NextResponse.json({
        success: true,
        path: result.path,
        publicUrl: `/generated-fighters/${filename}`,
        format: 'file'
      });
    }
    
    if (outputFormat === 'buffer') {
      const result = await generateStatsImage(input);
      
      if (!result.success || !result.buffer) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      
      // Return as PNG image
      return new NextResponse(result.buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="stats-${Date.now()}.png"`
        }
      });
    }
    
    return NextResponse.json({ error: 'Invalid outputFormat' }, { status: 400 });
    
  } catch (error) {
    console.error('[generate-stats-image] Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}

/**
 * GET /api/generate-stats-image
 * 
 * Returns API documentation
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/generate-stats-image',
    method: 'POST',
    description: 'Generate UFC stats bars image from analysis data',
    requestBody: {
      title: 'string (required) - Fight title e.g., "YAN VS MCGHEE"',
      bar1: '{ red: number, blue: number } - ODDS ANALYSIS percentages (must sum to 100)',
      bar2: '{ red: number, blue: number } - FIGHTERS ANALYSIS percentages (must sum to 100)',
      bar3: '{ red: number, blue: number } - SENTIMENT ANALYSIS percentages (must sum to 100)',
      fighterA: 'string (optional) - Fighter A name',
      fighterB: 'string (optional) - Fighter B name',
      eventDate: 'string (optional) - Event date',
      outputFormat: '"base64" | "file" | "buffer" (default: "base64")'
    },
    example: {
      title: 'YAN VS MCGHEE',
      bar1: { red: 72, blue: 28 },
      bar2: { red: 65, blue: 35 },
      bar3: { red: 58, blue: 42 },
      fighterA: 'PETR YAN',
      fighterB: 'DEIVESON MCGHEE',
      eventDate: 'JUL. 26, 2025',
      outputFormat: 'base64'
    }
  });
}

