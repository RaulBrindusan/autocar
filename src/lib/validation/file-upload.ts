import { z } from 'zod'

// File upload validation constants
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'application/pdf'
] as const

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'pdf'] as const

// File validation schema
export const fileUploadSchema = z.object({
  userId: z.string()
    .uuid('Invalid user ID format')
    .min(1, 'User ID is required'),
  
  file: z.object({
    name: z.string()
      .min(1, 'File name is required')
      .max(255, 'File name too long')
      .regex(/^[a-zA-Z0-9._\-\s]+$/, 'File name contains invalid characters'),
    
    size: z.number()
      .min(1, 'File is empty')
      .max(MAX_FILE_SIZE, `File size cannot exceed ${MAX_FILE_SIZE / 1024 / 1024}MB`),
    
    type: z.enum(ALLOWED_FILE_TYPES as any, {
      message: 'Invalid file type. Only JPG, PNG, and PDF files are allowed.'
    })
  })
}).strict()

export type FileUploadInput = z.infer<typeof fileUploadSchema>

// Security checks for file content
export function isValidFileExtension(filename: string, mimeType: string): boolean {
  const extension = filename.split('.').pop()?.toLowerCase()
  
  if (!extension || !ALLOWED_EXTENSIONS.includes(extension as any)) {
    return false
  }

  // Check if extension matches MIME type
  const mimeExtensionMap: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/jpg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'application/pdf': ['pdf']
  }

  const validExtensions = mimeExtensionMap[mimeType]
  return validExtensions?.includes(extension) || false
}

// Check for suspicious file signatures (magic bytes)
export function hasValidFileSignature(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 4) return false
  
  const signature = buffer.subarray(0, 4)
  
  switch (mimeType) {
    case 'image/jpeg':
    case 'image/jpg':
      // JPEG starts with FF D8 FF
      return signature[0] === 0xFF && signature[1] === 0xD8 && signature[2] === 0xFF
    
    case 'image/png':
      // PNG starts with 89 50 4E 47
      return signature[0] === 0x89 && signature[1] === 0x50 && 
             signature[2] === 0x4E && signature[3] === 0x47
    
    case 'application/pdf':
      // PDF starts with %PDF
      const pdfSignature = buffer.subarray(0, 4).toString('ascii')
      return pdfSignature === '%PDF'
    
    default:
      return false
  }
}

// Sanitize filename for storage
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._\-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255)
}

// Generate secure filename
export function generateSecureFilename(userId: string, originalFilename: string): string {
  const extension = originalFilename.split('.').pop()?.toLowerCase() || 'bin'
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  
  return `id-documents/${userId}/${timestamp}_${randomSuffix}.${extension}`
}

// Rate limiting for file uploads (per user)
const uploadCounts = new Map<string, { count: number; resetTime: number }>()
const UPLOAD_LIMIT = 3 // uploads per window
const UPLOAD_WINDOW = 60 * 60 * 1000 // 1 hour

export function isUploadRateLimited(userId: string): boolean {
  const now = Date.now()
  const record = uploadCounts.get(userId)
  
  if (!record || now > record.resetTime) {
    uploadCounts.set(userId, { count: 1, resetTime: now + UPLOAD_WINDOW })
    return false
  }
  
  if (record.count >= UPLOAD_LIMIT) {
    return true
  }
  
  record.count++
  return false
}