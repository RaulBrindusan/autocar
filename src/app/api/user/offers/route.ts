import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify the user is authenticated and is requesting their own offers
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user || user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get offers for the user's car requests
    const { data: offers, error: offersError } = await supabase
      .from('offers')
      .select(`
        id,
        member_car_request_id,
        link,
        accepted,
        sent_at,
        responded_at,
        created_at,
        updated_at,
        member_car_requests!inner (
          id,
          brand,
          model,
          year,
          fuel_type,
          transmission,
          max_budget,
          contact_name,
          contact_email,
          contact_phone,
          created_at,
          user_id
        )
      `)
      .eq('member_car_requests.user_id', userId)
      .order('sent_at', { ascending: false })

    if (offersError) {
      console.error('Error fetching offers:', offersError)
      return NextResponse.json(
        { error: 'Failed to fetch offers' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      offers: offers || []
    })

  } catch (error) {
    console.error('Error in offers API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}