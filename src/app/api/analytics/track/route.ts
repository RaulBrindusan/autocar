import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIP } from '@/lib/rate-limit'

export const runtime = 'nodejs'

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const API_KEY    = process.env.NEXT_PUBLIC_FIREBASE_API_KEY

function isValidHex64(s: unknown): s is string {
  return typeof s === 'string' && /^[a-f0-9]{64}$/.test(s)
}
function isValidUUID(s: unknown): s is string {
  return typeof s === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s)
}
function isValidPath(s: unknown): s is string {
  return typeof s === 'string' && s.startsWith('/') && s.length < 500
}
function str(v: unknown, max = 200): string {
  return typeof v === 'string' ? v.slice(0, max) : ''
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request)
  const rl = await rateLimit({ identifier: `analytics:track:${ip}`, limit: 30, window: 60 })
  if (!rl.success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  let body: Record<string, unknown>
  try { body = await request.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const {
    visitorId, sessionId, pagePath, pageTitle, referrer,
    durationMs, scrollDepth,
    deviceType, browser, os,
    isNewVisitor, entryPage,
    utmSource, utmMedium, utmCampaign, utmContent, utmTerm,
  } = body

  if (!isValidHex64(visitorId)) return NextResponse.json({ error: 'Invalid visitorId' }, { status: 400 })
  if (!isValidUUID(sessionId))  return NextResponse.json({ error: 'Invalid sessionId'  }, { status: 400 })
  if (!isValidPath(pagePath))   return NextResponse.json({ error: 'Invalid pagePath'   }, { status: 400 })

  const validDuration    = typeof durationMs  === 'number' && durationMs  > 0 && durationMs  < 86_400_000 ? Math.round(durationMs)  : null
  const validScrollDepth = typeof scrollDepth === 'number' && scrollDepth >= 0 && scrollDepth <= 100       ? Math.round(scrollDepth) : null

  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/page_views?key=${API_KEY}`

  const firestoreDoc = {
    fields: {
      visitorId:    { stringValue: visitorId as string },
      sessionId:    { stringValue: sessionId as string },
      pagePath:     { stringValue: pagePath  as string },
      pageTitle:    { stringValue: str(pageTitle, 300) },
      referrer:     { stringValue: str(referrer,  500) },
      durationMs:   validDuration    !== null ? { integerValue: String(validDuration)    } : { nullValue: null },
      scrollDepth:  validScrollDepth !== null ? { integerValue: String(validScrollDepth) } : { nullValue: null },
      deviceType:   { stringValue: str(deviceType) },
      browser:      { stringValue: str(browser)    },
      os:           { stringValue: str(os)         },
      isNewVisitor: { booleanValue: Boolean(isNewVisitor) },
      entryPage:    { stringValue: str(entryPage, 500) },
      utmSource:    { stringValue: str(utmSource)   },
      utmMedium:    { stringValue: str(utmMedium)   },
      utmCampaign:  { stringValue: str(utmCampaign) },
      utmContent:   { stringValue: str(utmContent)  },
      utmTerm:      { stringValue: str(utmTerm)     },
      createdAt:    { timestampValue: new Date().toISOString() },
    }
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(firestoreDoc),
    })
    if (!res.ok) {
      console.error('Firestore write error:', await res.text())
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  } catch (err) {
    console.error('analytics track error:', err)
    return NextResponse.json({ error: 'Network error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
