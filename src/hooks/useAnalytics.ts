'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// ─── Consent ────────────────────────────────────────────────────────────────

function hasAnalyticsConsent(): boolean {
  try {
    const raw = localStorage.getItem('cookie-consent')
    if (!raw) return false
    return JSON.parse(raw)?.preferences?.analytics === true
  } catch { return false }
}

// ─── Device / Browser / OS ──────────────────────────────────────────────────

function parseUserAgent() {
  const ua = navigator.userAgent

  let deviceType = 'desktop'
  if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua))            deviceType = 'tablet'
  else if (/Mobi|Android|iPhone|iPod|IEMobile|Opera Mini/i.test(ua)) deviceType = 'mobile'

  let browser = 'Other'
  if      (/Edg\//i.test(ua))                                  browser = 'Edge'
  else if (/OPR\/|Opera/i.test(ua))                            browser = 'Opera'
  else if (/SamsungBrowser/i.test(ua))                         browser = 'Samsung'
  else if (/Chrome\/\d/i.test(ua) && !/Chromium/i.test(ua))   browser = 'Chrome'
  else if (/Firefox\/\d/i.test(ua))                            browser = 'Firefox'
  else if (/Safari\/\d/i.test(ua) && !/Chrome/i.test(ua))     browser = 'Safari'

  let os = 'Other'
  if      (/Windows NT/i.test(ua))        os = 'Windows'
  else if (/iPhone|iPad|iPod/i.test(ua))  os = 'iOS'
  else if (/Android/i.test(ua))           os = 'Android'
  else if (/Mac OS X/i.test(ua))          os = 'macOS'
  else if (/CrOS/i.test(ua))              os = 'ChromeOS'
  else if (/Linux/i.test(ua))             os = 'Linux'

  return { deviceType, browser, os }
}

// ─── UTM params ─────────────────────────────────────────────────────────────

function captureUTMParams(): Record<string, string> {
  try {
    const stored = sessionStorage.getItem('am_utm')
    if (stored) return JSON.parse(stored)

    const params = new URLSearchParams(window.location.search)
    const utm: Record<string, string> = {}
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      const val = params.get(key)
      if (val) utm[key.replace('utm_', '')] = val
    }
    if (Object.keys(utm).length > 0) sessionStorage.setItem('am_utm', JSON.stringify(utm))
    return utm
  } catch { return {} }
}

// ─── Visitor / Session IDs ───────────────────────────────────────────────────

