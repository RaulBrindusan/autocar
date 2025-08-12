import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user role
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Execute the auto-reset function
    const { error } = await supabase.rpc('auto_reset_failed_auctions')

    if (error) {
      console.error('Error executing auto-reset:', error)
      return NextResponse.json({ error: 'Failed to execute auto-reset' }, { status: 500 })
    }

    // Get count of requests that were reset
    const { count } = await supabase
      .from('car_requests')
      .select('*', { count: 'exact', head: true })
      .eq('timeline_stage', 'searching')
      .eq('auto_reset_scheduled', false)

    return NextResponse.json({ 
      success: true, 
      message: `Auto-reset completed. ${count || 0} requests were reset to searching state.`
    })

  } catch (error) {
    console.error('Auto-reset error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    // Get pending auto-resets (for monitoring)
    const { data: pendingResets, count } = await supabase
      .from('car_requests')
      .select('id, brand, model, timeline_stage, reset_scheduled_at, auto_reset_scheduled', { count: 'exact' })
      .eq('auto_reset_scheduled', true)
      .eq('timeline_stage', 'purchase_failed')

    return NextResponse.json({
      pending_resets: pendingResets || [],
      count: count || 0
    })

  } catch (error) {
    console.error('Error getting pending resets:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}