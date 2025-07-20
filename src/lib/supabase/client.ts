import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Fallback values for missing environment variables during build
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Missing Supabase environment variables. Using placeholder values.')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}