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
          const { data: profile } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single()
          
          setUserProfile(profile)
        }
      } catch (err) {
        console.error('Error getting user:', err)
        setError('Authentication error')
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
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
      <div className="flex items-center space-x-2">
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
      <div className="flex items-center space-x-2">
        <span className="text-sm text-blue-100">
          {userProfile?.full_name || user.email}
        </span>
        
        
        {/* Dashboard Link - different for admin vs user */}
        <Button
          variant="outline"
          size="sm"
          asChild
          className="text-blue-100 border-blue-100 hover:bg-blue-700 hover:text-white"
        >
          <a href={userProfile?.role === 'admin' ? '/admin-account' : '/dashboard'}>
            <Settings className="h-4 w-4 mr-1" />
            Cont
          </a>
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
    <div className="flex items-center space-x-2">
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