async function generateVisitorId(): Promise<string> {
  const raw = [
    navigator.userAgent, navigator.language,
    `${screen.width}x${screen.height}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    String(navigator.hardwareConcurrency ?? ''),
  ].join('|')
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function getOrCreateVisitorId(): Promise<{ id: string; isNewVisitor: boolean }> {
  const stored = localStorage.getItem('am_vid')
  if (stored) return { id: stored, isNewVisitor: false }
  const id = await generateVisitorId()
  localStorage.setItem('am_vid', id)
  return { id, isNewVisitor: true }
}

function getOrCreateSessionId(): string {
  const stored = sessionStorage.getItem('am_sid')
  if (stored) return stored
  const id = crypto.randomUUID()
  sessionStorage.setItem('am_sid', id)
  return id
}

function getOrSetEntryPage(path: string): string {
  const stored = sessionStorage.getItem('am_entry')
  if (stored) return stored
  sessionStorage.setItem('am_entry', path)
  return path
}

// ─── Send ────────────────────────────────────────────────────────────────────

interface PageViewPayload {
  visitorId: string
  sessionId: string
  pagePath: string
  pageTitle: string
  referrer: string
  durationMs?: number
  scrollDepth?: number
  deviceType?: string
  browser?: string
  os?: string
  isNewVisitor?: boolean
  entryPage?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
}

function sendPageView(payload: PageViewPayload): void {
  const body = JSON.stringify(payload)
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/track', new Blob([body], { type: 'application/json' }))
  } else {
    fetch('/api/analytics/track', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true,
    }).catch(() => {})
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAnalytics() {
  const pathname = usePathname()
  const idsRef       = useRef<{ visitorId: string; sessionId: string; isNewVisitor: boolean } | null>(null)
  const deviceRef    = useRef<ReturnType<typeof parseUserAgent> | null>(null)
  const utmRef       = useRef<Record<string, string>>({})
  const pageEntryRef = useRef<number>(Date.now())
  const prevPathRef  = useRef<string | null>(null)
  const maxScrollRef = useRef<number>(0)

  // Track max scroll depth per page — reset happens in the tracking effect below
  useEffect(() => {
    const handle = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      if (h <= 0) return
      const pct = Math.min(100, Math.round((window.scrollY / h) * 100))
      if (pct > maxScrollRef.current) maxScrollRef.current = pct
    }
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [pathname])

  // Main page view tracking
  useEffect(() => {
    if (!hasAnalyticsConsent()) return
    if (pathname.startsWith('/dashboard')) return

    // Capture scroll depth synchronously before any async work or reset
    const scrollDepth = maxScrollRef.current
    maxScrollRef.current = 0

    let cancelled = false

    async function run() {
      if (!deviceRef.current) deviceRef.current = parseUserAgent()
      utmRef.current = captureUTMParams()

      if (!idsRef.current) {
        const { id: visitorId, isNewVisitor } = await getOrCreateVisitorId()
        const sessionId = getOrCreateSessionId()
        if (cancelled) return
        idsRef.current = { visitorId, sessionId, isNewVisitor }
      }

      const { visitorId, sessionId, isNewVisitor } = idsRef.current
      const { deviceType, browser, os } = deviceRef.current!
      const utm = utmRef.current
      const entryPage = getOrSetEntryPage(pathname)

      // Send previous page with its accumulated duration + scroll depth
      if (prevPathRef.current && prevPathRef.current !== pathname
          && !prevPathRef.current.startsWith('/dashboard')) {
        sendPageView({
          visitorId, sessionId,
          pagePath: prevPathRef.current,
          pageTitle: '', referrer: document.referrer,
          durationMs: Date.now() - pageEntryRef.current,
          scrollDepth,
          deviceType, browser, os,
          isNewVisitor, entryPage,
          ...(utm.source   && { utmSource:   utm.source   }),
          ...(utm.medium   && { utmMedium:   utm.medium   }),
          ...(utm.campaign && { utmCampaign: utm.campaign }),
          ...(utm.content  && { utmContent:  utm.content  }),
          ...(utm.term     && { utmTerm:     utm.term     }),
        })
      }

      pageEntryRef.current = Date.now()
      prevPathRef.current = pathname

      await new Promise(r => setTimeout(r, 150))
      if (cancelled) return

      sendPageView({
        visitorId, sessionId,
        pagePath: pathname, pageTitle: document.title, referrer: document.referrer,
        deviceType, browser, os,
        isNewVisitor, entryPage,
        ...(utm.source   && { utmSource:   utm.source   }),
        ...(utm.medium   && { utmMedium:   utm.medium   }),
        ...(utm.campaign && { utmCampaign: utm.campaign }),
        ...(utm.content  && { utmContent:  utm.content  }),
        ...(utm.term     && { utmTerm:     utm.term     }),
      })
    }

    run()
    return () => { cancelled = true }
  }, [pathname])

  // Send final event on tab close / backgrounding
  useEffect(() => {
    function handleEnd() {
      if (!hasAnalyticsConsent() || !idsRef.current || !prevPathRef.current) return
      if (prevPathRef.current.startsWith('/dashboard')) return
      const { visitorId, sessionId, isNewVisitor } = idsRef.current
      const utm = utmRef.current
      sendPageView({
        visitorId, sessionId,
        pagePath: prevPathRef.current,
        pageTitle: document.title, referrer: document.referrer,
        durationMs: Date.now() - pageEntryRef.current,
        scrollDepth: maxScrollRef.current,
        ...(deviceRef.current ?? {}),
        isNewVisitor,
        entryPage: sessionStorage.getItem('am_entry') ?? prevPathRef.current,
        ...(utm.source   && { utmSource:   utm.source   }),
        ...(utm.medium   && { utmMedium:   utm.medium   }),
        ...(utm.campaign && { utmCampaign: utm.campaign }),
      })
    }
    window.addEventListener('beforeunload', handleEnd)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') handleEnd()
    })
    return () => window.removeEventListener('beforeunload', handleEnd)
  }, [])
}
