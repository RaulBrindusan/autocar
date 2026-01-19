import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

const CACHE_KEY = 'mixpanel:analytics:dashboard'

/**
 * Clear the analytics cache (for testing/debugging)
 * GET /api/analytics/mixpanel/clear-cache
 */
export async function GET() {
  try {
    if (!redis) {
      return NextResponse.json({ message: 'Redis not configured - no cache to clear' })
    }

    await redis.del(CACHE_KEY)
    console.log('Cleared Mixpanel analytics cache')

    return NextResponse.json({
      success: true,
      message: 'Analytics cache cleared successfully'
    })
  } catch (error) {
    console.error('Error clearing cache:', error)
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    )
  }
}
