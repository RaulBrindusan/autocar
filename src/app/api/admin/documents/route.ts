import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
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

    // List objects in R2 bucket
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'id-documents/',
    })

    const response = await r2Client.send(command)
    
    if (!response.Contents) {
      return NextResponse.json({ documents: [] })
    }

    // Get user data for all users who have uploaded documents
    const userIds = new Set<string>()
    response.Contents.forEach(obj => {
      if (obj.Key) {
        // Extract user ID from path: id-documents/{userId}/{filename}
        const pathParts = obj.Key.split('/')
        if (pathParts.length >= 2) {
          userIds.add(pathParts[1])
        }
      }
    })

    // Fetch user details from database
    const { data: users } = await supabase
      .from('users')
      .select('id, email, full_name, id_document_uploaded_at')
      .in('id', Array.from(userIds))

    const userMap = new Map(users?.map(user => [user.id, user]) || [])

    // Map documents with user information
    const documents = response.Contents
      .filter(obj => obj.Key && obj.Key !== 'id-documents/') // Filter out folder markers
      .map(obj => {
        const pathParts = obj.Key!.split('/')
        const userId = pathParts[1]
        const fileName = obj.Key!
        const user = userMap.get(userId)

        return {
          fileName,
          uploadedAt: user?.id_document_uploaded_at || obj.LastModified?.toISOString() || new Date().toISOString(),
          userId,
          userEmail: user?.email || 'Email necunoscut',
          userName: user?.full_name || 'Nume necunoscut',
          fileSize: obj.Size,
          contentType: getContentTypeFromFileName(fileName),
        }
      })
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()) // Sort by upload date, newest first

    return NextResponse.json({ documents })

  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Eroare la încărcarea documentelor' },
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