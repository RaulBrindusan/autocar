import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'
import { processDocumentWithOCR } from '@/lib/documentProcessor'

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

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tip de fișier neacceptat. Vă rugăm să încărcați JPG, PNG sau PDF' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Fișierul este prea mare. Dimensiunea maximă este 10MB' },
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

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const filename = `id-documents/${userId}/${uuidv4()}.${fileExtension}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudflare R2
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        'user-id': userId,
        'original-filename': file.name,
        'uploaded-at': new Date().toISOString(),
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