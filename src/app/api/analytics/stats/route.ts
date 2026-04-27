import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const API_KEY    = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
const BASE       = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : null

const VALID_PERIODS = ['1d', '7d', '30d', '90d', '1y'] as const
type Period = (typeof VALID_PERIODS)[number]
const TTL: Record<Period, number> = { '1d': 300, '7d': 600, '30d': 900, '90d': 1800, '1y': 3600 }

function getFromDate(period: Period): Date {
  const day = 24 * 60 * 60 * 1000
  const offsets: Record<Period, number> = { '1d': day, '7d': 7*day, '30d': 30*day, '90d': 90*day, '1y': 365*day }
  return new Date(Date.now() - offsets[period])
}

type Trunc = 'hour' | 'day' | 'month'
function getTrunc(p: Period): Trunc {
  if (p === '1d') return 'hour'
  if (p === '1y') return 'month'
  return 'day'
}
function getBucketKey(date: Date, trunc: Trunc): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  if (trunc === 'hour')  return `${y}-${m}-${d}T${h}:00`
  if (trunc === 'day')   return `${y}-${m}-${d}`
  return `${y}-${m}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseValue(val: Record<string, any>): unknown {
  if ('stringValue'    in val) return val.stringValue
  if ('integerValue'   in val) return parseInt(val.integerValue, 10)
  if ('doubleValue'    in val) return val.doubleValue
  if ('booleanValue'   in val) return val.booleanValue
  if ('timestampValue' in val) return new Date(val.timestampValue)
  if ('nullValue'      in val) return null
  return null
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseDoc(fields: Record<string, any>): Record<string, unknown> {
  const obj: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(fields)) obj[k] = parseValue(v)
  return obj
}

interface PageViewDoc {
  visitorId:    string
  sessionId:    string
  pagePath:     string
  durationMs:   number | null
  scrollDepth:  number | null
  createdAt:    Date
  deviceType:   string
  browser:      string
  os:           string
  isNewVisitor: boolean
  utmSource:    string
  utmMedium:    string
  utmCampaign:  string
}

async function queryPageViews(from: Date): Promise<PageViewDoc[]> {
  const res = await fetch(`${BASE}:runQuery?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'page_views' }],
        where: { fieldFilter: {
          field: { fieldPath: 'createdAt' },
          op: 'GREATER_THAN_OR_EQUAL',
          value: { timestampValue: from.toISOString() },
        }},
        orderBy: [{ field: { fieldPath: 'createdAt' }, direction: 'ASCENDING' }],
      }
    }),
  })
  if (!res.ok) throw new Error(`Firestore query ${res.status}: ${await res.text()}`)

  const rows: unknown[] = await res.json()
  return rows
    .filter((r): r is { document: { fields: Record<string, unknown> } } =>
      !!(r as Record<string, unknown>).document)
    .map(r => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = parseDoc(r.document.fields as Record<string, any>)
      return {
        visitorId:    (p.visitorId   as string)  || '',
        sessionId:    (p.sessionId   as string)  || '',
        pagePath:     (p.pagePath    as string)  || '/',
        durationMs:   (p.durationMs  as number | null) ?? null,
        scrollDepth:  (p.scrollDepth as number | null) ?? null,
        createdAt:    (p.createdAt   as Date)    || new Date(),
        deviceType:   (p.deviceType  as string)  || '',
        browser:      (p.browser     as string)  || '',
        os:           (p.os          as string)  || '',
        isNewVisitor: Boolean(p.isNewVisitor),
        utmSource:    (p.utmSource   as string)  || '',
        utmMedium:    (p.utmMedium   as string)  || '',
        utmCampaign:  (p.utmCampaign as string)  || '',
      }
    })
}

