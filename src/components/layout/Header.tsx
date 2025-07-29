"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Car, Menu, X, Settings, LogOut, User, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { UserMenu } from "@/components/auth/UserMenu"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { UserProfile } from "@/lib/auth-utils"

const navigation = [
  { name: "Calculator Cost", href: "/calculator" },
  { name: "Comandă Mașină", href: "/request-car?tab=car" },
  { name: "Trimite OpenLane", href: "/request-car?tab=openlane" },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  
  useEffect(() => {
    const supabase = createClient()
    
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (user) {
          console.log('Header: Authenticated user ID:', user.id) // Debug log
          
          // Check auth context
          const { data: authCheck } = await supabase.auth.getSession()
          console.log('Header: Auth session exists:', !!authCheck.session)
          
          const { data: profile, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single()
          
          if (profileError) {
            console.error('Header: Error fetching user profile:', {
              code: profileError.code,
              message: profileError.message,
              details: profileError.details,
              hint: profileError.hint
            })
            // Create user if they don't exist
            if (profileError.code === 'PGRST116') {
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
                  console.error('Header: Error creating user profile:', insertError)
                  // Set basic profile as fallback
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
                  setUserProfile(newProfile)
                }
              } catch (insertErr) {
                console.error('Header: Error creating user:', insertErr)
                // Set basic profile as fallback
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
              // For other errors, set basic profile
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
            setUserProfile(profile)
          }
        }
      } catch (err) {
        console.error('Error getting user:', err)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        if (!session?.user) {
          setUserProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setMobileMenuOpen(false)
      router.push('/login')
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }

  const handleAccountClick = async () => {
    let currentProfile = userProfile
    if (!currentProfile && user) {
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
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      }
    }
    
    const targetPath = currentProfile?.role === 'admin' ? '/admin' : '/dashboard'
    setMobileMenuOpen(false)
    router.push(targetPath)
  }

  return (
    <>
      <header className="bg-blue-600 border-b border-blue-700 shadow-sm m-0 p-0">
        <nav className="max-w-7xl mx-auto m-0 p-0" aria-label="Top">
          <div className="flex w-full items-center justify-between py-4">
            {/* Logo - moved to left */}
            <div className="flex items-center pl-4 md:pl-0">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-white">AutoMode</span>
              </Link>
            </div>

            {/* Desktop Navigation - centered */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-blue-200",
                    pathname === item.href
                      ? "text-white"
                      : "text-blue-100"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop User Menu - on the right */}
            <div className="hidden md:flex">
              <UserMenu />
            </div>

            {/* Mobile hamburger menu */}
            <div className="md:hidden pr-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-blue-600 shadow-md hover:shadow-lg transition-shadow"
              >
                <Menu className="h-5 w-5 text-white" />
              </button>
            </div>

          </div>
        </nav>
      </header>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        {/* Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={cn(
            "fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-2 border-b border-gray-200">
            <div className="flex items-center">
              <Image
                src="/logo2.png"
                alt="Automode"
                width={100}
                height={100}
                className="h-24 w-24"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Sidebar Content */}
          <div className="flex flex-col h-full">
            {/* User Section - Moved higher */}
            <div className="border-b border-gray-200 p-4">
              {user ? (
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {userProfile?.full_name || 'User'}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Mail className="h-3 w-3 mr-1" />
                        {user.email}
                      </div>
                      {userProfile?.role === 'admin' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                          Administrator
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={handleAccountClick}
                      className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Contul meu
                    </button>
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Deconectează-te
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Conectează-te
                  </Link>
                  
                  <Link
                    href="/signup"
                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Creează Cont
                  </Link>
                </div>
              )}
            </div>

            {/* Navigation Links - Moved below user section */}
            <nav className="flex-1 px-4 py-6">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "block px-3 py-3 text-base font-medium rounded-lg transition-colors",
                      pathname === item.href
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}