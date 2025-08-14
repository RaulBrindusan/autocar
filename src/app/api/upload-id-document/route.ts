import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'
import { processDocumentWithOCR } from '@/lib/documentProcessor'
import { 
  fileUploadSchema, 
  isValidFileExtension, 
  hasValidFileSignature,
  sanitizeFilename,
  generateSecureFilename,
  isUploadRateLimited,
  type FileUploadInput 
} from '@/lib/validation/file-upload'
import { z } from 'zod'

// Configure Cloudflare R2 client
const r2Client = new S3Client({
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
  region: 'auto',
})

const BUCKET_NAME = 'documentsautomode'

export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'Fișier și ID utilizator sunt obligatorii' },
        { status: 400 }
      )
    }

    // Validate input with Zod schema
    let validatedData: FileUploadInput
    try {
      validatedData = fileUploadSchema.parse({
        userId,
        file: {
          name: file.name,
          size: file.size,
          type: file.type
        }
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: 'Date de intrare invalide',
            details: error.issues.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          },
          { status: 400 }
        )
      }
      throw error
    }

    // Rate limiting check
    if (isUploadRateLimited(userId)) {
      return NextResponse.json(
        { error: 'Prea multe încărcări. Încercați din nou mai târziu.' },
        { status: 429 }
      )
    }

    // Validate file extension matches MIME type
    if (!isValidFileExtension(file.name, file.type)) {
      return NextResponse.json(
        { error: 'Extensia fișierului nu corespunde tipului de fișier' },
        { status: 400 }
      )
    }

    // Read file buffer for signature validation
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate file signature (magic bytes)
    if (!hasValidFileSignature(buffer, file.type)) {
      return NextResponse.json(
        { error: 'Fișier corupt sau tip de fișier nevalid' },
        { status: 400 }
      )
    }

    // Verify user authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || user.id !== userId) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      )
    }

    // Check if user already uploaded an ID document
    const { data: existingUser } = await supabase
      .from('users')
      .select('id_document_uploaded')
      .eq('id', userId)
      .single()

    if (existingUser?.id_document_uploaded) {
      return NextResponse.json(
        { error: 'Ați încărcat deja un document de identitate' },
        { status: 400 }
      )
    }

    // Generate secure filename
    const filename = generateSecureFilename(userId, sanitizeFilename(file.name))

    // Upload to Cloudflare R2
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        'user-id': userId,
        'original-filename': sanitizeFilename(file.name),
        'uploaded-at': new Date().toISOString(),
        'file-size': file.size.toString(),
        'content-type': file.type,
      },
    })

    await r2Client.send(command)

    // Update user record in database
    const { error: updateError } = await supabase
      .from('users')
      .update({
        id_document_uploaded: true,
        id_document_uploaded_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating user record:', updateError)
      return NextResponse.json(
        { error: 'Eroare la actualizarea înregistrării utilizatorului' },
        { status: 500 }
      )
    }

    // Process document with OCR and save to database
    let processingResult = null
    try {
      // Process both image files and PDFs
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        console.log('Starting document processing with OCR for:', file.name, 'type:', file.type)
        processingResult = await processDocumentWithOCR(buffer, userId, file.name, filename)
        console.log('Document processed and saved successfully:', processingResult)
      } else {
        console.log('Skipping OCR processing for unsupported file type:', file.type)
        // For unsupported file types, still create a basic document record
        const supabase = await createClient()
        await supabase
          .from('documents')
          .insert({
            user_id: userId,
            file_name: file.name,
            file_path: filename,
            localitatea: null,
            judetul: null,
            strada: null,
            nr_strada: null,
            bl: null,
            sc: null,
            etaj: null,
            apartment: null,
            serie: null,
            nr: null,
            cnp: null,
            slclep: null,
            valabilitate: null,
          })
      }
    } catch (error) {
      // Don't fail the upload if document processing fails
      console.error('Error processing document with OCR:', error)
      // Return success for upload but indicate processing failed
      return NextResponse.json({ 
        success: true, 
        message: 'Document încărcat cu succes, dar procesarea nu a reușit complet',
        processingError: true,
        error: error instanceof Error ? error.message : 'Unknown processing error'
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Document încărcat și procesat cu succes',
      extractedData: processingResult
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Eroare la încărcarea documentului' },
      { status: 500 }
    )
  }
}