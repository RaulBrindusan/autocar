import { z } from 'zod'

// Car request validation schema
export const carRequestSchema = z.object({
  // Required fields
  make: z.string()
    .min(1, 'Car make is required')
    .max(50, 'Car make must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s\-\.]+$/, 'Car make contains invalid characters'),
  
  model: z.string()
    .min(1, 'Car model is required')
    .max(50, 'Car model must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s\-\.]+$/, 'Car model contains invalid characters'),
  
  year: z.number()
    .min(1900, 'Year must be 1900 or later')
    .max(new Date().getFullYear() + 2, 'Year cannot be more than 2 years in the future')
    .int('Year must be a whole number'),
  
  budget: z.number()
    .min(1000, 'Budget must be at least €1,000')
    .max(1000000, 'Budget cannot exceed €1,000,000'),
  
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-ZăâîșțĂÂÎȘȚ\s\-\.\']+$/, 'Name contains invalid characters'),
  
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[\+]?[\d\s\-\(\)]+$/, 'Invalid phone number format'),

  // Optional fields
  fuelType: z.string()
    .max(20, 'Fuel type must be less than 20 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Fuel type contains invalid characters')
    .optional(),
  
  transmission: z.string()
    .max(20, 'Transmission must be less than 20 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Transmission contains invalid characters')
    .optional(),
  
  maxMileage: z.number()
    .min(0, 'Mileage cannot be negative')
    .max(999999, 'Mileage cannot exceed 999,999 km')
    .int('Mileage must be a whole number')
    .optional(),
  
  additionalNotes: z.string()
    .max(1000, 'Additional notes must be less than 1000 characters')
    .optional(),
  
  features: z.array(z.string())
    .max(20, 'Cannot have more than 20 features')
    .optional()
}).strict() // Reject unknown properties

export type CarRequestInput = z.infer<typeof carRequestSchema>

// Sanitize string input to prevent XSS
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
}

// Rate limiting helper (simple in-memory store for demo)
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 5 // requests per window
const RATE_WINDOW = 15 * 60 * 1000 // 15 minutes

export function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = requestCounts.get(ip)
  
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return false
  }
  
  if (record.count >= RATE_LIMIT) {
    return true
  }
  
  record.count++
  return false
}