// import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { signature } = body

    if (!signature) {
      return NextResponse.json(
        { error: 'Signature data is required' },
        { status: 400 }
      )
    }

    // Update contract with signature
    const { data, error } = await supabase
      .from('contracte')
      .update({
        prestator_signature: signature,
        prestator_signed_at: new Date().toISOString(),
        prestator_signed_by: user.id,
        status: 'semnat'
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save signature' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      contract: data
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Remove signature from contract
    const { data, error } = await supabase
      .from('contracte')
      .update({
        prestator_signature: null,
        prestator_signed_at: null,
        prestator_signed_by: null
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to remove signature' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      contract: data
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}