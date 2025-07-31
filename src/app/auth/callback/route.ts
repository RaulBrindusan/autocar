import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const code = searchParams.get('code')
  const redirect_to = searchParams.get('redirect_to')

  async function getRedirectPath(supabase: any) {
    if (redirect_to) return redirect_to
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: userRole } = await supabase
          .rpc('get_user_role', { user_id: user.id })
        
        return userRole === 'admin' ? '/admin' : '/dashboard'
      }
    } catch (error) {
      console.error('Error getting user role in callback:', error)
    }
    
    return '/dashboard'
  }

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })
    
    if (!error) {
      // For email confirmations, redirect to confirmation page
      if (type === 'signup') {
        return NextResponse.redirect(new URL('/auth/confirmation', request.url))
      }
      
      // For other types (password reset, etc.), redirect normally
      const redirectPath = await getRedirectPath(supabase)
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
  }

  // Handle OAuth callback
  if (code) {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const redirectPath = await getRedirectPath(supabase)
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
  }

  // redirect the user to an error page with instructions
  return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
}