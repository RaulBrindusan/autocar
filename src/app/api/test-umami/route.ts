import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const config = {
      baseUrl: 'https://api.umami.is/v1',
      websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
      apiToken: process.env.UMAMI_API_TOKEN
    }

    console.log('Testing Umami API with config:', {
      baseUrl: config.baseUrl,
      websiteId: config.websiteId ? 'present' : 'missing',
      apiToken: config.apiToken ? `${config.apiToken.substring(0, 10)}...` : 'missing'
    })

    // Test basic endpoint - just list websites
    const url = `${config.baseUrl}/websites`
    
    console.log('Testing URL:', url)
    
    const response = await fetch(url, {
      headers: {
        'x-umami-api-key': config.apiToken,
        'Content-Type': 'application/json'
      }
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log('Response body:', responseText)

    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch {
      responseData = responseText
    }

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      data: responseData,
      config: {
        baseUrl: config.baseUrl,
        hasWebsiteId: !!config.websiteId,
        hasApiToken: !!config.apiToken
      }
    })

  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}