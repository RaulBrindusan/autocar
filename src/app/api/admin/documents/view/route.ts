import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
// import { createClient } from '@/lib/supabase/server'

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

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acces interzis - doar pentru administratori' },
        { status: 403 }
      )
    }

    // Get fileName from query parameters
    const searchParams = request.nextUrl.searchParams
    const fileName = searchParams.get('fileName')

    if (!fileName) {
      return NextResponse.json(
        { error: 'Nume fișier lipsă' },
        { status: 400 }
      )
    }

    // Validate that the file is in the id-documents folder
    if (!fileName.startsWith('id-documents/')) {
      return NextResponse.json(
        { error: 'Acces interzis la acest fișier' },
        { status: 403 }
      )
    }

    // Get object from R2
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    })

    const response = await r2Client.send(command)
    
    if (!response.Body) {
      return NextResponse.json(
        { error: 'Fișierul nu a fost găsit' },
        { status: 404 }
      )
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = []
    const reader = response.Body.transformToWebStream().getReader()
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }
    
    const buffer = Buffer.concat(chunks)

    // Determine content type
    const contentType = getContentTypeFromFileName(fileName)
    
    // Set appropriate headers
    const headers = new Headers()
    headers.set('Content-Type', contentType)
    headers.set('Content-Length', buffer.length.toString())
    
    // For PDFs, show inline; for images, show inline; for others, force download
    if (contentType.startsWith('image/') || contentType === 'application/pdf') {
      headers.set('Content-Disposition', `inline; filename="${fileName.split('/').pop()}"`)
    } else {
      headers.set('Content-Disposition', `attachment; filename="${fileName.split('/').pop()}"`)
    }

    return new NextResponse(buffer, {
      status: 200,
      headers,
    })

  } catch (error) {
    console.error('Error viewing document:', error)
    return NextResponse.json(
      { error: 'Eroare la încărcarea documentului' },
      { status: 500 }
    )
  }
}

function getContentTypeFromFileName(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'pdf':
      return 'application/pdf'
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    default:
      return 'application/octet-stream'
  }
}