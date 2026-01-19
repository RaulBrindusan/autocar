'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface DailyData {
  date: string
  value: number
}

interface TopPage {
  page: string
  views: number
  uniqueViews: number
}

interface DeviceData {
  device: string
  count: number
  percentage: number
}

interface BrowserData {
  browser: string
  count: number
  percentage: number
}

interface CountryData {
  country: string
  count: number
  flag: string
}

interface EventData {
  event: string
  count: number
}

interface AnalyticsData {
  totalPageViews: number
  uniqueUsers: number
  newUsers: number
  avgSessionDuration: string
  bounceRate: number
  pageViewsOverTime: DailyData[]
  uniqueUsersOverTime: DailyData[]
  topPages: TopPage[]
  devices: DeviceData[]
  browsers: BrowserData[]
  operatingSystems: DeviceData[]
  countries: CountryData[]
  topEvents: EventData[]
  referrers: { source: string; count: number }[]
  lastUpdated: string
  dateRange: { from: string; to: string }
}

// Simple bar chart component
function BarChart({ data, maxValue, color = 'bg-blue-500' }: { data: { label: string; value: number }[]; maxValue: number; color?: string }) {
  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-24 text-sm text-gray-600 truncate" title={item.label}>
            {item.label}
          </div>
          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${color} rounded-full transition-all duration-500`}
              style={{ width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
            />
          </div>
          <div className="w-16 text-sm text-gray-700 text-right font-medium">
            {item.value.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}

// Mini line chart using CSS
function MiniLineChart({ data, color = '#3B82F6' }: { data: DailyData[]; color?: string }) {
  if (data.length === 0) return null

  const values = data.map(d => d.value)
  const maxValue = Math.max(...values, 1)
  const minValue = Math.min(...values)

  return (
    <div className="h-32 flex items-end gap-1 px-2">
      {data.slice(-14).map((item, index) => {
        const height = maxValue > 0 ? ((item.value - minValue) / (maxValue - minValue || 1)) * 100 : 0
        const formattedDate = new Date(item.date).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })

        return (
          <div
            key={index}
            className="flex-1 group relative cursor-pointer"
            title={`${formattedDate}: ${item.value.toLocaleString()}`}
          >
            <div
              className="w-full rounded-t transition-all duration-300 hover:opacity-80"
              style={{
                height: `${Math.max(height, 5)}%`,
                backgroundColor: color,
                minHeight: '4px'
              }}
            />
            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
              {formattedDate}: {item.value.toLocaleString()}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Progress ring for percentages
function ProgressRing({ percentage, size = 60, strokeWidth = 6, color = '#3B82F6' }: { percentage: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="transition-all duration-500"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-700">{percentage}%</span>
      </div>
    </div>
  )
}

// Stat card component
function StatCard({ title, value, subtitle, icon, color, trend }: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  color: string
  trend?: { value: number; positive: boolean }
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className={`mt-2 flex items-center text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              <span>{trend.positive ? '+' : ''}{trend.value}%</span>
              <span className="ml-1 text-gray-500">vs ultima luna</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics/mixpanel')
        if (response.ok) {
          const data = await response.json()
          if (data.error) {
            setError(data.error)
          } else {
            setStats(data)
          }
        } else {
          setError('Nu s-au putut incarca datele analitice')
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err)
        setError('Eroare la incarcarea datelor')
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchAnalytics()
    }
  }, [user])

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Se incarca...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Analitice Site
              </h1>
              <p className="mt-2 text-gray-600">
                Statistici detaliate despre vizitatorii site-ului
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              {stats?.dateRange && (
                <span className="text-sm text-gray-500">
                  {new Date(stats.dateRange.from).toLocaleDateString('ro-RO')} - {new Date(stats.dateRange.to).toLocaleDateString('ro-RO')}
                </span>
              )}
              <a
                href="https://mixpanel.com/project/3297262"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Mixpanel Dashboard
              </a>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : stats && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Vizualizari Pagini"
                value={stats.totalPageViews}
                subtitle="Ultimele 30 zile"
                color="bg-blue-100"
                icon={
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                }
              />
              <StatCard
                title="Utilizatori Unici"
                value={stats.uniqueUsers}
                subtitle="Total vizitatori"
                color="bg-green-100"
                icon={
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                }
              />
              <StatCard
                title="Durata Medie Sesiune"
                value={stats.avgSessionDuration}
                subtitle="Timp petrecut pe site"
                color="bg-yellow-100"
                icon={
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatCard
                title="Rata de Respingere"
                value={`${stats.bounceRate}%`}
                subtitle="Vizite cu o singura pagina"
                color="bg-red-100"
                icon={
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                }
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Page Views Over Time */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Vizualizari in Timp
                </h2>
                <p className="text-sm text-gray-500 mb-4">Ultimele 14 zile</p>
                {stats.pageViewsOverTime.length > 0 ? (
                  <MiniLineChart data={stats.pageViewsOverTime} color="#3B82F6" />
                ) : (
                  <div className="h-32 flex items-center justify-center text-gray-500">
                    Nu exista date disponibile
                  </div>
                )}
              </div>

              {/* Unique Users Over Time */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Utilizatori Unici in Timp
                </h2>
                <p className="text-sm text-gray-500 mb-4">Ultimele 14 zile</p>
                {stats.uniqueUsersOverTime.length > 0 ? (
                  <MiniLineChart data={stats.uniqueUsersOverTime} color="#10B981" />
                ) : (
                  <div className="h-32 flex items-center justify-center text-gray-500">
                    Nu exista date disponibile
                  </div>
                )}
              </div>
            </div>

            {/* Top Pages & Events */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Top Pages */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Cele Mai Vizitate Pagini
                </h2>
                {stats.topPages.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-2 text-sm font-medium text-gray-500">Pagina</th>
                          <th className="text-right py-2 text-sm font-medium text-gray-500">Vizualizari</th>
                          <th className="text-right py-2 text-sm font-medium text-gray-500">Unici</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.topPages.map((page, index) => (
                          <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-3 text-sm text-gray-900 max-w-[200px] truncate" title={page.page}>
                              {page.page || '/'}
                            </td>
                            <td className="py-3 text-sm text-gray-700 text-right font-medium">
                              {page.views.toLocaleString()}
                            </td>
                            <td className="py-3 text-sm text-gray-500 text-right">
                              {page.uniqueViews.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center text-gray-500">
                    Nu exista date disponibile
                  </div>
                )}
              </div>

              {/* Top Events */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Evenimente Populare
                </h2>
                {stats.topEvents.length > 0 ? (
                  <BarChart
                    data={stats.topEvents.slice(0, 6).map(e => ({
                      label: e.event.replace('$mp_web_page_view', 'Page View (auto)'),
                      value: e.count
                    }))}
                    maxValue={Math.max(...stats.topEvents.map(e => e.count))}
                    color="bg-purple-500"
                  />
                ) : (
                  <div className="h-40 flex items-center justify-center text-gray-500">
                    Nu exista date disponibile
                  </div>
                )}
              </div>
            </div>

            {/* Technology & Geography */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Devices */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Dispozitive
                </h2>
                {stats.devices.length > 0 ? (
                  <div className="space-y-4">
                    {stats.devices.map((device, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            device.device === 'Desktop' ? 'bg-blue-100' :
                            device.device === 'Mobile' ? 'bg-green-100' : 'bg-yellow-100'
                          }`}>
                            {device.device === 'Desktop' ? (
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            ) : device.device === 'Mobile' ? (
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm text-gray-700">{device.device}</span>
                        </div>
                        <ProgressRing
                          percentage={device.percentage}
                          size={50}
                          color={device.device === 'Desktop' ? '#3B82F6' : device.device === 'Mobile' ? '#10B981' : '#F59E0B'}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center text-gray-500">
                    Nu exista date disponibile
                  </div>
                )}
              </div>

              {/* Browsers */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Browsere
                </h2>
                {stats.browsers.length > 0 ? (
                  <div className="space-y-3">
                    {stats.browsers.slice(0, 5).map((browser, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">{browser.browser}</span>
                            <span className="text-sm font-medium text-gray-900">{browser.percentage}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                              style={{ width: `${browser.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center text-gray-500">
                    Nu exista date disponibile
                  </div>
                )}
              </div>

              {/* Countries */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Tari
                </h2>
                {stats.countries.length > 0 ? (
                  <div className="space-y-3">
                    {stats.countries.slice(0, 6).map((country, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{country.flag}</span>
                          <span className="text-sm text-gray-700">{country.country}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {country.count.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center text-gray-500">
                    Nu exista date disponibile
                  </div>
                )}
              </div>
            </div>

            {/* Operating Systems & Referrers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Operating Systems */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Sisteme de Operare
                </h2>
                {stats.operatingSystems.length > 0 ? (
                  <BarChart
                    data={stats.operatingSystems.slice(0, 6).map(os => ({
                      label: os.device,
                      value: os.count
                    }))}
                    maxValue={Math.max(...stats.operatingSystems.map(os => os.count))}
                    color="bg-teal-500"
                  />
                ) : (
                  <div className="h-40 flex items-center justify-center text-gray-500">
                    Nu exista date disponibile
                  </div>
                )}
              </div>

              {/* Referrers */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Surse de Trafic
                </h2>
                {stats.referrers.length > 0 ? (
                  <BarChart
                    data={stats.referrers.slice(0, 6).map(ref => ({
                      label: ref.source.length > 30 ? ref.source.substring(0, 30) + '...' : ref.source,
                      value: ref.count
                    }))}
                    maxValue={Math.max(...stats.referrers.map(r => r.count))}
                    color="bg-orange-500"
                  />
                ) : (
                  <div className="h-40 flex items-center justify-center text-gray-500">
                    Nu exista date disponibile (majoritatea trafic direct)
                  </div>
                )}
              </div>
            </div>

            {/* Footer Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Date furnizate de Mixpanel</h3>
                  <p className="text-sm text-gray-500">
                    Ultima actualizare: {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleString('ro-RO') : 'N/A'}
                  </p>
                </div>
                <a
                  href="https://mixpanel.com/project/3297262"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Vezi rapoarte complete in Mixpanel
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
