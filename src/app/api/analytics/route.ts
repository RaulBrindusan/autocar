import { NextRequest, NextResponse } from 'next/server'
import { 
  getUmamiStats, 
  getUmamiPageViews, 
  getUmamiReferrers, 
  getUmamiDevices, 
  getUmamiCountries,
  getUmamiEvents,
  getUmamiPageviewsTimeSeries,
  getUmamiBrowsers,
  getUmamiOperatingSystems,
  getUmamiLanguages,
  getUmamiActiveUsers,
  calculateBounceRate,
  formatSessionTime,
  getCountryFlag
} from '@/lib/umami-api'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface AnalyticsResponse {
  success: boolean
  data?: {
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
  error?: string
}

export async function GET(request: NextRequest): Promise<NextResponse<AnalyticsResponse>> {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d'

    console.log('Analytics API called with period:', period)
    console.log('Environment check:', {
      websiteId: !!process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
      apiToken: !!process.env.UMAMI_API_TOKEN
    })

    // Check if Umami is configured
    if (!process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) {
      console.error('Missing NEXT_PUBLIC_UMAMI_WEBSITE_ID')
      return NextResponse.json({
        success: false,
        error: 'Umami website ID is not configured'
      }, { status: 400 })
    }

    if (!process.env.UMAMI_API_TOKEN) {
      console.error('Missing UMAMI_API_TOKEN')
      return NextResponse.json({
        success: false,
        error: 'Umami API token is not configured'
      }, { status: 400 })
    }

    // Fetch all analytics data in parallel
    const [
      stats,
      pageViews,
      referrers,
      devices,
      countries,
      events,
      pageviewsTimeSeries,
      browsers,
      operatingSystems,
      languages,
      activeUsersData
    ] = await Promise.all([
      getUmamiStats(period),
      getUmamiPageViews(period),
      getUmamiReferrers(period),
      getUmamiDevices(period),
      getUmamiCountries(period),
      getUmamiEvents(period),
      getUmamiPageviewsTimeSeries(period),
      getUmamiBrowsers(period),
      getUmamiOperatingSystems(period),
      getUmamiLanguages(period),
      getUmamiActiveUsers()
    ])

    // If main stats failed, return error
    if (!stats) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch analytics data from Umami'
      }, { status: 500 })
    }

    // Calculate bounce rate and session time
    const bounceRate = calculateBounceRate(stats.bounces.value, stats.visits.value)
    const avgSessionTime = formatSessionTime(stats.totaltime.value, stats.visits.value)

    // Process page views
    const topPages = pageViews.slice(0, 10).map(item => ({
      page: item.x || '/',
      views: item.y || 0,
      visitors: Math.round(item.y * 0.7) // Approximate unique visitors
    }))

    // Process referrers
    const topReferrers = referrers.slice(0, 10).map(item => ({
      referrer: item.x === '' ? 'Direct' : item.x || 'Unknown',
      visitors: item.y || 0,
      views: Math.round(item.y * 1.4) // Approximate total views
    }))

    // Process devices with percentages
    const totalDeviceVisitors = devices.reduce((sum, device) => sum + device.y, 0)
    const deviceTypes = devices.slice(0, 5).map(item => ({
      device: item.x === 'desktop' ? 'Desktop' : 
              item.x === 'mobile' ? 'Mobile' : 
              item.x === 'tablet' ? 'Tablet' : item.x || 'Unknown',
      percentage: totalDeviceVisitors > 0 ? Math.round((item.y / totalDeviceVisitors) * 100 * 10) / 10 : 0,
      visitors: item.y || 0
    }))

    // Process countries with flags
    const topCountries = countries.slice(0, 10).map(item => ({
      country: item.x || 'Unknown',
      visitors: item.y || 0,
      flag: getCountryFlag(item.x || '')
    }))

    // Process events
    const topEvents = events.slice(0, 10).map(item => ({
      event: item.x || 'Unknown Event',
      count: item.y || 0
    }))

    // Process browsers with percentages
    const totalBrowserVisitors = browsers.reduce((sum, browser) => sum + browser.y, 0)
    const browserTypes = browsers.slice(0, 10).map(item => ({
      browser: item.x || 'Unknown',
      percentage: totalBrowserVisitors > 0 ? Math.round((item.y / totalBrowserVisitors) * 100 * 10) / 10 : 0,
      visitors: item.y || 0
    }))

    // Process operating systems with percentages  
    const totalOSVisitors = operatingSystems.reduce((sum, os) => sum + os.y, 0)
    const osTypes = operatingSystems.slice(0, 10).map(item => ({
      os: item.x || 'Unknown',
      percentage: totalOSVisitors > 0 ? Math.round((item.y / totalOSVisitors) * 100 * 10) / 10 : 0,
      visitors: item.y || 0
    }))

    // Process languages with percentages
    const totalLanguageVisitors = languages.reduce((sum, lang) => sum + lang.y, 0)
    const languageTypes = languages.slice(0, 10).map(item => ({
      language: item.x || 'Unknown',
      percentage: totalLanguageVisitors > 0 ? Math.round((item.y / totalLanguageVisitors) * 100 * 10) / 10 : 0,
      visitors: item.y || 0
    }))

    const analyticsData = {
      visitors: stats.visitors.value || 0,
      pageviews: stats.pageviews.value || 0,
      sessions: stats.visits.value || 0,
      bounceRate,
      avgSessionTime,
      activeUsers: activeUsersData?.visitors || 0,
      topPages,
      topReferrers,
      deviceTypes,
      browsers: browserTypes,
      operatingSystems: osTypes,
      languages: languageTypes,
      countries: topCountries,
      events: topEvents,
      pageviewsTimeSeries
    }

    return NextResponse.json({
      success: true,
      data: analyticsData
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}