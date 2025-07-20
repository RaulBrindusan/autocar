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
    // Wait for page to load completely
    await page.waitForLoadState('networkidle')
    
    // Extract comprehensive car information from OpenLane
    console.log('Extracting OpenLane car data...')
    
    // Basic information from header/title
    const title = await page.textContent('h1, .car-title, .vehicle-title').catch(() => '') || ''
    console.log('Title found:', title)
    
    // Extract price information
    const price = await page.evaluate(() => {
      // Look for price in various possible selectors
      const priceSelectors = [
        '.price-current', '.current-price', '.bid-amount', '.price-display',
        '[class*="price"]', '[class*="bid"]', '[data-testid*="price"]',
        'span:has-text("EUR")', 'div:has-text("EUR")'
      ]
      
      for (const selector of priceSelectors) {
        try {
          const element = document.querySelector(selector)
          if (element && element.textContent?.includes('EUR')) {
            return element.textContent.trim()
          }
        } catch (e) {}
      }
      return 'N/A'
    })
    
    // Extract images - comprehensive search
    const images = await page.evaluate(() => {
      const imageUrls = new Set<string>()
      
      // Find all images related to the car
      const imgElements = document.querySelectorAll('img')
      imgElements.forEach(img => {
        const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src')
        if (src && (
          src.includes('openlane') || 
          src.includes('carimgs') || 
          src.includes('vehicle') ||
          src.includes('auto') ||
          img.alt?.toLowerCase().includes('car') ||
          img.alt?.toLowerCase().includes('vehicle')
        )) {
          imageUrls.add(src)
        }
      })
      
      return Array.from(imageUrls).slice(0, 15)
    })
    
    // Extract detailed specifications from the page
    const specifications = await page.evaluate(() => {
      const specs: Record<string, string> = {}
      
      // Common specification selectors and patterns
      const specSelectors = [
        '.specifications', '.specs', '.vehicle-details', '.car-details',
        '.technical-data', '.fahrzeugdaten', '.vehicle-info'
      ]
      
      // Try to find specification containers
      for (const selector of specSelectors) {
        const container = document.querySelector(selector)
        if (container) {
          // Extract key-value pairs from the container
          const rows = container.querySelectorAll('tr, .spec-row, .detail-row')
          rows.forEach(row => {
            const cells = row.querySelectorAll('td, .spec-label, .spec-value, .detail-label, .detail-value')
            if (cells.length >= 2) {
              const key = cells[0].textContent?.trim()
              const value = cells[1].textContent?.trim()
              if (key && value) {
                specs[key] = value
              }
            }
          })
        }
      }
      
      // Also try to extract from any visible text patterns
      const allText = document.body.textContent || ''
      
      // Extract specific details using regex patterns
      const patterns: Record<string, RegExp> = {
        'Kilometraj': /(?:Kilometraj|Mileage|km)[\s:]*([0-9,.\s]+\s*km)/i,
        'Anul': /(?:Anul|Year|Baujahr)[\s:]*([0-9]{4})/i,
        'Prima înregistrare': /(?:Prima înregistrare|First registration|Erstzulassung)[\s:]*([0-9]{2}\/[0-9]{2}\/[0-9]{4})/i,
        'Combustibil': /(?:Combustibil|Fuel|Kraftstoff)[\s:]*([^\n\r]{3,30})/i,
        'Transmisie': /(?:Transmisie|Transmission|Getriebe)[\s:]*([^\n\r]{3,30})/i,
        'Putere': /(?:Putere|Power|Leistung)[\s:]*([0-9,.\s]+\s*(?:kW|HP|PS))/i,
        'Capacitate': /(?:Capacitate|Engine|Motor)[\s:]*([0-9,.\s]+\s*(?:cc|l))/i,
        'Culoare': /(?:Culoare|Color|Farbe)[\s:]*([^\n\r]{3,20})/i,
        'Usi': /(?:Uși|Doors|Türen)[\s:]*([0-9]+)/i,
        'Locuri': /(?:Locuri|Seats|Sitze)[\s:]*([0-9]+)/i
      }
      
      for (const [key, pattern] of Object.entries(patterns)) {
        const match = allText.match(pattern)
        if (match && match[1]) {
          specs[key] = match[1].trim()
        }
      }
      
      return specs
    })
    
    // Extract VIN if available
    const vin = await page.evaluate(() => {
      const vinPatterns = [
        /VIN[\s:]*([A-HJ-NPR-Z0-9]{17})/i,
        /(?:Numar de sasiu|Chassis)[\s:]*([A-HJ-NPR-Z0-9\*]{10,})/i
      ]
      
      const text = document.body.textContent || ''
      for (const pattern of vinPatterns) {
        const match = text.match(pattern)
        if (match && match[1]) {
          return match[1].trim()
        }
      }
      return ''
    })
    
    // Parse extracted data
    const make = title.split(' ')[0] || specifications['Marca'] || ''
    
    // Extract year - prioritize "Prima înregistrare" over other sources
    let year = new Date().getFullYear()
    if (specifications['Prima înregistrare']) {
      // Extract year from date format DD/MM/YYYY
      const dateMatch = specifications['Prima înregistrare'].match(/[0-9]{2}\/[0-9]{2}\/([0-9]{4})/)
      if (dateMatch) {
        year = parseInt(dateMatch[1])
      }
    } else if (specifications['Anul']) {
      const yearMatch = specifications['Anul'].match(/\b(20\d{2})\b/)
      if (yearMatch) {
        year = parseInt(yearMatch[1])
      }
    } else {
      // Fallback to title parsing
      const titleYearMatch = title.match(/\b(20\d{2})\b/)
      if (titleYearMatch) {
        year = parseInt(titleYearMatch[1])
      }
    }
    
    // Create comprehensive description
    const detailsArray = []
    for (const [key, value] of Object.entries(specifications)) {
      if (value && value !== 'N/A') {
        detailsArray.push(`${key}: ${value}`)
      }
    }
    const description = detailsArray.join('\n')
    
    const result = {
      title: title.trim(),
      make: make.trim(),
      model: title.replace(make, '').replace(/\b20\d{2}\b/, '').trim(),
      year,
      price: price.trim(),
      mileage: specifications['Kilometraj'] || 'N/A',
      condition: specifications['Conditie'] || 'Unknown',
      vin: vin.trim(),
      images,
      description: description.trim(),
      location: specifications['Locatie'] || '',
      seller: 'OpenLane',
      specifications
    }
    
    console.log('Extracted OpenLane data:', result)
    return result
    
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