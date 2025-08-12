import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { offerId, accepted } = await request.json()

    if (!offerId || typeof accepted !== 'boolean') {
      return NextResponse.json(
        { error: 'Offer ID and accepted status are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify the user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the offer and verify it belongs to the user
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select(`
        id,
        member_car_request_id,
        accepted,
        member_car_requests!inner (
          user_id
        )
      `)
      .eq('id', offerId)
      .single()

    if (offerError || !offer) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      )
    }

    // Check if the offer belongs to the current user
    if (offer.member_car_requests.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to respond to this offer' },
        { status: 403 }
      )
    }

    // Check if the offer has already been responded to
    if (offer.accepted !== null) {
      return NextResponse.json(
        { error: 'Offer has already been responded to' },
        { status: 400 }
      )
    }

    // Update the offer with the user's response
    const { error: updateError } = await supabase
      .from('offers')
      .update({
        accepted,
        responded_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', offerId)

    if (updateError) {
      console.error('Error updating offer:', updateError)
      return NextResponse.json(
        { error: 'Failed to update offer response' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: accepted ? 'Offer accepted successfully' : 'Offer declined successfully'
    })

  } catch (error) {
    console.error('Error in offer response API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}