function topN(map: Map<string, number>, n = 6): { name: string; count: number }[] {
  return Array.from(map.entries())
    .filter(([name]) => name)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const period = (searchParams.get('period') ?? '30d') as Period
  if (!VALID_PERIODS.includes(period)) return NextResponse.json({ error: 'Invalid period' }, { status: 400 })

  const cacheKey = `analytics:stats:v2:${period}`
  if (redis) {
    const cached = await redis.get(cacheKey).catch(() => null)
    if (cached) return NextResponse.json(cached)
  }

  let docs: PageViewDoc[]
  try { docs = await queryPageViews(getFromDate(period)) }
  catch (err) {
    console.error('analytics stats error:', err)
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  const trunc = getTrunc(period)

  // ── Core metrics ──────────────────────────────────────────────────────────
  const totalViews    = docs.length
  const uniqueSet     = new Set(docs.map(d => d.visitorId))
  const uniqueVisitors = uniqueSet.size

  // New vs returning (a visitor is "new" if any page view has isNewVisitor=true)
  const newVisitorIds       = new Set(docs.filter(d => d.isNewVisitor).map(d => d.visitorId))
  const returningVisitorIds = new Set([...uniqueSet].filter(id => !newVisitorIds.has(id)))
  const newVisitors         = newVisitorIds.size
  const returningVisitors   = returningVisitorIds.size

  // Bounce rate (sessions with exactly 1 page view)
  const sessionCounts = new Map<string, number>()
  for (const d of docs) sessionCounts.set(d.sessionId, (sessionCounts.get(d.sessionId) ?? 0) + 1)
  const totalSessions  = sessionCounts.size
  const bouncedSessions = [...sessionCounts.values()].filter(c => c === 1).length
  const bounceRate     = totalSessions > 0 ? Math.round((bouncedSessions / totalSessions) * 100) : 0

  // Avg session duration
  const sessionTotals = new Map<string, number>()
  for (const d of docs) {
    if (d.durationMs != null && d.durationMs > 0)
      sessionTotals.set(d.sessionId, (sessionTotals.get(d.sessionId) ?? 0) + d.durationMs)
  }
  const durations = [...sessionTotals.values()]
  const avgDurationMs = durations.length > 0
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : null

  // Avg scroll depth
  const scrollValues = docs.map(d => d.scrollDepth).filter((v): v is number => v !== null)
  const avgScrollDepth = scrollValues.length > 0
    ? Math.round(scrollValues.reduce((a, b) => a + b, 0) / scrollValues.length) : null

  // ── Breakdowns ────────────────────────────────────────────────────────────
  const deviceMap   = new Map<string, number>()
  const browserMap  = new Map<string, number>()
  const osMap       = new Map<string, number>()
  const utmMap      = new Map<string, number>()
  const pageMap     = new Map<string, { views: number; visitors: Set<string> }>()
  const bucketMap   = new Map<string, { views: number; visitors: Set<string> }>()

  for (const d of docs) {
    if (d.deviceType) deviceMap.set(d.deviceType,  (deviceMap.get(d.deviceType)   ?? 0) + 1)
    if (d.browser)    browserMap.set(d.browser,    (browserMap.get(d.browser)     ?? 0) + 1)
    if (d.os)         osMap.set(d.os,              (osMap.get(d.os)               ?? 0) + 1)
    if (d.utmSource)  utmMap.set(d.utmSource,      (utmMap.get(d.utmSource)       ?? 0) + 1)

    const pe = pageMap.get(d.pagePath) ?? { views: 0, visitors: new Set<string>() }
    pe.views++; pe.visitors.add(d.visitorId); pageMap.set(d.pagePath, pe)

    const bk = getBucketKey(d.createdAt, trunc)
    const be = bucketMap.get(bk) ?? { views: 0, visitors: new Set<string>() }
    be.views++; be.visitors.add(d.visitorId); bucketMap.set(bk, be)
  }

  const topPages = Array.from(pageMap.entries())
    .map(([pagePath, { views, visitors }]) => ({ pagePath, views, uniqueVisitors: visitors.size }))
    .sort((a, b) => b.views - a.views).slice(0, 10)

  const viewsOverTime = Array.from(bucketMap.entries())
    .map(([bucket, { views, visitors }]) => ({ bucket, views, uniqueVisitors: visitors.size }))
    .sort((a, b) => a.bucket.localeCompare(b.bucket))

  const result = {
    period, totalViews, uniqueVisitors, avgDurationMs,
    newVisitors, returningVisitors, bounceRate, avgScrollDepth,
    topPage: topPages[0]?.pagePath ?? null,
    topPages, viewsOverTime,
    devices:     topN(deviceMap),
    browsers:    topN(browserMap),
    os:          topN(osMap),
    utmSources:  topN(utmMap),
    generatedAt: new Date().toISOString(),
  }

  if (redis) await redis.set(cacheKey, result, { ex: TTL[period] }).catch(() => {})
  return NextResponse.json(result)
}
