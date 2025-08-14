import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Generate nonce for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/') &&
    !request.nextUrl.pathname.startsWith('/estimate') &&
    !request.nextUrl.pathname.startsWith('/about')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Add security headers
  const isDev = process.env.NODE_ENV === 'development'
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ''} https://unpkg.com https://cdn.jsdelivr.net;
    style-src 'self' 'nonce-${nonce}' ${isDev ? "'unsafe-inline'" : ''} https://fonts.googleapis.com;
    img-src 'self' blob: data: https: *.supabase.co *.unsplash.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' *.supabase.co wss://*.supabase.co;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()

  // Set security headers
  supabaseResponse.headers.set('X-Nonce', nonce)
  supabaseResponse.headers.set('Content-Security-Policy', cspHeader)
  supabaseResponse.headers.set('X-Frame-Options', 'DENY')
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  supabaseResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  return supabaseResponse
}