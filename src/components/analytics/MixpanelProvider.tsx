'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Mixpanel } from '@/lib/mixpanel'

/**
 * Mixpanel Analytics Provider
 *
 * Initializes Mixpanel Analytics and tracks page views on route changes.
 * Must be placed inside the app layout to track all navigation.
 *
 * Usage for tracking events anywhere in your app:
 * import { Mixpanel } from '@/lib/mixpanel'
 * Mixpanel.trackEvent('Button Clicked', { button_name: 'signup' })
 */
export function MixpanelProvider() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirstRender = useRef(true)
  const previousPathname = useRef<string | null>(null)

  // Track page views on route changes
  useEffect(() => {
    // Skip if pathname hasn't changed (prevents double tracking)
    if (previousPathname.current === pathname) {
      return
    }

    previousPathname.current = pathname

    // Track page view
    // Small delay to ensure page title is updated
    const timeoutId = setTimeout(() => {
      Mixpanel.trackPageView(pathname)
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [pathname, searchParams])

  return null
}
