import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const code = searchParams.get('code')
  const redirect_to = searchParams.get('redirect_to')
  const next = searchParams.get('next') ?? redirect_to ?? '/dashboard'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })
    
    if (!error) {
      // redirect user to specified redirect URL or dashboard
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // Handle OAuth callback
  if (code) {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // redirect user to specified redirect URL or dashboard
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // redirect the user to an error page with instructions
  return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
}