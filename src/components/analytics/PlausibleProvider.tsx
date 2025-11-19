'use client'

import Script from 'next/script'

/**
 * Plausible Analytics Provider
 *
 * Loads Plausible Analytics script for privacy-friendly web analytics.
 * Uses the official Plausible script approach with custom tracking code.
 *
 * Features:
 * - Privacy-friendly, cookieless analytics
 * - Auto-captures pageviews
 * - Lightweight script loading
 * - Custom events available via window.plausible()
 *
 * Usage for custom events:
 * window.plausible('signup', { props: { plan: 'premium' } })
 */
export function PlausibleProvider() {
  const scriptUrl = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL

  if (!scriptUrl) {
    return null
  }

  return (
    <>
      <Script
        src={scriptUrl}
        strategy="afterInteractive"
        async
      />
      <Script
        id="plausible-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
            plausible.init()
          `,
        }}
      />
    </>
  )
}
