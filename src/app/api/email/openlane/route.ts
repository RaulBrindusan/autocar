import { NextRequest, NextResponse } from 'next/server'
import { sendOpenLaneEmail, type OpenLaneEmailData } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    console.log('OpenLane email API called')
    const data: OpenLaneEmailData = await request.json()
    
    // Validate required fields
    if (!data.url) {
      console.error('Missing URL in OpenLane email request')
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    console.log('Sending OpenLane email for URL:', data.url)

    const result = await sendOpenLaneEmail(data)
    
    console.log('OpenLane email sent successfully')
    return NextResponse.json({ 
      success: true, 
      messageId: result?.messageId 
    })
  } catch (error) {
    console.error('Error in OpenLane email API:', error)
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const errorStack = error instanceof Error ? error.stack : 'No stack trace'
    
    console.error('Error details:', { message: errorMessage, stack: errorStack })
    
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}