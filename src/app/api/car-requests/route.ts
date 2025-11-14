import { NextRequest, NextResponse } from 'next/server'
// import { createClient } from '@/lib/supabase/server'
import { carRequestSchema, sanitizeString, isRateLimited, type CarRequestInput } from '@/lib/validation/car-request'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    let data: unknown
    try {
      data = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate input with Zod schema
    let validatedData: CarRequestInput
    try {
      validatedData = carRequestSchema.parse(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: 'Invalid input data',
            details: error.issues.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          },
          { status: 400 }
        )
      }
      throw error
    }

    // Create Supabase client
    const supabase = await createClient()

    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser()

    // Sanitize string inputs to prevent XSS
    const sanitizedData = {
      make: sanitizeString(validatedData.make),
      model: sanitizeString(validatedData.model),
      name: sanitizeString(validatedData.name),
      phone: sanitizeString(validatedData.phone),
      fuelType: validatedData.fuelType ? sanitizeString(validatedData.fuelType) : null,
      transmission: validatedData.transmission ? sanitizeString(validatedData.transmission) : null,
      additionalNotes: validatedData.additionalNotes ? sanitizeString(validatedData.additionalNotes) : null,
    }

    // Prepare the car request data for database insertion
    const carRequestData = {
      user_id: user?.id || null, // null if user is not authenticated
      brand: sanitizedData.make,
      model: sanitizedData.model,
      year: validatedData.year,
      fuel_type: sanitizedData.fuelType,
      transmission: sanitizedData.transmission,
      mileage_max: validatedData.maxMileage || null,
      max_budget: validatedData.budget,
      preferred_color: null, // This could be added later if needed
      additional_requirements: sanitizedData.additionalNotes,
      contact_name: sanitizedData.name,
      contact_email: `${sanitizedData.name.toLowerCase().replace(/\s+/g, '.')}@contact.placeholder`, // Generate a placeholder email
      contact_phone: sanitizedData.phone,
      custom_features: validatedData.features || [],
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
      return NextResponse.json(
        { 
          error: 'Failed to save car request to database'
          // Don't expose internal error details in production
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