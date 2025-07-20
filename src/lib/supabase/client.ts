import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Get environment variables - these should now be loaded from .env
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}