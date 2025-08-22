import { Redis } from '@upstash/redis'

// Initialize Redis client
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

// Fallback in-memory store for development
const memoryStore = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitConfig {
  identifier: string
  limit: number
  window: number // in seconds
  skipSuccessfulRequests?: boolean
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  totalHits: number
}

/**
 * Rate limiting with Redis or memory fallback
 */
export async function rateLimit(config: RateLimitConfig): Promise<RateLimitResult> {
  const { identifier, limit, window, skipSuccessfulRequests = false } = config
  const key = `ratelimit:${identifier}`
  const now = Date.now()
  const windowMs = window * 1000

  try {
    if (redis) {
      // Use Redis for distributed rate limiting
      const multi = redis.multi()
      const windowStart = now - windowMs
      
      // Remove old entries outside the window
      multi.zremrangebyscore(key, 0, windowStart)
      
      // Count current requests in window
      multi.zcard(key)
      
      // Add current request
      multi.zadd(key, { score: now, member: `${now}-${Math.random()}` })
      
      // Set expiration
      multi.expire(key, window)
      
      const results = await multi.exec()
      const currentCount = (results[1] as number) || 0
      const newCount = currentCount + 1
      
      const success = newCount <= limit
      const remaining = Math.max(0, limit - newCount)
      const resetTime = now + windowMs
      
      return {
        success,
        remaining,
        resetTime,
        totalHits: newCount
      }
    } else {
      // Fallback to memory store
      const current = memoryStore.get(key)
      const windowStart = now - windowMs
      
      if (!current || current.resetTime < now) {
        // Reset window
        memoryStore.set(key, { count: 1, resetTime: now + windowMs })
        return {
          success: true,
          remaining: limit - 1,
          resetTime: now + windowMs,
          totalHits: 1
        }
      }
      
      const newCount = current.count + 1
      const success = newCount <= limit
      
      if (success || !skipSuccessfulRequests) {
        memoryStore.set(key, { count: newCount, resetTime: current.resetTime })
      }
      
      return {
        success,
        remaining: Math.max(0, limit - newCount),
        resetTime: current.resetTime,
        totalHits: newCount
      }
    }
  } catch (error) {
    console.error('Rate limiting error:', error)
    // On error, allow the request (fail open)
    return {
      success: true,
      remaining: limit - 1,
      resetTime: now + windowMs,
      totalHits: 1
    }
  }
}

/**
 * Rate limit by IP address for signup attempts
 */
export async function rateLimitSignupByIP(ip: string): Promise<RateLimitResult> {
  return rateLimit({
    identifier: `signup:ip:${ip}`,
    limit: 5, // 5 attempts per hour per IP
    window: 3600, // 1 hour
  })
}

/**
 * Rate limit by email for signup attempts
 */
export async function rateLimitSignupByEmail(email: string): Promise<RateLimitResult> {
  return rateLimit({
    identifier: `signup:email:${email.toLowerCase()}`,
    limit: 3, // 3 attempts per day per email
    window: 86400, // 24 hours
  })
}

/**
 * Global rate limit for all signup attempts
 */
export async function rateLimitSignupGlobal(): Promise<RateLimitResult> {
  return rateLimit({
    identifier: 'signup:global',
    limit: 100, // 100 signups per minute globally
    window: 60, // 1 minute
  })
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  // Check for Cloudflare IP
  const cfConnectingIP = request.headers.get('CF-Connecting-IP')
  if (cfConnectingIP) return cfConnectingIP
  
  // Check for other proxy headers
  const xForwardedFor = request.headers.get('X-Forwarded-For')
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }
  
  const xRealIP = request.headers.get('X-Real-IP')
  if (xRealIP) return xRealIP
  
  // Fallback
  return 'unknown'
}

/**
 * Create rate limit response headers
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.totalHits.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  }
}