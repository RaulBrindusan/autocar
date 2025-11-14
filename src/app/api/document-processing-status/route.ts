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

    // Verify user authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if there's a processed document for this user
    const { data: documentData, error } = await supabase
      .from('documents')
      .select('id, processed_at, created_at, file_name')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error checking document processing status:', error)
      return NextResponse.json(
        { error: 'Error checking processing status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      hasProcessedDocument: !!documentData,
      documentInfo: documentData || null
    })

  } catch (error) {
    console.error('Error in document-processing-status API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}