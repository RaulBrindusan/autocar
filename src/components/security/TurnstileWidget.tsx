"use client"

import { useEffect, useRef, useState } from 'react'

interface TurnstileWidgetProps {
  siteKey: string
  onSuccess: (token: string) => void
  onError?: () => void
  onExpired?: () => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact'
  className?: string
}

// Extend the Window interface to include turnstile
declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement | string,
        options: {
          sitekey: string
          callback: (token: string) => void
          'error-callback'?: () => void
          'expired-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
          size?: 'normal' | 'compact'
        }
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
      getResponse: (widgetId?: string) => string
    }
  }
}

export function TurnstileWidget({
  siteKey,
  onSuccess,
  onError,
  onExpired,
  theme = 'auto',
  size = 'normal',
  className = ''
}: TurnstileWidgetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [widgetId, setWidgetId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load Cloudflare Turnstile script if not already loaded
    if (!window.turnstile) {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      script.defer = true
      script.onload = () => setIsLoaded(true)
      script.onerror = () => setError('Failed to load Turnstile')
      document.head.appendChild(script)
    } else {
      setIsLoaded(true)
    }

    return () => {
      // Cleanup widget on unmount
      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId)
      }
    }
  }, [widgetId])

  useEffect(() => {
    if (isLoaded && ref.current && window.turnstile && !widgetId) {
      try {
        const id = window.turnstile.render(ref.current, {
          sitekey: siteKey,
          callback: onSuccess,
          'error-callback': onError || (() => setError('Turnstile verification failed')),
          'expired-callback': onExpired || (() => setError('Turnstile token expired')),
          theme,
          size,
        })
        setWidgetId(id)
      } catch (err) {
        console.error('Turnstile render error:', err)
        setError('Failed to initialize security verification')
      }
    }
  }, [isLoaded, siteKey, onSuccess, onError, onExpired, theme, size, widgetId])

  const reset = () => {
    if (widgetId && window.turnstile) {
      window.turnstile.reset(widgetId)
      setError(null)
    }
  }

  if (error) {
    return (
      <div className={`p-4 border border-red-200 bg-red-50 rounded-lg ${className}`}>
        <div className="flex items-center justify-between">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={reset}
            className="text-red-600 hover:text-red-800 text-sm underline"
          >
            Încearcă din nou
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div ref={ref} />
      {!isLoaded && (
        <div className="flex items-center justify-center p-4 border border-gray-200 bg-gray-50 rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 text-sm">Se încarcă verificarea de securitate...</span>
        </div>
      )}
    </div>
  )
}

// Hook for managing Turnstile state
export function useTurnstile() {
  const [token, setToken] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSuccess = (turnstileToken: string) => {
    setToken(turnstileToken)
    setIsVerified(true)
    setError(null)
  }

  const handleError = () => {
    setToken(null)
    setIsVerified(false)
    setError('Verificarea de securitate a eșuat')
  }

  const handleExpired = () => {
    setToken(null)
    setIsVerified(false)
    setError('Verificarea de securitate a expirat')
  }

  const reset = () => {
    setToken(null)
    setIsVerified(false)
    setError(null)
  }

  return {
    token,
    isVerified,
    error,
    handleSuccess,
    handleError,
    handleExpired,
    reset
  }
}