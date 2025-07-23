import { NextRequest, NextResponse } from 'next/server'
import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Brevo API email configuration...')
    
    // Initialize Brevo API client
    const apiInstance = new TransactionalEmailsApi()
    apiInstance.setApiKey('api-key', process.env.BREVO_API_KEY || '')

    console.log('Brevo API key status:', process.env.BREVO_API_KEY ? 'SET' : 'NOT SET')
    console.log('Email FROM:', process.env.EMAIL_FROM)

    // Send test email
    console.log('Sending test email via Brevo API...')
    
    const emailMessage = new SendSmtpEmail()
    emailMessage.subject = 'Test Email - AutoCar Brevo API Configuration'
    emailMessage.textContent = 'This is a test email to verify the Brevo API configuration is working.'
    emailMessage.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Test Email - AutoCar Brevo API Configuration</h2>
        <p>This is a test email to verify the Brevo API configuration is working.</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>Configuration Details:</h3>
          <ul>
            <li><strong>Brevo API Key:</strong> ${process.env.BREVO_API_KEY ? 'SET' : 'NOT SET'}</li>
            <li><strong>Email FROM:</strong> ${process.env.EMAIL_FROM}</li>
            <li><strong>Method:</strong> Brevo API (not SMTP)</li>
          </ul>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          Sent at: ${new Date().toISOString()}
        </p>
      </div>
    `
    emailMessage.sender = { 
      name: 'AutoCar Test', 
      email: process.env.EMAIL_FROM || 'noreply@codemint.ro' 
    }
    emailMessage.to = [{ 
      email: process.env.EMAIL_TO || 'contact@codemint.ro', 
      name: 'AutoCar Test' 
    }]

    const result = await apiInstance.sendTransacEmail(emailMessage)
    
    console.log('Test email sent successfully via Brevo API:', result.body?.messageId)

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully via Brevo API',
      messageId: result.body?.messageId,
      config: {
        method: 'Brevo API',
        apiKeySet: process.env.BREVO_API_KEY ? true : false,
        emailFrom: process.env.EMAIL_FROM
      }
    })

  } catch (error) {
    console.error('Brevo API email test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      config: {
        method: 'Brevo API',
        apiKeySet: process.env.BREVO_API_KEY ? true : false,
        emailFrom: process.env.EMAIL_FROM
      }
    }, { status: 500 })
  }
}