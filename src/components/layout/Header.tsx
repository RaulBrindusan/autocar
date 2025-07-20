"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Car, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { UserMenu } from "@/components/auth/UserMenu"

const navigation = [
  { name: "Acasă", href: "/" },
  { name: "Comandă Mașină", href: "/request-car" },
  { name: "Trimite OpenLane", href: "/submit-openlane" },
  { name: "Calculator Costuri", href: "/estimate" },
  { name: "Despre Noi", href: "/about" },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-blue-600 border-b border-blue-700 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">AutoCar</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
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

          {/* User Menu */}
          <div className="hidden md:flex">
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-700">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "text-white bg-blue-700"
                      : "text-blue-100 hover:text-white hover:bg-blue-700"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                <UserMenu />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}