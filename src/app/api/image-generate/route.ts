import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, aspectRatio } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const imageAspectRatio = aspectRatio || '1:1';

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        imageConfig: {
          aspectRatio: imageAspectRatio,
          imageSize: '2K'
        }
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate image' },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      return NextResponse.json({ error: 'No image generated' }, { status: 500 });
    }

    const candidate = data.candidates[0];
    const imagePart = candidate.content.parts.find(
      (part: any) => part.inline_data || part.inlineData
    );

    if (!imagePart) {
      return NextResponse.json({ error: 'No image data in response' }, { status: 500 });
    }

    const generatedImageData = imagePart.inline_data?.data || imagePart.inlineData?.data;

    return NextResponse.json({
      success: true,
      generatedImage: generatedImageData,
    });

  } catch (error) {
    console.error('Image generate error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
