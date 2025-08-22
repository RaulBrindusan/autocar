import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { 
  rateLimitSignupByIP, 
  rateLimitSignupByEmail, 
  rateLimitSignupGlobal,
  getClientIP,
  createRateLimitHeaders
} from '@/lib/rate-limit'
import { 
  signupValidationSchema, 
  detectSuspiciousPatterns,
  sanitizeInput,
  validateFormToken 
} from '@/lib/security-validation'
import { z } from 'zod'

// Security logging interface
interface SecurityEvent {
  type: 'rate_limit' | 'validation_error' | 'suspicious_activity' | 'signup_success' | 'signup_error'
  ip: string
  userAgent: string
  timestamp: number
  details: any
}

/**
 * Log security events (in production, send to monitoring service)
 */
function logSecurityEvent(event: SecurityEvent) {
  console.log('SECURITY EVENT:', JSON.stringify(event, null, 2))
  // TODO: In production, send to logging service like DataDog, Sentry, etc.
}

/**
 * Verify Cloudflare Turnstile token
 */
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!process.env.CLOUDFLARE_TURNSTILE_SECRET) {
    console.warn('Cloudflare Turnstile not configured, skipping verification')
    return true // Allow in development
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.CLOUDFLARE_TURNSTILE_SECRET,
        response: token,
        remoteip: ip,
      }),
    })

    const result = await response.json()
    return result.success === true
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const ip = getClientIP(request)
  const userAgent = request.headers.get('User-Agent') || 'unknown'
  
  try {
    // Parse and validate request body
    const body = await request.json()
    
    // Rate limiting checks
    const [ipRateLimit, emailRateLimit, globalRateLimit] = await Promise.all([
      rateLimitSignupByIP(ip),
      body.email ? rateLimitSignupByEmail(body.email) : { success: true, remaining: 999, resetTime: 0, totalHits: 0 },
      rateLimitSignupGlobal()
    ])

    // Check rate limits
    if (!ipRateLimit.success) {
      logSecurityEvent({
        type: 'rate_limit',
        ip,
        userAgent,
        timestamp: startTime,
        details: { 
          limitType: 'ip',
          remaining: ipRateLimit.remaining,
          resetTime: ipRateLimit.resetTime
        }
      })

      return NextResponse.json(
        { 
          error: 'Prea multe încercări de înregistrare. Încercați din nou mai târziu.',
          code: 'RATE_LIMIT_IP'
        },
        { 
          status: 429,
          headers: createRateLimitHeaders(ipRateLimit)
        }
      )
    }

    if (!emailRateLimit.success) {
      logSecurityEvent({
        type: 'rate_limit',
        ip,
        userAgent,
        timestamp: startTime,
        details: { 
          limitType: 'email',
          email: body.email,
          remaining: emailRateLimit.remaining
        }
      })

      return NextResponse.json(
        { 
          error: 'Prea multe încercări cu acest email. Încercați din nou mai târziu.',
          code: 'RATE_LIMIT_EMAIL'
        },
        { 
          status: 429,
          headers: createRateLimitHeaders(emailRateLimit)
        }
      )
    }

    if (!globalRateLimit.success) {
      logSecurityEvent({
        type: 'rate_limit',
        ip,
        userAgent,
        timestamp: startTime,
        details: { 
          limitType: 'global',
          remaining: globalRateLimit.remaining
        }
      })

      return NextResponse.json(
        { 
          error: 'Serviciul este temporar suprasolicitat. Încercați din nou în câteva minute.',
          code: 'RATE_LIMIT_GLOBAL'
        },
        { 
          status: 429,
          headers: createRateLimitHeaders(globalRateLimit)
        }
      )
    }

    // Verify Cloudflare Turnstile
    if (body.turnstileToken) {
      const turnstileValid = await verifyTurnstile(body.turnstileToken, ip)
      if (!turnstileValid) {
        logSecurityEvent({
          type: 'validation_error',
          ip,
          userAgent,
          timestamp: startTime,
          details: { error: 'Invalid Turnstile token' }
        })

        return NextResponse.json(
          { 
            error: 'Verificarea de securitate a eșuat. Reîncărcați pagina și încercați din nou.',
            code: 'TURNSTILE_FAILED'
          },
          { status: 400 }
        )
      }
    }

    // Sanitize inputs
    const sanitizedBody = {
      ...body,
      email: sanitizeInput(body.email || ''),
      fullName: sanitizeInput(body.fullName || ''),
      phone: sanitizeInput(body.phone || ''),
    }

    // Check for suspicious patterns
    const suspiciousPatterns = detectSuspiciousPatterns(sanitizedBody)
    if (suspiciousPatterns.length > 0) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        userAgent,
        timestamp: startTime,
        details: { 
          patterns: suspiciousPatterns,
          data: sanitizedBody
        }
      })

      return NextResponse.json(
        { 
          error: 'Date invalide detectate. Vă rugăm să verificați informațiile introduse.',
          code: 'SUSPICIOUS_ACTIVITY'
        },
        { status: 400 }
      )
    }

    // Validate form data with enhanced schema
    const validationResult = signupValidationSchema.safeParse(sanitizedBody)
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))

      logSecurityEvent({
        type: 'validation_error',
        ip,
        userAgent,
        timestamp: startTime,
        details: { 
          validationErrors: errors,
          data: sanitizedBody
        }
      })

      return NextResponse.json(
        { 
          error: 'Date de înregistrare invalide.',
          code: 'VALIDATION_ERROR',
          details: errors
        },
        { status: 400 }
      )
    }

    const validData = validationResult.data

    // Create Supabase client
    const supabase = createClient()

    // Attempt to sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validData.email,
      password: validData.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        data: {
          full_name: validData.fullName,
          phone: validData.phone || null,
        },
      },
    })

    if (authError) {
      logSecurityEvent({
        type: 'signup_error',
        ip,
        userAgent,
        timestamp: startTime,
        details: { 
          error: authError.message,
          email: validData.email
        }
      })

      // Handle specific Supabase errors
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { 
            error: 'Un cont cu acest email există deja.',
            code: 'EMAIL_ALREADY_EXISTS'
          },
          { status: 409 }
        )
      }

      if (authError.message.includes('invalid email')) {
        return NextResponse.json(
          { 
            error: 'Formatul email-ului este invalid.',
            code: 'INVALID_EMAIL'
          },
          { status: 400 }
        )
      }

      if (authError.message.includes('weak password')) {
        return NextResponse.json(
          { 
            error: 'Parola este prea slabă. Vă rugăm să alegeți o parolă mai puternică.',
            code: 'WEAK_PASSWORD'
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { 
          error: 'Eroare la înregistrare. Vă rugăm să încercați din nou.',
          code: 'SIGNUP_ERROR'
        },
        { status: 500 }
      )
    }

    // Log successful signup
    logSecurityEvent({
      type: 'signup_success',
      ip,
      userAgent,
      timestamp: startTime,
      details: { 
        userId: authData.user?.id,
        email: validData.email,
        processingTime: Date.now() - startTime
      }
    })

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Contul a fost creat cu succes. Vă rugăm să verificați emailul pentru confirmarea contului.',
      user: {
        id: authData.user?.id,
        email: authData.user?.email,
        emailConfirmed: authData.user?.email_confirmed_at !== null
      }
    }, { 
      status: 201,
      headers: {
        ...createRateLimitHeaders(ipRateLimit),
        'X-Processing-Time': `${Date.now() - startTime}ms`
      }
    })

  } catch (error) {
    console.error('Signup API error:', error)
    
    logSecurityEvent({
      type: 'signup_error',
      ip,
      userAgent,
      timestamp: startTime,
      details: { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }
    })

    return NextResponse.json(
      { 
        error: 'Eroare internă de server. Vă rugăm să încercați din nou.',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  }
}