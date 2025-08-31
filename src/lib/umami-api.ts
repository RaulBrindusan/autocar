/**
 * Umami API Integration
 * 
 * Provides functions to fetch real analytics data from Umami API
 * Documentation: https://umami.is/docs/api
 */

interface UmamiConfig {
  baseUrl: string
  websiteId: string
  apiToken?: string
}

interface DateRange {
  startDate: string
  endDate: string
}

interface UmamiStats {
  pageviews: { value: number; prev: number }
  visitors: { value: number; prev: number }
  visits: { value: number; prev: number }
  bounces: { value: number; prev: number }
  totaltime: { value: number; prev: number }
}

interface UmamiPageview {
  x: string
  y: number
}

interface UmamiMetric {
  x: string
  y: number
}

interface UmamiEventsResponse {
  data: Array<{
    x: string
    y: number
  }>
}

const getUmamiConfig = (): UmamiConfig => {
  return {
    baseUrl: 'https://api.umami.is/v1',
    websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || '',
    apiToken: process.env.UMAMI_API_TOKEN
  }
}

const getDateRange = (period: string): DateRange => {
  const endDate = new Date()
  const startDate = new Date()

  switch (period) {
    case '24h':
      startDate.setHours(startDate.getHours() - 24)
      break
    case '7d':
      startDate.setDate(startDate.getDate() - 7)
      break
    case '30d':
      startDate.setDate(startDate.getDate() - 30)
      break
    case '90d':
      startDate.setDate(startDate.getDate() - 90)
      break
    default:
      startDate.setDate(startDate.getDate() - 7)
  }

  return {
    startDate: startDate.getTime().toString(),
    endDate: endDate.getTime().toString()
  }
}

/**
 * Get website statistics from Umami
 */
