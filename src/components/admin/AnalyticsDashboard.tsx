"use client"

import { useEffect, useState } from "react"
import { BarChart3, Users, Eye, TrendingUp, Calendar, Globe, Smartphone, Mouse, Activity, Monitor, Chrome, Languages, UserCheck, Wifi } from "lucide-react"

interface AnalyticsData {
  visitors: number
  pageviews: number
  sessions: number
  bounceRate: number
  avgSessionTime: string
  activeUsers: number
  topPages: Array<{ page: string; views: number; visitors: number }>
  topReferrers: Array<{ referrer: string; visitors: number; views: number }>
  deviceTypes: Array<{ device: string; percentage: number; visitors: number }>
  browsers: Array<{ browser: string; percentage: number; visitors: number }>
  operatingSystems: Array<{ os: string; percentage: number; visitors: number }>
  languages: Array<{ language: string; percentage: number; visitors: number }>
  countries: Array<{ country: string; visitors: number; flag: string }>
  events: Array<{ event: string; count: number }>
  pageviewsTimeSeries: Array<{ x: string; y: number }>
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d')
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper function to generate SVG path from time series data
  const generateSVGPath = (data: Array<{ x: string; y: number }>) => {
    if (!data || data.length === 0) return ''
    
    const maxY = Math.max(...data.map(d => d.y), 1)
    const width = 800
    const height = 200
    const padding = 50
    
    const points = data.map((point, index) => {
      const x = padding + (index / (data.length - 1)) * (width - 2 * padding)
      const y = height - padding - ((point.y / maxY) * (height - 2 * padding))
      return { x, y, value: point.y, label: point.x }
    })
    
    if (points.length === 0) return ''
    
    let path = `M ${points[0].x} ${points[0].y}`
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const cpx = prev.x + (curr.x - prev.x) / 2
      path += ` Q ${cpx} ${prev.y} ${curr.x} ${curr.y}`
    }
    
    return { path, points }
  }

  // Helper function to format date labels
  const formatDateLabel = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('ro-RO', { 
        month: 'short', 
        day: 'numeric' 
      })
    } catch {
      return dateStr
    }
  }


  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/analytics?period=${timeRange}`)
        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch analytics')
        }
        
        if (result.success && result.data) {
          console.log('Analytics data received:', result.data)
          console.log('PageviewsTimeSeries:', result.data.pageviewsTimeSeries)
          setAnalytics(result.data)
          setError(null)
        } else {
          throw new Error(result.error || 'Invalid analytics response')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics data")
        console.error("Analytics error:", err)
        setAnalytics(null)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  const timeRangeOptions = [
    { value: '24h', label: 'Ultimele 24h' },
    { value: '7d', label: 'Ultimele 7 zile' },
    { value: '30d', label: 'Ultimele 30 zile' },
    { value: '90d', label: 'Ultimele 90 zile' }
  ]

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg h-64"></div>
            <div className="bg-gray-200 rounded-lg h-64"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Analytics</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Website performance și statistici vizitatori</p>
        </div>
        
        <div className="mt-4 lg:mt-0">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg shadow-sm border border-blue-200 hover:shadow-md transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vizitatori</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.visitors.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg shadow-sm border border-green-200 hover:shadow-md transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vizualizări</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.pageviews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-lg shadow-sm border border-purple-200 hover:shadow-md transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rata de Respingere</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.bounceRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-6 rounded-lg shadow-sm border border-orange-200 hover:shadow-md transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Timp Mediu</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.avgSessionTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Analytics Card */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-red-50 to-rose-100 p-6 rounded-lg shadow-sm border border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg">
                <Wifi className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Real-Time Analytics</h3>
                <p className="text-sm text-gray-600">Live website activity</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center mr-6">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-gray-600">Live</span>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{analytics.activeUsers}</div>
                <div className="text-xs text-gray-500">Active Now</div>
              </div>
            </div>
          </div>
        </div>
      </div>




      {/* Advanced Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Browsers */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg mr-3">
              <Chrome className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Browsere</h3>
          </div>
          <div className="space-y-4">
            {analytics.browsers && analytics.browsers.length > 0 ? (
              analytics.browsers.slice(0, 6).map((browser, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                      {browser.browser.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {browser.browser.includes('chrome') ? '🔷 Chrome' :
                         browser.browser.includes('firefox') ? '🔥 Firefox' :
                         browser.browser.includes('safari') ? '🧭 Safari' :
                         browser.browser.includes('edge') ? '🔵 Edge' : 
                         `🌐 ${browser.browser}`}
                      </p>
                      <p className="text-xs text-gray-500">{browser.visitors.toLocaleString()} vizitatori</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-blue-600 ml-2">{browser.percentage}%</span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">No browser data available</div>
            )}
          </div>
        </div>

        {/* Operating Systems */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl shadow-sm border border-green-200 hover:shadow-md transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mr-3">
              <Monitor className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Sisteme de Operare</h3>
          </div>
          <div className="space-y-4">
            {analytics.operatingSystems && analytics.operatingSystems.length > 0 ? (
              analytics.operatingSystems.slice(0, 6).map((os, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                      {os.os.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {os.os.toLowerCase().includes('windows') ? '🪟 Windows' :
                         os.os.toLowerCase().includes('mac') ? '🍎 macOS' :
                         os.os.toLowerCase().includes('linux') ? '🐧 Linux' :
                         os.os.toLowerCase().includes('android') ? '🤖 Android' :
                         os.os.toLowerCase().includes('ios') ? '📱 iOS' : 
                         `💻 ${os.os}`}
                      </p>
                      <p className="text-xs text-gray-500">{os.visitors.toLocaleString()} vizitatori</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-green-600 ml-2">{os.percentage}%</span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">No OS data available</div>
            )}
          </div>
        </div>

        {/* Languages */}
        <div className="bg-gradient-to-br from-pink-50 to-rose-100 p-6 rounded-xl shadow-sm border border-pink-200 hover:shadow-md transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg mr-3">
              <Languages className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Limbi</h3>
          </div>
          <div className="space-y-4">
            {analytics.languages && analytics.languages.length > 0 ? (
              analytics.languages.slice(0, 6).map((language, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                      {language.language.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {language.language === 'ro' || language.language === 'ro-RO' ? '🇷🇴 Română' :
                         language.language === 'en' || language.language === 'en-US' ? '🇺🇸 English' :
                         language.language === 'de' || language.language === 'de-DE' ? '🇩🇪 Deutsch' :
                         language.language === 'fr' || language.language === 'fr-FR' ? '🇫🇷 Français' :
                         language.language === 'es' || language.language === 'es-ES' ? '🇪🇸 Español' :
                         language.language === 'it' || language.language === 'it-IT' ? '🇮🇹 Italiano' :
                         `🌐 ${language.language}`}
                      </p>
                      <p className="text-xs text-gray-500">{language.visitors.toLocaleString()} vizitatori</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-pink-600 ml-2">{language.percentage}%</span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">No language data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Events Analytics */}
      {analytics.events && analytics.events.length > 0 && (
        <div className="mb-8">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-100 p-6 rounded-xl shadow-sm border border-indigo-200">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mr-3">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Evenimente Personalizate</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.events.slice(0, 6).map((event, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium mr-3">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-900 truncate">{event.event}</span>
                    </div>
                    <span className="text-lg font-bold text-indigo-600">{event.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}