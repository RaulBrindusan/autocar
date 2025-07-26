"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Settings, Shield } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { UserProfile } from "@/lib/auth-utils"

export function UserMenu() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  useEffect(() => {
    const supabase = createClient()
    
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setLoading(false)
      setError('Supabase not configured')
      return
    }

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        // If user exists, fetch their profile to get role
        if (user) {
          console.log('Authenticated user ID:', user.id) // Debug log
          const { data: profile, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single()
          
          if (profileError) {
            console.error('Error fetching user profile:', {
              message: profileError.message,
              code: profileError.code,
              details: profileError.details,
              hint: profileError.hint
            })
            
            // If user doesn't exist in users table, create them
            if (profileError.code === 'PGRST116') { // No rows returned
              console.log('User not found in users table, creating...') // Debug log
              try {
                const { data: newProfile, error: insertError } = await supabase
                  .from("users")
                  .insert({
                    id: user.id,
                    email: user.email!,
                    full_name: user.user_metadata?.full_name || null,
                    phone: user.user_metadata?.phone || null,
                    role: 'user'
                  })
                  .select()
                  .single()
                
                if (insertError) {
                  console.error('Error creating user profile:', insertError)
                  // Set a basic profile even if insert fails
                  setUserProfile({
                    id: user.id,
                    email: user.email!,
                    full_name: user.user_metadata?.full_name || null,
                    phone: user.user_metadata?.phone || null,
                    role: 'user',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  })
                } else {
                  console.log('Created new user profile:', newProfile)
                  setUserProfile(newProfile)
                }
              } catch (insertErr) {
                console.error('Error inserting user:', insertErr)
                // Set a basic profile as fallback
                setUserProfile({
                  id: user.id,
                  email: user.email!,
                  full_name: user.user_metadata?.full_name || null,
                  phone: user.user_metadata?.phone || null,
                  role: 'user',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
              }
            } else {
              // For other errors, set a basic profile
              setUserProfile({
                id: user.id,
                email: user.email!,
                full_name: user.user_metadata?.full_name || null,
                phone: user.user_metadata?.phone || null,
                role: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
            }
          } else {
            console.log('Fetched user profile:', profile) // Debug log
            setUserProfile(profile)
          }
        }
        setLoading(false)
      } catch (err) {
        console.error('Error getting user:', err)
        setLoading(false)
      }
    }

    getUser()
    
    // Fallback timeout to ensure loading doesn't hang
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 5000)

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setUserProfile(null) // Reset profile when auth changes
        setLoading(false) // Ensure loading stops on auth change
      }
    )

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/login')
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }

  // Show login/signup buttons even if Supabase has errors
  if (error) {
    return (
      <div className="hidden md:flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="text-blue-100 border-blue-100 hover:bg-blue-700 hover:text-white"
        >
          <a href="/login">Conectează-te</a>
        </Button>
        <Button
          size="sm"
          asChild
          className="bg-white text-blue-600 hover:bg-gray-100"
        >
          <a href="/signup">Creează Cont</a>
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-sm text-blue-100">
        Loading...
      </div>
    )
  }

  if (user) {
    return (
      <div className="hidden md:flex items-center space-x-2">
        <span className="text-sm text-blue-100">
          {userProfile?.full_name || user.email}
        </span>
        
        
        {/* Dashboard Link - different for admin vs user */}
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            console.log('UserProfile:', userProfile) // Debug log
            console.log('Role:', userProfile?.role) // Debug log
            
            // If profile isn't loaded yet, try to fetch it again
            let currentProfile = userProfile
            if (!currentProfile && user) {
              console.log('Profile not loaded, fetching...') // Debug log
              try {
                const supabase = createClient()
                const { data: profile } = await supabase
                  .from("users")
                  .select("*")
                  .eq("id", user.id)
                  .single()
                
                if (profile) {
                  setUserProfile(profile)
                  currentProfile = profile
                  console.log('Fetched profile on click:', profile) // Debug log
                }
              } catch (err) {
                console.error('Error fetching profile on click:', err)
              }
            }
            
            const targetPath = currentProfile?.role === 'admin' ? '/admin' : '/dashboard'
            console.log('Redirecting to:', targetPath) // Debug log
            router.push(targetPath)
          }}
          className="text-blue-100 border-blue-100 hover:bg-blue-700 hover:text-white"
        >
          <Settings className="h-4 w-4 mr-1" />
          Cont
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="text-blue-100 border-blue-100 hover:bg-blue-700 hover:text-white"
        >
          Deconectează-te
        </Button>
      </div>
    )
  }

  return (
    <div className="hidden md:flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        asChild
        className="text-blue-100 border-blue-100 hover:bg-blue-700 hover:text-white"
      >
        <a href="/login">Conectează-te</a>
      </Button>
      <Button
        size="sm"
        asChild
        className="bg-white text-blue-600 hover:bg-gray-100"
      >
        <a href="/signup">Creează Cont</a>
      </Button>
    </div>
  )
}