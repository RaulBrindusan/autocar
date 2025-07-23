import { NextRequest, NextResponse } from 'next/server'
import { sendCarRequestEmail, type CarRequestEmailData } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    console.log('Car request email API called')
    const data: CarRequestEmailData = await request.json()
    
    // Validate required fields
    if (!data.make || !data.model || !data.year || !data.budget) {
      console.error('Missing required fields:', { 
        make: data.make, 
        model: data.model, 
        year: data.year, 
        budget: data.budget 
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

    const result = await sendCarRequestEmail(data)
    
    console.log('Car request email sent successfully')
    return NextResponse.json({ 
      success: true, 
      messageId: result?.messageId 
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