import { z } from 'zod'
import crypto from 'crypto'

// List of common disposable email domains (you can expand this list)
const DISPOSABLE_EMAIL_DOMAINS = [
  '10minutemail.com',
  'tempmail.org',
  'guerrillamail.com',
  'mailinator.com',
  'yopmail.com',
  'temp-mail.org',
  'throwaway.email',
  'dispostable.com',
  'maildrop.cc',
  'mailtemp.info',
  'sharklasers.com',
  'getnada.com',
  'mohmal.com',
  'emailondeck.com',
  'tempmailo.com',
  '20minutemail.it',
  'mail-temp.com',
  'fakemailgenerator.com',
  'fake-mail.ml',
  'throwawaymail.com'
]

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  // Length check
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('Parola trebuie să aibă cel puțin 8 caractere')
  }

  if (password.length >= 12) {
    score += 1
  }

  // Complexity checks
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Parola trebuie să conțină cel puțin o literă mică')
  }

  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Parola trebuie să conțină cel puțin o literă mare')
  }

  if (/[0-9]/.test(password)) {
    score += 1
  } else {
    feedback.push('Parola trebuie să conțină cel puțin o cifră')
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1
  } else {
    feedback.push('Parola trebuie să conțină cel puțin un caracter special')
  }

  // Common patterns check
  const commonPatterns = [
    /(.)\1{2,}/, // repeated characters
    /123456|654321|qwerty|password|admin/i, // common sequences
  ]

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      score -= 1
      feedback.push('Parola conține secvențe comune sau caractere repetitive')
      break
    }
  }

  const isValid = score >= 4 && feedback.length === 0
  
  return {
    isValid,
    score: Math.max(0, Math.min(5, score)),
    feedback
  }
}

/**
 * Check if email domain is disposable
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1]
  if (!domain) return false
  
  return DISPOSABLE_EMAIL_DOMAINS.includes(domain)
}

/**
 * Enhanced email validation
 */
export function validateEmail(email: string): {
  isValid: boolean
  issues: string[]
} {
  const issues: string[] = []
  
  // Basic format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    issues.push('Format email invalid')
    return { isValid: false, issues }
  }
  
  // Check for disposable email
  if (isDisposableEmail(email)) {
    issues.push('Adresele email temporare nu sunt permise')
  }
  
  // Additional checks
  const [localPart, domain] = email.split('@')
  
  // Local part checks
  if (localPart.length > 64) {
    issues.push('Partea locală a email-ului este prea lungă')
  }
  
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    issues.push('Email-ul nu poate începe sau termina cu punct')
  }
  
  // Domain checks
  if (domain.length > 253) {
    issues.push('Domeniul email-ului este prea lung')
  }
  
  if (domain.includes('..')) {
    issues.push('Domeniul email-ului conține puncte consecutive')
  }
  
  return {
    isValid: issues.length === 0,
    issues
  }
}

/**
 * Honeypot field validation
 */
export function validateHoneypot(value: any): boolean {
  // Honeypot field should always be empty
  return !value || value === ''
}

/**
 * Form timing validation (to detect bots)
 */
export function validateFormTiming(startTime: number, minTime: number = 3000): boolean {
  const elapsed = Date.now() - startTime
  return elapsed >= minTime // Minimum 3 seconds to fill form
}

/**
 * Enhanced Zod schema for signup validation
 */
export const signupValidationSchema = z.object({
  email: z
    .string()
    .min(1, 'Email-ul este obligatoriu')
    .email('Format email invalid')
    .max(100, 'Email-ul este prea lung')
    .refine((email) => !isDisposableEmail(email), {
      message: 'Adresele email temporare nu sunt permise'
    }),
  
  password: z
    .string()
    .min(8, 'Parola trebuie să aibă cel puțin 8 caractere')
    .max(128, 'Parola este prea lungă')
    .refine((password) => validatePasswordStrength(password).isValid, {
      message: 'Parola nu respectă cerințele de complexitate'
    }),
  
  fullName: z
    .string()
    .min(2, 'Numele trebuie să aibă cel puțin 2 caractere')
    .max(100, 'Numele este prea lung')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Numele poate conține doar litere, spații, apostrofuri și cratime'),
  
  phone: z
    .string()
    .optional()
    .refine((phone) => {
      if (!phone) return true
      // Romanian phone number validation
      const phoneRegex = /^(\+40|0040|0)[2-9][0-9]{8}$/
      return phoneRegex.test(phone.replace(/\s/g, ''))
    }, {
      message: 'Numărul de telefon nu este valid pentru România'
    }),
  
  // Honeypot field
  website: z
    .string()
    .max(0, 'Câmp invalid')
    .optional()
    .refine(validateHoneypot, {
      message: 'Detectat comportament suspect'
    }),
  
  // Form timing
  formStartTime: z
    .number()
    .refine((startTime) => validateFormTiming(startTime), {
      message: 'Formularul a fost completat prea rapid'
    }),
  
  // Terms acceptance
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Trebuie să acceptați termenii și condițiile'
    }),
  
  // Privacy policy acceptance
  acceptPrivacy: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Trebuie să acceptați politica de confidențialitate'
    })
})

export type SignupFormData = z.infer<typeof signupValidationSchema>

/**
 * Generate form token for CSRF protection
 */
export function generateFormToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Validate form token
 */
export function validateFormToken(token: string, expectedToken: string): boolean {
  return crypto.timingSafeEqual(
    Buffer.from(token, 'hex'),
    Buffer.from(expectedToken, 'hex')
  )
}

/**
 * Create secure form session
 */
export function createFormSession() {
  const token = generateFormToken()
  const startTime = Date.now()
  
  return {
    token,
    startTime,
    expiresAt: startTime + (30 * 60 * 1000) // 30 minutes
  }
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000) // Limit length
}

/**
 * Check for suspicious patterns in user data
 */
export function detectSuspiciousPatterns(data: Partial<SignupFormData>): string[] {
  const issues: string[] = []
  
  // Check for SQL injection patterns
  const sqlPatterns = /('|(\\x27)|(\\x2D)|(-)|(%27)|(%2D)|(union)|(select)|(insert)|(delete)|(update)|(drop)|(create)|(alter))/i
  
  Object.values(data).forEach((value) => {
    if (typeof value === 'string' && sqlPatterns.test(value)) {
      issues.push('Detectat încercare de injecție SQL')
    }
  })
  
  // Check for XSS patterns
  const xssPatterns = /(<script|javascript:|on\w+\s*=)/i
  
  Object.values(data).forEach((value) => {
    if (typeof value === 'string' && xssPatterns.test(value)) {
      issues.push('Detectat încercare de XSS')
    }
  })
  
  return issues
}