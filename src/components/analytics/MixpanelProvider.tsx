'use client'

import { useEffect, useState } from 'react'

/**
 * Mixpanel Analytics Provider
 *
 * Initializes Mixpanel Analytics with autocapture and session replay.
 * This component must be client-side only as Mixpanel requires browser APIs.
 *
 * Features:
 * - Autocapture: Automatically tracks user interactions (clicks, form submissions, etc.)
 * - Session Replay: Records 100% of user sessions for debugging and analysis
 * - EU Data Residency: Uses EU API endpoint for GDPR compliance
 * - Event Tracking: Custom event tracking available via window.mixpanel
 *
 * Usage for custom events:
 * import mixpanel from 'mixpanel-browser'
 * mixpanel.track('Button Clicked', { button_name: 'signup' })
 */
export function MixpanelProvider() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Only run in the browser after component is mounted
    if (!isMounted || typeof window === 'undefined') {
      return
    }

    const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN

    if (!token) {
      console.warn('Mixpanel Analytics: NEXT_PUBLIC_MIXPANEL_TOKEN is not set')
      return
    }

    // Dynamically import Mixpanel to avoid SSR issues
    import('mixpanel-browser').then((mixpanel) => {
      // Initialize Mixpanel with autocapture and session replay
      mixpanel.default.init(token, {
        // Enable autocapture for automatic event tracking
        autocapture: true,
        // Record 100% of sessions for replay
        record_sessions_percent: 100,
        // Use EU API endpoint for GDPR compliance
        api_host: 'https://api-eu.mixpanel.com',
        // Track pageviews automatically
        track_pageview: true,
        // Enable persistence for cross-session tracking
        persistence: 'localStorage',
        // Log events in development
        debug: process.env.NODE_ENV === 'development',
      })

      console.log('Mixpanel Analytics initialized with token:', token)
    }).catch((error) => {
      console.error('Failed to initialize Mixpanel Analytics:', error)
    })
  }, [isMounted])

  return null
}
