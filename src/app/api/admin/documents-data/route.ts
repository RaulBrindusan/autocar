import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acces interzis - doar pentru administratori' },
        { status: 403 }
      )
    }

    // Fetch documents with extracted data
    const { data: documents, error } = await supabase
      .from('documents')
      .select(`
        *,
        users:user_id (
          id,
          email,
          full_name
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching documents data:', error)
      return NextResponse.json(
        { error: 'Eroare la încărcarea datelor documentelor' },
        { status: 500 }
      )
    }

    return NextResponse.json({ documents })

  } catch (error) {
    console.error('Error in documents data API:', error)
    return NextResponse.json(
      { error: 'Eroare server' },
      { status: 500 }
    )
  }
}