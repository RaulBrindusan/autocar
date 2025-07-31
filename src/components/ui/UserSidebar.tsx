"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard,
  Car, 
  FileText, 
  Calculator,
  Menu,
  X,
  LogOut,
  User
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { UserProfile } from "@/lib/auth-utils"
import { LogoutConfirmModal } from "@/components/ui/LogoutConfirmModal"

interface SidebarItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  count?: number
}

const sidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    name: "Cereri Mașini",
    href: "/dashboard/cereri-masini",
    icon: Car
  },
  {
    name: "Calculator Costuri",
    href: "/dashboard/calculator",
    icon: Calculator
  },
  {
    name: "Contracte",
    href: "/dashboard/contracte",
    icon: FileText
  }
]

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile menu button */}
      <div className="lg:hidden absolute top-4 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="bg-blue-600 p-2 rounded-lg shadow-md"
        >
          <Menu className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center justify-center w-full">
              <Image
                src="/logo.png"
                alt="Automode Logo"
                width={192}
                height={192}
                className="rounded-lg -my-16"
              />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.name}</span>
                  {item.count && (
                    <span className="ml-auto bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            {/* User Info */}
            {user && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">
                  {userProfile?.full_name || user.email}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            )}
            
            {/* Logout Button */}
            <button 
              onClick={handleSignOutClick}
              className="w-full flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 text-gray-400" />
              <span className="font-medium">Ieșire</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile spacing */}
        <div className="lg:hidden h-2" />
        
        {/* Content */}
        <main className="p-2 lg:p-8">
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