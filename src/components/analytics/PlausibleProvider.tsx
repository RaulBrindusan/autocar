'use client'

import { useEffect } from 'react'
import { init } from '@plausible-analytics/tracker'

/**
 * Plausible Analytics Provider
 *
 * Initializes Plausible Analytics for the application.
 * This component must be client-side only as Plausible requires browser APIs.
 *
 * Configuration:
 * - Auto-captures pageviews in SPA navigation
 * - Supports hash-based routing (Next.js App Router)
 * - Does not track on localhost by default
 * - Tracks outbound links and file downloads
 */
export function PlausibleProvider() {
  useEffect(() => {
    const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

    if (!domain) {
      console.warn('Plausible Analytics: NEXT_PUBLIC_PLAUSIBLE_DOMAIN is not set')
      return
    }

    // Initialize Plausible Analytics
    init({
      domain,
      // Auto-capture pageviews for SPA navigation
      autoCapturePageviews: true,
      // Support hash-based routing (Next.js App Router compatibility)
      hashBasedRouting: false,
      // Track outbound link clicks
      outboundLinks: true,
      // Track file downloads
      fileDownloads: true,
      // Track form submissions
      formSubmissions: false,
      // Don't track on localhost
      captureOnLocalhost: false,
      // Log ignored events in development
      logging: process.env.NODE_ENV === 'development',
      // Bind to window for installation verification
      bindToWindow: true,
    })

    console.log('Plausible Analytics initialized for domain:', domain)
  }, [])

  return null
}
