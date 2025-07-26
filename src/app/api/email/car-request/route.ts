import { NextRequest, NextResponse } from 'next/server'
import { sendCarRequestEmail, sendCustomerConfirmationEmail, type CarRequestEmailData } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    console.log('Car request email API called')
    console.log('Environment variables check:')
    console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? 'SET' : 'NOT SET')
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM)
    console.log('EMAIL_TO:', process.env.EMAIL_TO)
    
    const data: CarRequestEmailData = await request.json()
    console.log('Received data:', JSON.stringify(data, null, 2))
    
    // Validate required fields
    if (!data.make || !data.model || !data.year || !data.budget || !data.name || !data.phone || !data.email) {
      console.error('Missing required fields:', { 
        make: data.make, 
        model: data.model, 
        year: data.year, 
        budget: data.budget,
        name: data.name,
        phone: data.phone,
        email: data.email
      })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Sending car request email for:', { 
      make: data.make, 
      model: data.model, 
      year: data.year 
    })

    // Send notification email to team
    const teamEmailResult = await sendCarRequestEmail(data)
    console.log('Team notification email sent successfully:', teamEmailResult?.body?.messageId)
    
    // Send confirmation email to customer
    const customerEmailResult = await sendCustomerConfirmationEmail(data)
    console.log('Customer confirmation email sent successfully:', customerEmailResult?.body?.messageId)
    
    console.log('Both emails sent successfully')
    return NextResponse.json({ 
      success: true, 
      teamMessageId: teamEmailResult?.body?.messageId,
      customerMessageId: customerEmailResult?.body?.messageId
    })
  } catch (error) {
    console.error('Error in car request email API:', error)
    
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