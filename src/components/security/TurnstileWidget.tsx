"use client"

import { useEffect, useRef, useState } from 'react'

interface TurnstileWidgetProps {
  siteKey: string
  onSuccess: (token: string) => void
  onError?: (error?: string) => void
  onExpired?: () => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact'
  className?: string
  enableFallback?: boolean
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
          'error-callback'?: (error?: string) => void
          'expired-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
          size?: 'normal' | 'compact'
          retry?: 'auto' | 'never'
          'retry-interval'?: number
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
  className = '',
  enableFallback = true
}: TurnstileWidgetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [widgetId, setWidgetId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [showFallback, setShowFallback] = useState(false)

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

  const handleTurnstileError = (errorCode?: string) => {
    console.error('Turnstile error:', errorCode)
    
    if (errorCode === '110200') {
      setError('Configurare domeniu incorectă. Contactați suportul.')
    } else if (errorCode === '110110') {
      setError('Site key invalid. Contactați suportul.')
    } else {
      setError('Verificarea de securitate a eșuat')
    }
    
    // After 3 failed attempts or specific errors, show fallback
    if (enableFallback && (retryCount >= 2 || errorCode === '110200' || errorCode === '110110')) {
      setTimeout(() => {
        setShowFallback(true)
      }, 5000) // Show fallback after 5 seconds
    }
    
    setRetryCount(prev => prev + 1)
    onError?.(errorCode)
  }

  useEffect(() => {
    if (isLoaded && ref.current && window.turnstile && !widgetId && !showFallback) {
      try {
        const id = window.turnstile.render(ref.current, {
          sitekey: siteKey,
          callback: onSuccess,
          'error-callback': handleTurnstileError,
          'expired-callback': onExpired || (() => setError('Token-ul de verificare a expirat')),
          theme,
          size,
          retry: 'auto',
          'retry-interval': 8000
        })
        setWidgetId(id)
        setError(null)
      } catch (err) {
        console.error('Turnstile render error:', err)
        handleTurnstileError('render_failed')
      }
    }
  }, [isLoaded, siteKey, onSuccess, onExpired, theme, size, widgetId, showFallback, retryCount, handleTurnstileError])

  const reset = () => {
    if (widgetId && window.turnstile) {
      window.turnstile.reset(widgetId)
    }
    setError(null)
    setRetryCount(0)
    setShowFallback(false)
  }

  const handleFallbackBypass = () => {
    // Generate a fallback token to indicate manual bypass
    onSuccess('fallback_bypass_token')
    setShowFallback(false)
  }

  if (showFallback) {
    return (
      <div className={`p-4 border border-yellow-200 bg-yellow-50 rounded-lg ${className}`}>
        <div className="text-center">
          <p className="text-yellow-800 text-sm mb-3">
            Verificarea automatică de securitate nu este disponibilă momentan.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleFallbackBypass}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Continuă cu verificare manuală
            </button>
            <button
              onClick={reset}
              className="text-yellow-800 hover:text-yellow-900 text-sm underline"
            >
              Încearcă din nou verificarea automată
            </button>
          </div>
        </div>
      </div>
    )
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
        {retryCount >= 2 && enableFallback && (
          <p className="text-gray-600 text-xs mt-2">
            Verificarea alternativă va fi disponibilă în câteva secunde...
          </p>
        )}
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