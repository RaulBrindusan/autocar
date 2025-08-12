import { NextRequest, NextResponse } from 'next/server'
import { processDocumentWithOCR } from '@/lib/documentProcessor'

export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const testUserId = 'test-user-123'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPG/PNG images and PDF documents are allowed for testing' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    console.log('Testing OCR with file:', file.name, 'size:', buffer.length)

    // Test the document processing
    try {
      const result = await processDocumentWithOCR(
        buffer, 
        testUserId, 
        file.name, 
        `test/${file.name}`
      )

      return NextResponse.json({
        success: true,
        message: 'OCR test completed successfully',
        extractedData: result,
        fileInfo: {
          name: file.name,
          type: file.type,
          size: file.size
        },
        processingInfo: {
          azureConfigured: !!(process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT && process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY),
          isPDF: file.type === 'application/pdf'
        }
      })

    } catch (ocrError) {
      console.error('OCR Error:', ocrError)
      return NextResponse.json({
        success: false,
        error: 'OCR processing failed',
        details: ocrError instanceof Error ? ocrError.message : 'Unknown OCR error',
        fileInfo: {
          name: file.name,
          type: file.type,
          size: file.size
        }
      })
    }

  } catch (error) {
    console.error('Test OCR error:', error)
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}