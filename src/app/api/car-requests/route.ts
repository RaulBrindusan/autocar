import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.make || !data.model || !data.year || !data.budget || !data.name || !data.phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await createClient()

    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser()

    // Prepare the car request data for database insertion
    const carRequestData = {
      user_id: user?.id || null, // null if user is not authenticated
      brand: data.make,
      model: data.model,
      year: data.year,
      fuel_type: data.fuelType || null,
      transmission: data.transmission || null,
      mileage_max: data.maxMileage || null,
      max_budget: data.budget,
      preferred_color: null, // This could be added later if needed
      additional_requirements: data.additionalNotes || null,
      contact_name: data.name,
      contact_email: `${data.name.toLowerCase().replace(/\s+/g, '.')}@contact.placeholder`, // Generate a placeholder email
      contact_phone: data.phone,
      custom_features: data.features || [],
      status: 'pending'
    }

    console.log('Attempting to insert car request data:', carRequestData)

    // Insert into database
    const { data: insertedData, error } = await supabase
      .from('car_requests')
      .insert([carRequestData])
      .select()

    if (error) {
      console.error('Database error:', error)
      console.error('Error details:', error.details)
      console.error('Error hint:', error.hint)
      console.error('Error code:', error.code)
      return NextResponse.json(
        { 
          error: 'Failed to save car request to database', 
          details: error.message,
          code: error.code,
          hint: error.hint
        },
        { status: 500 }
      )
    }

    console.log('Car request saved to database:', insertedData[0]?.id)
    
    return NextResponse.json({ 
      success: true, 
      id: insertedData[0]?.id 
    })
  } catch (error) {
    console.error('Error saving car request:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      { 
        error: 'Failed to save car request',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}