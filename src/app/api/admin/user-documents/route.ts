import { NextRequest, NextResponse } from 'next/server'
// import { createClient } from '@/lib/supabase/server'

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

    // Verify admin authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has admin role
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Fetch user email from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', userId)
      .single()

    if (userError) {
      console.error('Error fetching user data:', userError)
      return NextResponse.json(
        { error: 'Error fetching user data' },
        { status: 500 }
      )
    }

    // Fetch document data for the specified user
    const { data: documentData, error } = await supabase
      .from('documents')
      .select(`
        localitatea,
        judetul,
        strada,
        nr_strada,
        bl,
        sc,
        etaj,
        apartment,
        serie,
        nr,
        cnp,
        slclep,
        valabilitate
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error fetching document data:', error)
      return NextResponse.json(
        { error: 'Error fetching document data' },
        { status: 500 }
      )
    }

    // Return combined user and document data
    return NextResponse.json({
      success: true,
      userData: userData,
      documentData: documentData || null
    })

  } catch (error) {
    console.error('Error in user-documents API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}