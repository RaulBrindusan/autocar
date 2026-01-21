"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Menu, X, Settings, LogOut, User, Mail, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { LanguageToggle } from "@/components/ui/LanguageToggle"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"

export function Header() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  const navigation = [
    { name: 'Mașini la Comandă', href: "/masini-la-comanda" },
    { name: 'Stoc', href: "/stoc" },
    { name: t('header.nav.calculator'), href: "/calculator" },
  ]
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      setMobileMenuOpen(false)
      router.push('/login')
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }

  const handleAccountClick = () => {
    setMobileMenuOpen(false)
    router.push('/dashboard')
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 h-16 transition-all duration-300",
          "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700",
          "backdrop-blur-md border-b",
          scrolled
            ? "border-white/10 shadow-lg shadow-blue-900/20"
            : "border-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto h-full px-4 lg:px-8" aria-label="Top">
          <div className="flex w-full items-center justify-between h-full">
            {/* Logo */}
            <div className="flex items-center relative z-10">
              <Link
                href="/"
                className="flex items-center group"
              >
                <Image
                  src="/AUTO.svg"
                  alt="AutoMode"
                  width={336}
                  height={134}
                  className="block h-34 w-auto -my-6 relative z-10 transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                    "hover:bg-white/10",
                    pathname === item.href
                      ? "text-white bg-white/15"
                      : "text-blue-100 hover:text-white"
                  )}
                >
                  <span className="relative z-10">{item.name}</span>
                  {pathname === item.href && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex md:items-center md:space-x-2">
              <div className="flex items-center space-x-1 bg-white/10 rounded-full p-1">
                <LanguageToggle />
                {!user && <ThemeToggle />}
              </div>
              {user && (
                <div className="flex items-center space-x-1 ml-2">
                  <Button
                    onClick={handleAccountClick}
                    variant="ghost"
                    size="sm"
                    className="text-blue-100 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
                  >
                    <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center mr-2">
                      <User className="h-4 w-4" />
                    </div>
                    {t('header.user.my_account')}
                  </Button>
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    size="sm"
                    className="text-blue-100 hover:text-white hover:bg-red-500/20 rounded-full transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('header.user.sign_out')}
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile hamburger menu */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  "p-2.5 rounded-full transition-all duration-300",
                  "bg-white/10 hover:bg-white/20",
                  "active:scale-95"
                )}
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={cn(
            "fixed top-0 left-0 h-full w-80 shadow-2xl transform transition-transform duration-300 ease-out z-50",
            "bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <div className="flex items-center">
              <Image
                src="/AUTO.svg"
                alt="Automode"
                width={200}
                height={80}
                className="block h-20 w-auto"
              />
            </div>
            <div className="flex items-center space-x-2">
              <LanguageToggle className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex flex-col h-[calc(100%-5rem)] overflow-y-auto">
            {/* User Section */}
            {user && (
              <div className="p-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        Bun venit!
                      </p>
                      <div className="flex items-center text-xs text-blue-100 truncate">
                        <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={handleAccountClick}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200"
                    >
                      <span className="flex items-center">
                        <Settings className="h-4 w-4 mr-3" />
                        {t('header.user.my_account')}
                      </span>
                      <ChevronRight className="h-4 w-4 opacity-60" />
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-all duration-200"
                    >
                      <span className="flex items-center">
                        <LogOut className="h-4 w-4 mr-3" />
                        {t('header.user.sign_out')}
                      </span>
                      <ChevronRight className="h-4 w-4 opacity-60" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-4">
              <p className="px-3 mb-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Navigație
              </p>
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-4 py-3.5 text-base font-medium rounded-xl transition-all duration-200",
                      pathname === item.href
                        ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.name}</span>
                    <ChevronRight className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      pathname === item.href ? "text-blue-500" : "text-gray-400"
                    )} />
                  </Link>
                ))}
              </div>
            </nav>

            {/* Footer branding */}
            <div className="p-4 mt-auto border-t border-gray-200/50 dark:border-gray-700/50">
              <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                © 2024 AutoMode
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}