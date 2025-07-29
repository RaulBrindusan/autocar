'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Cookie, Settings } from 'lucide-react'

interface CookiePreferences {
  essential: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, can't be disabled
    functional: false,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookie-consent')
    if (!cookieConsent) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    saveCookiePreferences(allAccepted)
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    const essentialOnly = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    }
    saveCookiePreferences(essentialOnly)
    setIsVisible(false)
  }

  const handleSavePreferences = () => {
    saveCookiePreferences(preferences)
    setIsVisible(false)
  }

  const saveCookiePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      preferences: prefs,
      timestamp: new Date().toISOString(),
    }))
    
    // Here you would typically initialize analytics, marketing tools, etc.
    // based on the user's preferences
    if (prefs.analytics) {
      // Initialize Google Analytics or other analytics tools
      console.log('Analytics cookies accepted')
    }
    if (prefs.marketing) {
      // Initialize marketing/advertising tools
      console.log('Marketing cookies accepted')
    }
    if (prefs.functional) {
      // Initialize functional cookies
      console.log('Functional cookies accepted')
    }
  }

  const handlePreferenceChange = (type: keyof CookiePreferences) => {
    if (type === 'essential') return // Can't disable essential cookies
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  if (!isVisible) return null

  // Show settings modal with backdrop
  if (showSettings) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        
        {/* Modal */}
        <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl sm:max-w-lg">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Cookie className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Setări Cookie-uri
                </h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Detailed settings */}
            <div className="mb-6">
              <p className="text-gray-700 text-sm mb-4">
                Personalizați preferințele pentru cookie-uri. Cookie-urile esențiale sunt necesare 
                pentru funcționarea site-ului și nu pot fi dezactivate.
              </p>

              <div className="space-y-4">
                {/* Essential cookies */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">Cookie-uri Esențiale</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Necesare pentru funcționarea de bază a site-ului
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.essential}
                      disabled
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                </div>

                {/* Functional cookies */}
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">Cookie-uri de Funcționalitate</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Salvează preferințele și setările dumneavoastră
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={() => handlePreferenceChange('functional')}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Analytics cookies */}
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">Cookie-uri de Analitics</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Ne ajută să înțelegem cum utilizați site-ul nostru
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={() => handlePreferenceChange('analytics')}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Marketing cookies */}
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">Cookie-uri de Marketing</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Utilizate pentru publicitate personalizată
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={() => handlePreferenceChange('marketing')}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Settings action buttons */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleSavePreferences}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Salvează Preferințele
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Înapoi
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show bottom banner
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 sm:p-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pr-8 sm:pr-0">
            {/* Left side - Message and links */}
            <div className="flex-1">
              <div className="flex items-start space-x-3">
                <Cookie className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-800 text-sm font-medium mb-1">
                    Acest site utilizează cookie-uri
                  </p>
                  <p className="text-gray-600 text-xs">
                    Utilizăm cookie-uri pentru a îmbunătăți experiența dumneavoastră. 
                    Consultați{' '}
                    <Link href="/politica-de-cookies" className="text-blue-600 hover:underline">
                      Politica de Cookie-uri
                    </Link>.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:ml-4">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Setări
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Doar Esențiale
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Acceptă Toate
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}