import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { createClient } from '@/lib/supabase/server'

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
    // Verify user authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      )
    }

    // Check if user has any documents in R2 storage
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `id-documents/${user.id}/`,
    })

    const response = await r2Client.send(command)
    
    // Check if there are any files for this user
    const hasDocument = response.Contents && response.Contents.length > 0
    
    // Also update the database to sync with actual R2 state
    if (hasDocument) {
      // Get current user data first
      const { data: userData } = await supabase
        .from('users')
        .select('id_document_uploaded_at')
        .eq('id', user.id)
        .single()
      
      // User has document in R2, make sure database reflects this
      await supabase
        .from('users')
        .update({
          id_document_uploaded: true,
          // Only update timestamp if it's null (preserve original upload time)
          id_document_uploaded_at: userData?.id_document_uploaded_at || new Date().toISOString()
        })
        .eq('id', user.id)
    } else {
      // User has no document in R2, make sure database reflects this
      await supabase
        .from('users')
        .update({
          id_document_uploaded: false,
          id_document_uploaded_at: null
        })
        .eq('id', user.id)
    }

    return NextResponse.json({ 
      hasDocument: !!hasDocument,
      documentCount: response.Contents?.length || 0
    })

  } catch (error) {
    console.error('Error checking document status:', error)
    return NextResponse.json(
      { error: 'Eroare la verificarea statusului documentului' },
      { status: 500 }
    )
  }
}