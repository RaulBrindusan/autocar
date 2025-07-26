import { createClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@/lib/supabase/client"
import { redirect } from "next/navigation"
import type { User } from "@supabase/supabase-js"

export type UserRole = 'user' | 'admin'

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

// Server-side auth utilities
export async function getCurrentUser() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  return user
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const user = await getCurrentUser()
  
  if (!user) return null
  
  const supabase = await createClient()
  
  // Use our RLS-bypassing function to get the role first
  try {
    const { data: userRole, error: roleError } = await supabase
      .rpc('get_user_role', { user_id: user.id })
    
    if (roleError) {
      console.error('Error getting user role:', roleError)
      return null
    }
    
    // Try to get full profile, but fallback to basic info if RLS blocks it
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()
    
    if (profile && !profileError) {
      return profile
    } else {
      // If RLS blocks the full profile query, construct one from auth user data
      console.log('RLS blocked profile query, using auth user data + role')
      return {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || null,
        phone: user.user_metadata?.phone || null,
        role: userRole as UserRole,
        created_at: user.created_at || '',
        updated_at: user.updated_at || ''
      }
    }
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/login")
  }
  
  return user
}

export async function requireRole(role: UserRole) {
  const user = await requireAuth()
  const profile = await getCurrentUserProfile()
  
  if (!profile || profile.role !== role) {
    redirect("/unauthorized")
  }
  
  return { user, profile }
}

export async function requireAdmin() {
  return requireRole('admin')
}

// Client-side auth utilities
export async function getCurrentUserClient() {
  const supabase = createBrowserClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  return user
}

export async function getCurrentUserProfileClient(): Promise<UserProfile | null> {
  const supabase = createBrowserClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) return null
  
  try {
    // Use RLS-bypassing function first
    const { data: userRole, error: roleError } = await supabase
      .rpc('get_user_role', { user_id: user.id })
    
    if (roleError) {
      console.error('Error getting user role (client):', roleError)
      return null
    }
    
    // Try to get full profile
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()
    
    if (profile && !profileError) {
      return profile
    } else {
      // Fallback to constructed profile
      return {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || null,
        phone: user.user_metadata?.phone || null,
        role: userRole as UserRole,
        created_at: user.created_at || '',
        updated_at: user.updated_at || ''
      }
    }
  } catch (error) {
    console.error('Error in getCurrentUserProfileClient:', error)
    return null
  }
}

export function hasRole(profile: UserProfile | null, role: UserRole): boolean {
  return profile?.role === role
}

export function isAdmin(profile: UserProfile | null): boolean {
  return hasRole(profile, 'admin')
}

export function isUser(profile: UserProfile | null): boolean {
  return hasRole(profile, 'user')
}

// Update user profile
export async function updateUserProfile(updates: Partial<Pick<UserProfile, 'full_name' | 'phone'>>) {
  const supabase = createBrowserClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single()
  
  if (error) throw error
  
  return data
}