"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Menu, X, Settings, LogOut, User, Mail } from "lucide-react"
import { useState } from "react"
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

  const navigation = [
    { name: t('header.nav.calculator'), href: "/calculator" },
  ]
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    // Dashboard page removed during Firebase migration
    router.push('/')
  }

  return (
    <>
      <header className="bg-blue-600 border-b border-blue-700 shadow-sm h-16 relative">
        <nav className="max-w-7xl mx-auto h-full" aria-label="Top">
          <div className="flex w-full items-center justify-between h-full">
            {/* Logo - moved to left */}
            <div className="flex items-center pl-4 md:pl-0 relative z-10">
              <Link href="/" className="flex items-center">
                <Image
                  src="/AUTO.svg"
                  alt="AutoMode"
                  width={336}
                  height={134}
                  className="block h-34 w-auto -my-6 relative z-10"
                  priority
                />
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
            <div className="hidden md:flex md:items-center md:space-x-2">
              <LanguageToggle />
              {!user && <ThemeToggle />}
              {user ? (
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleAccountClick}
                    variant="ghost"
                    size="sm"
                    className="text-blue-100 hover:text-white"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {t('header.user.my_account')}
                  </Button>
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    size="sm"
                    className="text-blue-100 hover:text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('header.user.sign_out')}
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-blue-100 hover:text-white">
                    {t('header.user.sign_in')}
                  </Button>
                </Link>
              )}
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
            "fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Image
                src="/AUTO.svg"
                alt="Automode"
                width={280}
                height={112}
                className="block h-28 w-auto"
              />
            </div>
            <div className="flex items-center space-x-2">
              <LanguageToggle className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex flex-col h-full">
            {/* User Section - Moved higher */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              {user ? (
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        User
                      </p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Mail className="h-3 w-3 mr-1" />
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={handleAccountClick}
                      className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      {t('header.user.my_account')}
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      {t('header.user.sign_out')}
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
                    {t('header.user.sign_in')}
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
                        ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700"
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