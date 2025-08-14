import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Only allow in development environment
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Debug endpoints disabled in production' }, { status: 404 })
    }

    console.log('=== BREVO DEBUG ENDPOINT ===')
    
    // Check environment variables
    const envCheck = {
      BREVO_API_KEY: process.env.BREVO_API_KEY ? 'SET' : 'NOT SET',
      EMAIL_FROM: process.env.EMAIL_FROM ? 'SET' : 'NOT SET',
      EMAIL_TO: process.env.EMAIL_TO ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET'
    }
    
    console.log('Environment variables:', envCheck)
    
    // Test basic API key format
    const apiKey = process.env.BREVO_API_KEY
    const isValidFormat = apiKey && apiKey.startsWith('xkeysib-') && apiKey.length > 50
    
    console.log('API Key format check:', isValidFormat ? 'VALID' : 'INVALID')
    
    // Test Brevo API client initialization
    let clientInitSuccess = false
    let initError = null
    
    try {
      const { TransactionalEmailsApi } = await import('@getbrevo/brevo')
      const apiInstance = new TransactionalEmailsApi()
      ;(apiInstance as any).authentications['api-key'].apiKey = process.env.BREVO_API_KEY || ''
      clientInitSuccess = true
      console.log('Brevo client initialization: SUCCESS')
    } catch (error) {
      initError = error instanceof Error ? error.message : 'Unknown error'
      console.log('Brevo client initialization: FAILED -', initError)
    }
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: envCheck,
      apiKeyFormatValid: isValidFormat,
      clientInitialization: {
        success: clientInitSuccess,
        error: initError
      },
      message: 'Debug information collected successfully'
    })
    
  } catch (error) {
    console.error('Debug endpoint error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}