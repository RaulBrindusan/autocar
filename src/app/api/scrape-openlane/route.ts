import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({
        success: false,
        error: 'URL is required'
      }, { status: 400 })
    }

    // Validate URL
    try {
      const urlObj = new URL(url)
      if (!urlObj.hostname.includes('openlane') && !urlObj.hostname.includes('copart')) {
        return NextResponse.json({
          success: false,
          error: 'URL must be from OpenLane or Copart'
        }, { status: 400 })
      }
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Invalid URL provided'
      }, { status: 400 })
    }

    // Try to use Playwright for scraping
    try {
      const { chromium } = await import("playwright")
      
      // Launch browser
      const browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      })

      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      })

      const page = await context.newPage()

      // Navigate to the page
      await page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      })

      // Wait for content to load
      await page.waitForTimeout(3000)

      let carData = null

      if (url.includes('openlane')) {
        carData = await scrapeOpenLane(page)
      } else if (url.includes('copart')) {
        carData = await scrapeCopart(page)
      }

      await browser.close()

      if (!carData) {
        throw new Error('Failed to extract car data from the provided URL')
      }

      return NextResponse.json({
        success: true,
        carData
      })

    } catch (playwrightError) {
      const error = playwrightError as Error & { code?: string }
      console.error('Playwright error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code
      })
      
      // Check if this is a browser launch error specifically
      if (error.message?.includes('browserType.launch')) {
        console.error('Browser launch failed - this suggests Playwright browsers are not properly installed for the runtime environment')
      }
      
      // Try basic HTML fetch as fallback
      try {
        console.log('Trying basic HTML fetch fallback...')
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        })

        if (response.ok) {
          const html = await response.text()
          const basicData = extractBasicDataFromHTML(html, url)
          
          if (basicData) {
            return NextResponse.json({
              success: true,
              carData: basicData,
              warning: 'Date extrase cu metoda simplificată. Pentru extragere completă, instalează Playwright browsers.'
            })
          }
        }
      } catch (fetchError) {
        console.error('Basic fetch also failed:', fetchError)
      }
      
      // Return proper error when both methods fail
      return NextResponse.json({
        success: false,
        error: 'Browserele Playwright nu sunt disponibile. Pentru a activa extragerea automată, rulează în terminal:\n\n1. npx playwright install\n2. sudo npx playwright install-deps\n\nSau dacă ai probleme cu sudo:\nsudo apt-get install libnspr4 libnss3 libasound2\n\nDupă instalare, funcția va funcționa automat.'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('API error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process request'
    }, { status: 500 })
  }
}


async function scrapeOpenLane(page: import('playwright').Page) {
  try {
    // Extract basic car information
    const title = await page.textContent('h1').catch(() => '') || ''
    
    // Try to extract make, model, year from title
    const titleParts = title.split(' ')
    const year = titleParts.find((part: string) => /^\d{4}$/.test(part)) || ''
    const make = titleParts[0] || ''
    const model = titleParts.slice(1, titleParts.indexOf(year)).join(' ') || ''

    // Extract price
    const price = await page.textContent('[data-testid="current-bid"], .price, .bid-amount').catch(() => '') || 'N/A'

    // Extract mileage
    const mileage = await page.textContent('[data-testid="mileage"], .mileage').catch(() => '') || 'N/A'

    // Extract condition
    const condition = await page.textContent('[data-testid="condition"], .condition').catch(() => '') || 'Unknown'

    // Extract VIN
    const vin = await page.textContent('[data-testid="vin"], .vin').catch(() => '') || ''

    // Extract location
    const location = await page.textContent('[data-testid="location"], .location').catch(() => '') || ''

    // Extract description
    const description = await page.textContent('[data-testid="description"], .description').catch(() => '') || ''

    // Extract images
    const images = await page.$$eval('img[src*="vehicle"], img[src*="car"]', (imgs: HTMLImageElement[]) => 
      imgs.map(img => img.src).filter(src => src.includes('vehicle') || src.includes('car')).slice(0, 10)
    ).catch(() => [])

    return {
      title: title.trim(),
      make: make.trim(),
      model: model.trim(),
      year: parseInt(year) || new Date().getFullYear(),
      price: price.trim(),
      mileage: mileage.trim(),
      condition: condition.trim(),
      vin: vin.trim(),
      images,
      description: description.trim(),
      location: location.trim(),
      seller: 'OpenLane'
    }
  } catch (error) {
    console.error('OpenLane scraping error:', error)
    throw new Error('Failed to extract data from OpenLane')
  }
}