export async function getUmamiStats(period: string = '7d'): Promise<UmamiStats | null> {
  try {
    const config = getUmamiConfig()
    if (!config.websiteId || !config.apiToken) {
      console.error('Umami configuration missing:', { websiteId: !!config.websiteId, apiToken: !!config.apiToken })
      throw new Error('Umami website ID or API token not configured')
    }

    const { startDate, endDate } = getDateRange(period)
    
    const url = `${config.baseUrl}/websites/${config.websiteId}/stats`
    const params = new URLSearchParams({
      startAt: startDate,
      endAt: endDate
    })

    console.log('Fetching Umami stats from:', `${url}?${params}`)

    const response = await fetch(`${url}?${params}`, {
      headers: {
        'x-umami-api-key': config.apiToken,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    console.log('Umami API response status:', response.status)
    console.log('Umami API response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Umami API error response:', errorText)
      console.error('Full request URL:', `${url}?${params}`)
      console.error('Request headers:', {
        'x-umami-api-key': `${config.apiToken?.substring(0, 10)}...`,
        'Content-Type': 'application/json'
      })
      throw new Error(`Umami API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Umami API response data:', data)
    return data
  } catch (error) {
    console.error('Error fetching Umami stats:', error)
    return null
  }
}

/**
 * Get top pages from Umami
 */
export async function getUmamiPageViews(period: string = '7d'): Promise<UmamiMetric[]> {
  try {
    const config = getUmamiConfig()
    if (!config.websiteId) {
      throw new Error('Umami website ID not configured')
    }

    const { startDate, endDate } = getDateRange(period)
    
    const url = `${config.baseUrl}/websites/${config.websiteId}/metrics`
    const params = new URLSearchParams({
      startAt: startDate,
      endAt: endDate,
      type: 'url'
    })

    const response = await fetch(`${url}?${params}`, {
      headers: config.apiToken ? {
        'x-umami-api-key': config.apiToken,
        'Content-Type': 'application/json'
      } : {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Umami API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching Umami page views:', error)
    return []
  }
}

/**
 * Get referrer data from Umami
 */
export async function getUmamiReferrers(period: string = '7d'): Promise<UmamiMetric[]> {
  try {
    const config = getUmamiConfig()
    if (!config.websiteId) {
      throw new Error('Umami website ID not configured')
    }

    const { startDate, endDate } = getDateRange(period)
    
    const url = `${config.baseUrl}/websites/${config.websiteId}/metrics`
    const params = new URLSearchParams({
      startAt: startDate,
      endAt: endDate,
      type: 'referrer'
    })

    const response = await fetch(`${url}?${params}`, {
      headers: config.apiToken ? {
        'x-umami-api-key': config.apiToken,
        'Content-Type': 'application/json'
      } : {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Umami API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching Umami referrers:', error)
    return []
  }
}

/**
 * Get device data from Umami
 */
export async function getUmamiDevices(period: string = '7d'): Promise<UmamiMetric[]> {
  try {
    const config = getUmamiConfig()
    if (!config.websiteId) {
      throw new Error('Umami website ID not configured')
    }

    const { startDate, endDate } = getDateRange(period)
    
    const url = `${config.baseUrl}/websites/${config.websiteId}/metrics`
    const params = new URLSearchParams({
      startAt: startDate,
      endAt: endDate,
      type: 'device'
    })

    const response = await fetch(`${url}?${params}`, {
      headers: config.apiToken ? {
        'x-umami-api-key': config.apiToken,
        'Content-Type': 'application/json'
      } : {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Umami API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching Umami devices:', error)
    return []
  }
}

/**
 * Get country data from Umami
 */
export async function getUmamiCountries(period: string = '7d'): Promise<UmamiMetric[]> {
  try {
    const config = getUmamiConfig()
    if (!config.websiteId) {
      throw new Error('Umami website ID not configured')
    }

    const { startDate, endDate } = getDateRange(period)
    
    const url = `${config.baseUrl}/websites/${config.websiteId}/metrics`
    const params = new URLSearchParams({
      startAt: startDate,
      endAt: endDate,
      type: 'country'
    })

    const response = await fetch(`${url}?${params}`, {
      headers: config.apiToken ? {
        'x-umami-api-key': config.apiToken,
        'Content-Type': 'application/json'
      } : {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Umami API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching Umami countries:', error)
    return []
  }
}

/**
 * Get browser data from Umami
 */
export async function getUmamiBrowsers(period: string = '7d'): Promise<UmamiMetric[]> {
  try {
    const config = getUmamiConfig()
    if (!config.websiteId || !config.apiToken) {
      throw new Error('Umami website ID or API token not configured')
    }

    const { startDate, endDate } = getDateRange(period)
    
    const url = `${config.baseUrl}/websites/${config.websiteId}/metrics`
    const params = new URLSearchParams({
      startAt: startDate,
      endAt: endDate,
      type: 'browser'
    })

    const response = await fetch(`${url}?${params}`, {
      headers: {
        'x-umami-api-key': config.apiToken,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Umami API error: ${response.status}`)
    }

    const data = await response.json()
    return data || []
  } catch (error) {
    console.error('Error fetching Umami browsers:', error)
    return []
  }
}

/**
 * Get operating system data from Umami
 */
export async function getUmamiOperatingSystems(period: string = '7d'): Promise<UmamiMetric[]> {
  try {
    const config = getUmamiConfig()
    if (!config.websiteId || !config.apiToken) {
      throw new Error('Umami website ID or API token not configured')
    }

    const { startDate, endDate } = getDateRange(period)
    
    const url = `${config.baseUrl}/websites/${config.websiteId}/metrics`
    const params = new URLSearchParams({
      startAt: startDate,
      endAt: endDate,
      type: 'os'
    })

    const response = await fetch(`${url}?${params}`, {
      headers: {
        'x-umami-api-key': config.apiToken,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Umami API error: ${response.status}`)
    }

    const data = await response.json()
    return data || []
  } catch (error) {
    console.error('Error fetching Umami operating systems:', error)
    return []
  }
}

/**
 * Get language data from Umami
 */
export async function getUmamiLanguages(period: string = '7d'): Promise<UmamiMetric[]> {
  try {
    const config = getUmamiConfig()
    if (!config.websiteId || !config.apiToken) {
      throw new Error('Umami website ID or API token not configured')
    }

    const { startDate, endDate } = getDateRange(period)
    
    const url = `${config.baseUrl}/websites/${config.websiteId}/metrics`
    const params = new URLSearchParams({
      startAt: startDate,
      endAt: endDate,
      type: 'language'
    })

    const response = await fetch(`${url}?${params}`, {
      headers: {
        'x-umami-api-key': config.apiToken,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Umami API error: ${response.status}`)
    }

    const data = await response.json()
    return data || []
  } catch (error) {
    console.error('Error fetching Umami languages:', error)
    return []
  }
}

/**
 * Get active users count (real-time)
 */
export async function getUmamiActiveUsers(): Promise<{visitors: number} | null> {
  try {
    const config = getUmamiConfig()
    if (!config.websiteId || !config.apiToken) {
      throw new Error('Umami website ID or API token not configured')
    }
    
    const url = `${config.baseUrl}/websites/${config.websiteId}/active`

    const response = await fetch(url, {
      headers: {
        'x-umami-api-key': config.apiToken,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Umami API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching Umami active users:', error)
    return null
  }
}

/**
 * Get custom events from Umami
 */
export async function getUmamiEvents(period: string = '7d'): Promise<UmamiMetric[]> {
  try {
    const config = getUmamiConfig()
    if (!config.websiteId) {
      throw new Error('Umami website ID not configured')
    }

    const { startDate, endDate } = getDateRange(period)
    
    const url = `${config.baseUrl}/websites/${config.websiteId}/events`
    const params = new URLSearchParams({
      startAt: startDate,
      endAt: endDate
    })

    const response = await fetch(`${url}?${params}`, {
      headers: config.apiToken ? {
        'x-umami-api-key': config.apiToken,
        'Content-Type': 'application/json'
      } : {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Umami API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching Umami events:', error)
    return []
  }
}

/**
 * Helper function to format bounce rate
 */
export function calculateBounceRate(bounces: number, visits: number): number {
  if (visits === 0) return 0
  return Math.round((bounces / visits) * 100 * 10) / 10
}

/**
 * Helper function to format session duration
 */
export function formatSessionTime(totalTime: number, visits: number): string {
  if (visits === 0) return '0s'
  
  const avgSeconds = Math.round(totalTime / visits / 1000)
  const minutes = Math.floor(avgSeconds / 60)
  const seconds = avgSeconds % 60
  
  if (minutes === 0) {
    return `${seconds}s`
  }
  return `${minutes}m ${seconds}s`
}

/**
 * Get pageviews time series data from Umami
 */
export async function getUmamiPageviewsTimeSeries(period: string = '7d'): Promise<Array<{x: string, y: number}>> {
  try {
    const config = getUmamiConfig()
    if (!config.websiteId || !config.apiToken) {
      console.error('Umami configuration missing:', { websiteId: !!config.websiteId, apiToken: !!config.apiToken })
      throw new Error('Umami website ID or API token not configured')
    }

    const { startDate, endDate } = getDateRange(period)
    
    const url = `${config.baseUrl}/websites/${config.websiteId}/pageviews`
    const params = new URLSearchParams({
      startAt: startDate,
      endAt: endDate,
      unit: 'day'
    })

    console.log('Fetching Umami pageviews time series from:', `${url}?${params}`)

    const response = await fetch(`${url}?${params}`, {
      headers: {
        'x-umami-api-key': config.apiToken,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    console.log('Umami pageviews API response status:', response.status)

    if (!response.ok) {
      throw new Error(`Umami API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Umami pageviews time series raw response:', data)
    
    // According to Umami API docs, response structure is:
    // { "pageviews": [{"x": "timestamp", "y": count}], "sessions": [...] }
    const pageviews = data.pageviews || []
    console.log('Processed pageviews data:', pageviews)
    
    if (!Array.isArray(pageviews)) {
      console.error('Pageviews data is not an array:', pageviews)
      return []
    }
    
    return pageviews.map((item: any) => ({
      x: item.x,
      y: item.y || 0
    }))
  } catch (error) {
    console.error('Error fetching Umami pageviews time series:', error)
    return []
  }
}

/**
 * Helper function to get country flag emoji
 */
export function getCountryFlag(countryCode: string): string {
  const flagMap: { [key: string]: string } = {
    'RO': '🇷🇴', 'DE': '🇩🇪', 'IT': '🇮🇹', 'US': '🇺🇸', 'FR': '🇫🇷',
    'GB': '🇬🇧', 'ES': '🇪🇸', 'NL': '🇳🇱', 'BE': '🇧🇪', 'AT': '🇦🇹',
    'CH': '🇨🇭', 'CA': '🇨🇦', 'AU': '🇦🇺', 'BR': '🇧🇷', 'JP': '🇯🇵',
    'KR': '🇰🇷', 'CN': '🇨🇳', 'IN': '🇮🇳', 'RU': '🇷🇺', 'UA': '🇺🇦'
  }
  
  return flagMap[countryCode.toUpperCase()] || '🌍'
}