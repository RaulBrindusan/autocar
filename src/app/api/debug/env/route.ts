import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    brevo_api_key: process.env.BREVO_API_KEY ? '***SET***' : 'NOT SET',
    email_from: process.env.EMAIL_FROM || 'NOT SET',
    node_env: process.env.NODE_ENV || 'NOT SET'
  })
}