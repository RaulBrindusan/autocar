import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Only allow in development environment
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Debug endpoints disabled in production' }, { status: 404 })
  }

  return NextResponse.json({
    brevo_api_key: process.env.BREVO_API_KEY ? '***SET***' : 'NOT SET',
    email_from: process.env.EMAIL_FROM ? '***SET***' : 'NOT SET',
    node_env: process.env.NODE_ENV || 'NOT SET'
  })
}