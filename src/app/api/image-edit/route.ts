import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { image, prompt, conversationHistory, aspectRatio } = await request.json();

    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Image and prompt are required' },
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

    // Extract base64 data from data URL
    const base64Data = image.split(',')[1];

    // Use provided aspect ratio or default to 16:9
    const imageAspectRatio = aspectRatio || '16:9';

    // Build contents array for conversational editing
    const contents = [];

    // Add previous conversation turns if they exist
    if (conversationHistory && conversationHistory.length > 0) {
      contents.push(...conversationHistory);
    }

    // Add current user request
    contents.push({
      role: 'user',
      parts: [
        {
          text: prompt
        },
        {
          inline_data: {
            mime_type: 'image/png',
            data: base64Data
          }
        }
      ]
    });

    // Prepare the request to Gemini API
    const requestBody = {
      contents: contents,
      generationConfig: {
        imageConfig: {
          aspectRatio: imageAspectRatio,
          imageSize: '2K'
        }
      }
    };

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate edited image' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract the edited image from the response
    if (!data.candidates || data.candidates.length === 0) {
      return NextResponse.json(
        { error: 'No image generated' },
        { status: 500 }
      );
    }

    const candidate = data.candidates[0];
    const imagePart = candidate.content.parts.find(
      (part: any) => part.inline_data || part.inlineData
    );

    if (!imagePart) {
      return NextResponse.json(
        { error: 'No image data in response' },
        { status: 500 }
      );
    }

    // Get the base64 image data
    const editedImageData = imagePart.inline_data?.data || imagePart.inlineData?.data;

    // Build updated conversation history for next iteration
    const updatedConversationHistory = [...contents];

    // Add the model's response to conversation history
    updatedConversationHistory.push({
      role: 'model',
      parts: candidate.content.parts
    });

    return NextResponse.json({
      success: true,
      editedImage: editedImageData,
      conversationHistory: updatedConversationHistory,
    });

  } catch (error) {
    console.error('Image edit error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
