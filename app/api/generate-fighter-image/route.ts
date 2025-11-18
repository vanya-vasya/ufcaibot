import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function POST(request: NextRequest) {
  try {
    const { fighterA, fighterB } = await request.json();

    if (!fighterA || !fighterB) {
      return NextResponse.json(
        { error: 'Both fighter names are required' },
        { status: 400 }
      );
    }

    // Create prompt for image generation
    const prompt = `Two professional UFC fighters facing off in a UFC promotional style photo. On the left is ${fighterA}, on the right is ${fighterB}. Both fighters are shirtless, wearing UFC shorts, standing in fighting stance against a dark black background. Professional UFC photography style, dramatic lighting, high quality, realistic, photorealistic.`;

    // Generate filename
    const timestamp = Date.now();
    const fileName = `${fighterA.replace(/\s+/g, '-')}-vs-${fighterB.replace(/\s+/g, '-')}-${timestamp}.png`;
    const filePath = path.join(process.cwd(), 'public', 'generated-fighters', fileName);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Check if OPENAI_API_KEY is available
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('OPENAI_API_KEY not found, using placeholder image');
      return NextResponse.json({
        success: true,
        imageUrl: '/placeholder-fighter-image.png',
        prompt,
        message: 'Using placeholder - OPENAI_API_KEY not configured',
      });
    }

    // Generate image using OpenAI DALL-E API
    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1792x1024',
        quality: 'standard',
        response_format: 'url',
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const imageData = await openaiResponse.json();
    const imageURL = imageData.data[0]?.url;

    if (!imageURL) {
      throw new Error('No image URL returned from OpenAI');
    }

    // Download the image and save it locally
    const imageResponse = await fetch(imageURL);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/generated-fighters/${fileName}`;

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      prompt,
      filePath: publicUrl,
    });

  } catch (error) {
    console.error('Error generating fighter image:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate fighter image',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

