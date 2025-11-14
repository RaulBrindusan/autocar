"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/LanguageContext"
import { 
  LayoutDashboard,
  Car, 
  FileText, 
  Calculator,
  Menu,
  X,
  LogOut,
  User,
  Bell,
  Gift
} from "lucide-react"
// import { createClient } from "@/lib/supabase/client"
// import type { User as SupabaseUser } from "@supabase/supabase-js"
// import type { UserProfile } from "@/lib/auth-utils"
import { LogoutConfirmModal } from "@/components/ui/LogoutConfirmModal"

interface SidebarItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  count?: number
}


interface UserSidebarProps {
  children: React.ReactNode
}

export function UserSidebar({ children }: UserSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()

  const sidebarItems: SidebarItem[] = [
    {
      name: t('sidebar.dashboard'),
      href: "/dashboard",
      icon: LayoutDashboard
    },
    {
      name: t('sidebar.car_requests'),
      href: "/dashboard/cereri-masini",
      icon: Car
    },
    {
      name: "Oferte",
      href: "/dashboard/oferte",
      icon: Gift
    },
    {
      name: t('sidebar.calculator'),
      href: "/dashboard/calculator",
      icon: Calculator
    },
    {
      name: t('sidebar.contracts'),
      href: "/dashboard/contracte",
      icon: FileText
    }
  ]

  useEffect(() => {
    const supabase = createClient()
    
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (user) {
          const { data: profile } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single()
          
          if (profile) {
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

  const handleSignOutClick = () => {
    setShowLogoutModal(true)
  }

  const handleConfirmSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setSidebarOpen(false)
      setShowLogoutModal(false)
      router.push('/')
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }

  const handleCancelSignOut = () => {
    setShowLogoutModal(false)
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Mobile menu button */}
      <div className="lg:hidden absolute top-4 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Menu className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-600 to-blue-700 shadow-2xl transform transition-all duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-4 pt-4 space-y-2 overflow-y-auto relative">
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-2 right-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 z-10"
            >
              <X className="h-4 w-4" />
            </button>
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-white/10 text-white shadow-lg' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="relative">
                    <Icon className={`h-6 w-6 ${isActive ? 'text-white drop-shadow-sm' : 'text-white/80 drop-shadow-sm group-hover:text-white'}`} />
                  </div>
                  <span className={`text-base font-medium drop-shadow-sm ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                    {item.name}
                  </span>
                  {item.count && (
                    <span className="ml-auto bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
                      {item.count}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-blue-500/20 p-4">
            {/* User Info */}
            {user && (
              <div className="mb-3 relative">
                <div className="relative p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white font-semibold text-xs drop-shadow-sm">
                        {(userProfile?.full_name || user.email?.split('@')[0] || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate drop-shadow-sm">
                        {userProfile?.full_name || user.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-white/70 truncate drop-shadow-sm">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Logout Button */}
            <button 
              onClick={handleSignOutClick}
              className="group w-full flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white rounded-lg transition-all duration-200 hover:bg-white/10"
            >
              <div className="relative">
                <LogOut className="h-5 w-5 text-white/80 group-hover:text-white drop-shadow-sm" />
              </div>
              <span className="text-sm font-medium drop-shadow-sm">{t('sidebar.logout')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Content */}
        <main className="px-2 pb-2 lg:px-4 lg:pb-4">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleConfirmSignOut}
        onCancel={handleCancelSignOut}
      />
    </div>
  )
}