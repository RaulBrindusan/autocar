import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Get environment variables - these should now be loaded from .env
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // During build time, use placeholder values to prevent build errors
    if (typeof window === 'undefined') {
      console.warn('Missing Supabase environment variables during build time. Using placeholders.')
      return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key')
    }
    throw new Error('Missing Supabase environment variables. Please check your .env file.')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}