async function scrapeCopart(page: import('playwright').Page) {
  try {
    // Extract basic car information
    const title = await page.textContent('h1, .lot-title').catch(() => '') || ''
    
    // Try to extract make, model, year from title
    const titleParts = title.split(' ')
    const year = titleParts.find((part: string) => /^\d{4}$/.test(part)) || ''
    const make = titleParts[0] || ''
    const model = titleParts.slice(1, titleParts.indexOf(year)).join(' ') || ''

    // Extract price
    const price = await page.textContent('.current-bid, .bid-amt, .price-display').catch(() => '') || 'N/A'

    // Extract mileage
    const mileage = await page.textContent('.odometer, .mileage').catch(() => '') || 'N/A'

    // Extract condition
    const condition = await page.textContent('.damage, .condition').catch(() => '') || 'Unknown'

    // Extract VIN
    const vin = await page.textContent('.vin').catch(() => '') || ''

    // Extract location
    const location = await page.textContent('.location, .lot-location').catch(() => '') || ''

    // Extract description
    const description = await page.textContent('.lot-details, .vehicle-info').catch(() => '') || ''

    // Extract images
    const images = await page.$$eval('img[src*="copart"], img[data-src*="copart"]', (imgs: HTMLImageElement[]) => 
      imgs.map(img => img.src || img.dataset.src).filter(Boolean).slice(0, 10)
    ).catch(() => [])

    return {
      title: title.trim(),
      make: make.trim(),
      model: model.trim(),
      year: parseInt(year) || new Date().getFullYear(),
      price: price.trim(),
      mileage: mileage.trim(),
      condition: condition.trim(),
      vin: vin.trim(),
      images,
      description: description.trim(),
      location: location.trim(),
      seller: 'Copart'
    }
  } catch (error) {
    console.error('Copart scraping error:', error)
    throw new Error('Failed to extract data from Copart')
  }
}

function extractBasicDataFromHTML(html: string, url: string) {
  try {
    // Simple HTML parsing fallback - extracts basic information using regex
    const titleMatch = html.match(/<title[^>]*>([^<]+)</i)
    const title = titleMatch ? titleMatch[1].trim() : ''
    
    // Extract year, make, model from title
    const titleParts = title.split(' ')
    const year = titleParts.find(part => /^\d{4}$/.test(part)) || ''
    const make = titleParts[0] || ''
    const model = titleParts.slice(1, titleParts.indexOf(year)).join(' ') || ''
    
    // Extract images using basic regex
    const imgMatches = html.match(/<img[^>]+src=['"](https?:\/\/[^'"]+)['"]/gi) || []
    const images = imgMatches
      .map(match => {
        const srcMatch = match.match(/src=['"](https?:\/\/[^'"]+)['"]/i)
        return srcMatch ? srcMatch[1] : null
      })
      .filter(Boolean)
      .slice(0, 5) // Limit to first 5 images
    
    const seller = url.includes('openlane') ? 'OpenLane' : 'Copart'
    
    return {
      title: title.trim(),
      make: make.trim(),
      model: model.trim(),
      year: parseInt(year) || new Date().getFullYear(),
      price: 'N/A',
      mileage: 'N/A',
      condition: 'Unknown',
      vin: '',
      images,
      description: '',
      location: '',
      seller
    }
  } catch (error) {
    console.error('Basic HTML extraction failed:', error)
    return null
  }
}