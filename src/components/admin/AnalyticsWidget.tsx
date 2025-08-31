"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart3, Users, Eye, TrendingUp, ExternalLink } from "lucide-react"

interface QuickAnalytics {
  visitors: number
  pageviews: number
  sessions: number
  bounceRate: number
}

export function AnalyticsWidget() {
  const [analytics, setAnalytics] = useState<QuickAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics?period=7d')
        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch analytics')
        }
        
        if (result.success && result.data) {
          setAnalytics({
            visitors: result.data.visitors,
            pageviews: result.data.pageviews,
            sessions: result.data.sessions,
            bounceRate: result.data.bounceRate
          })
        } else {
          throw new Error(result.error || 'Invalid analytics response')
        }
      } catch (err) {
        console.error("Analytics error:", err)
        // Set null to show unavailable state instead of zero data
        setAnalytics(null)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl mr-4">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
            <p className="text-gray-600">Ultimele 7 zile</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Indisponibile</h3>
          <p className="text-gray-600 mb-4">Datele analytics nu sunt disponibile momentan</p>
          <Link
            href="/admin/analytics"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Configurează Analytics
            <ExternalLink className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl mr-4">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600">Ultimele 7 zile</p>
        </div>
        <Link
          href="/admin/analytics"
          className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium"
        >
          Vezi detalii
          <ExternalLink className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-all">
          <div className="bg-blue-500 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{analytics.visitors.toLocaleString()}</p>
          <p className="text-sm font-medium text-blue-700">Vizitatori</p>
        </div>
        
        <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 hover:shadow-md transition-all">
          <div className="bg-emerald-500 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <Eye className="h-6 w-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{analytics.pageviews.toLocaleString()}</p>
          <p className="text-sm font-medium text-emerald-700">Vizualizări</p>
        </div>
        
        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-all">
          <div className="bg-purple-500 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{analytics.sessions.toLocaleString()}</p>
          <p className="text-sm font-medium text-purple-700">Sesiuni</p>
        </div>
        
        <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-md transition-all">
          <div className="bg-orange-500 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{analytics.bounceRate}%</p>
          <p className="text-sm font-medium text-orange-700">Rata Respingere</p>
        </div>
      </div>

      {/* Link to full analytics dashboard */}
      <div className="mt-8">
        <Link
          href="/admin/analytics"
          className="block w-full text-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          Vezi Dashboard Complet →
        </Link>
      </div>
    </div>
  )
}