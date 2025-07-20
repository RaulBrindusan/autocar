"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { User, LogOut, UserCircle } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function UserMenu() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (loading) {
    return <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse" />
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Button asChild variant="ghost" size="sm" className="text-blue-100 hover:text-white border border-white">
          <a href="/login">Conectează-te</a>
        </Button>
        <Button asChild variant="secondary" size="sm">
          <a href="/signup">Înregistrează-te</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors"
      >
        <UserCircle className="h-8 w-8" />
        <span className="hidden md:block text-sm font-medium">
          {user.email?.split('@')[0]}
        </span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Deconectează-te</span>
          </button>
        </div>
      )}
    </div>
  )
}