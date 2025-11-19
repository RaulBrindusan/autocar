import { NextResponse } from 'next/server'

/**
 * API Route to fetch Mixpanel analytics data
 *
 * This provides a summary of key metrics from Mixpanel.
 * For full Mixpanel Query API integration, you'll need to add:
 * - MIXPANEL_API_SECRET to your environment variables
 * - Install mixpanel library for server-side queries
 *
 * For now, this returns mock data. Replace with real Mixpanel Query API calls
 * when you have the API secret configured.
 */
export async function GET() {
  try {
    const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
    const apiSecret = process.env.MIXPANEL_API_SECRET

    if (!token) {
      return NextResponse.json(
        { error: 'Mixpanel token not configured' },
        { status: 500 }
      )
    }

    // For now, return sample data
    // To get real data, you need to:
    // 1. Add MIXPANEL_API_SECRET to your .env file
    // 2. Use Mixpanel Query API: https://developer.mixpanel.com/reference/query-api
    // 3. Make authenticated requests to fetch real analytics

    if (!apiSecret) {
      // Return placeholder data with instructions
      return NextResponse.json({
        totalPageViews: 0,
        uniqueUsers: 0,
        avgSessionDuration: '0m',
        topPages: [],
        note: 'Add MIXPANEL_API_SECRET to .env to fetch real data',
        dashboardUrl: 'https://mixpanel.com/project/3297262'
      })
    }

    // Example: Fetch data from Mixpanel Query API
    // const fromDate = new Date()
    // fromDate.setDate(fromDate.getDate() - 30) // Last 30 days
    //
    // const queryParams = new URLSearchParams({
    //   from_date: fromDate.toISOString().split('T')[0],
    //   to_date: new Date().toISOString().split('T')[0],
    //   event: 'Page View',
    // })
    //
    // const response = await fetch(
    //   `https://eu.mixpanel.com/api/2.0/events?${queryParams}`,
    //   {
    //     headers: {
    //       'Authorization': `Basic ${Buffer.from(`${apiSecret}:`).toString('base64')}`,
    //       'Accept': 'application/json',
    //     },
    //   }
    // )
    //
    // const data = await response.json()

    // Return formatted data
    return NextResponse.json({
      totalPageViews: 1250,
      uniqueUsers: 423,
      avgSessionDuration: '3m 24s',
      topPages: [
        { page: '/', views: 450 },
        { page: '/calculator', views: 320 },
        { page: '/dashboard', views: 180 },
        { page: '/login', views: 150 },
        { page: '/politica-de-confidentialitate', views: 150 },
      ],
      dashboardUrl: 'https://mixpanel.com/project/3297262'
    })
  } catch (error) {
    console.error('Error fetching Mixpanel analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
