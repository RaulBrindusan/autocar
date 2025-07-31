import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client with admin privileges using the service role key.
 * This client bypasses Row Level Security (RLS) and should only be used in
 * trusted server environments for administrative operations.
 * 
 * @returns Supabase client with admin privileges
 * @throws Error if required environment variables are missing
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }

  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Please add your service role key to the environment variables.')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}