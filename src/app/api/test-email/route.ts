import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('=== EMAIL TEST ENDPOINT ===')
    console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? 'SET' : 'NOT SET')
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM)
    console.log('EMAIL_TO:', process.env.EMAIL_TO)
    
    // Simple test without actually sending email
    return NextResponse.json({ 
      success: true,
      message: 'Environment variables checked',
      env: {
        brevoApiKey: process.env.BREVO_API_KEY ? 'SET' : 'NOT SET',
        emailFrom: process.env.EMAIL_FROM || 'NOT SET',
        emailTo: process.env.EMAIL_TO || 'NOT SET'
      }
    })
  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}