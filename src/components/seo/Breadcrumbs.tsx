'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { usePathname } from 'next/navigation'

/**
 * Breadcrumb Navigation Component with Structured Data
 *
 * Provides visual breadcrumb navigation and JSON-LD schema markup.
 * Improves UX and SEO by showing page hierarchy.
 *
 * @see https://schema.org/BreadcrumbList
 * @see https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
 *
 * SECURITY: dangerouslySetInnerHTML safe - pathname from Next.js router, not user input
 */

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
}

// Default breadcrumb mappings for routes
const routeLabels: Record<string, string> = {
  '/': 'Acasă',
  '/masini-la-comanda': 'Mașini la Comandă',
  '/calculator': 'Calculator Import',
  '/stoc': 'Stoc Mașini',
  '/dashboard': 'Dashboard',
  '/politica-de-confidentialitate': 'Politica de Confidențialitate',
  '/politica-de-cookies': 'Politica de Cookies',
  '/gdpr': 'GDPR',
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Generate breadcrumbs from pathname if not provided
  const breadcrumbs = items || generateBreadcrumbs(pathname)

  // Generate JSON-LD schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://automode.ro${item.href}`
    }))
  }

  // Don't show breadcrumbs on homepage
  if (pathname === '/') return null

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Visual Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center space-x-2 text-sm ${className}`}
      >
        <Link
          href="/"
          className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <Home className="h-4 w-4" />
          <span className="sr-only">Acasă</span>
        </Link>

        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <div key={item.href} className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              {isLast ? (
                <span className="text-gray-900 dark:text-white font-medium">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </div>
          )
        })}
      </nav>
    </>
  )
}

/**
 * Generate breadcrumbs from pathname
 */
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // Skip homepage
  if (pathname === '/') return []

  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  segments.forEach((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/')
    const label = routeLabels[path] || segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    breadcrumbs.push({
      label,
      href: path
    })
  })

  return breadcrumbs
}
