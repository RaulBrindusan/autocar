'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'

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


export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname()
  const { theme } = useTheme()
  const { t } = useLanguage()
  const isDark = theme === 'dark'

  const linkColor = isDark ? '#d1d5db' : '#374151'
  const linkHoverColor = isDark ? '#ffffff' : '#111827'
  const chevronColor = isDark ? '#6b7280' : '#9ca3af'
  const activeColor = isDark ? '#ffffff' : '#111827'

  const routeLabels: Record<string, string> = {
    '/': t('breadcrumbs.home'),
    '/masini-la-comanda': t('breadcrumbs.masini_la_comanda'),
    '/calculator': t('breadcrumbs.calculator'),
    '/stoc': t('breadcrumbs.stoc'),
    '/dashboard': t('breadcrumbs.dashboard'),
    '/dashboard/cereri': t('breadcrumbs.cereri'),
    '/dashboard/analitice': t('breadcrumbs.analitice'),
    '/politica-de-confidentialitate': t('breadcrumbs.confidentialitate'),
    '/politica-de-cookies': t('breadcrumbs.cookies'),
    '/gdpr': t('breadcrumbs.gdpr'),
  }

  const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    if (pathname === '/') return []
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []
    segments.forEach((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/')
      const label = routeLabels[path] || segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      breadcrumbs.push({ label, href: path })
    })
    return breadcrumbs
  }

  // Check if we're in a dashboard page
  const isDashboardPage = pathname.startsWith('/dashboard')
  const homeHref = isDashboardPage ? '/dashboard' : '/'
  const homeLabel = isDashboardPage ? t('breadcrumbs.dashboard') : t('breadcrumbs.home')

  // Generate breadcrumbs from pathname if not provided
  let breadcrumbs = items || generateBreadcrumbs(pathname)

  // If on dashboard pages, filter out the "Dashboard" breadcrumb
  if (isDashboardPage && breadcrumbs.length > 0) {
    breadcrumbs = breadcrumbs.filter(item => item.href !== '/dashboard')
  }

  // Generate JSON-LD schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": homeLabel,
        "item": `https://automode.ro${homeHref}`
      },
      ...breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": `https://automode.ro${item.href}`
      }))
    ]
  }

  // Don't show breadcrumbs on homepage or main dashboard
  if (pathname === '/' || pathname === '/dashboard') return null

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
          href={homeHref}
          className="flex items-center transition-colors"
          style={{ color: linkColor }}
          onMouseEnter={e => (e.currentTarget.style.color = linkHoverColor)}
          onMouseLeave={e => (e.currentTarget.style.color = linkColor)}
        >
          <Home className="h-4 w-4" />
          <span className="sr-only">{homeLabel}</span>
        </Link>

        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <div key={item.href} className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4" style={{ color: chevronColor }} />
              {isLast ? (
                <span className="font-medium" style={{ color: activeColor }}>
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors"
                  style={{ color: linkColor }}
                  onMouseEnter={e => (e.currentTarget.style.color = linkHoverColor)}
                  onMouseLeave={e => (e.currentTarget.style.color = linkColor)}
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

