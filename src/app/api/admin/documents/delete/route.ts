import { NextRequest, NextResponse } from 'next/server'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
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

export async function DELETE(request: NextRequest) {
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

    // Get request body
    const body = await request.json()
    const { fileName, userId } = body

    if (!fileName || !userId) {
      return NextResponse.json(
        { error: 'Nume fișier și ID utilizator sunt obligatorii' },
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

    // Validate that the userId matches the file path
    const pathParts = fileName.split('/')
    if (pathParts.length < 2 || pathParts[1] !== userId) {
      return NextResponse.json(
        { error: 'ID utilizator nu corespunde cu documentul' },
        { status: 400 }
      )
    }

    // Delete object from R2
    const deleteCommand = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    })

    await r2Client.send(deleteCommand)

    // Update user record in database to mark document as not uploaded
    const { error: updateError } = await supabase
      .from('users')
      .update({
        id_document_uploaded: false,
        id_document_uploaded_at: null,
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating user record:', updateError)
      // Don't fail the entire operation if database update fails
      // The file has been deleted from R2 successfully
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Document șters cu succes' 
    })

  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: 'Eroare la ștergerea documentului' },
      { status: 500 }
    )
  }
}