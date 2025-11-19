'use client'

import { useEffect } from 'react'
import { Mixpanel } from '@/lib/mixpanel'

/**
 * Mixpanel Analytics Provider
 *
 * Initializes Mixpanel Analytics on component mount.
 * Uses singleton pattern to ensure initialization happens only once.
 *
 * Usage for tracking events anywhere in your app:
 * import { Mixpanel } from '@/lib/mixpanel'
 * Mixpanel.trackEvent('Button Clicked', { button_name: 'signup' })
 */
export function MixpanelProvider() {
  useEffect(() => {
    // Initialize Mixpanel singleton
    // This will only init once due to singleton pattern
    Mixpanel.pageViewed()
  }, [])

  return null
}
