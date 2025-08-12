import { NextRequest, NextResponse } from 'next/server'
import { processDocumentWithOCR } from '@/lib/documentProcessor'
import fs from 'fs'

export async function GET() {
  try {
    console.log('=== TESTING OCR WITH UPLOADED IMAGE ===')
    
    // Read the uploaded image file - this was actually a PDF, let's inform about it
    const imagePath = '/mnt/c/Users/ROG/Desktop/Capture.PNG'
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return NextResponse.json({
        success: false,
        error: 'Image file not found at path: ' + imagePath
      })
    }
    
    console.log('Reading image file from:', imagePath)
    const imageBuffer = fs.readFileSync(imagePath)
    console.log('Image buffer size:', imageBuffer.length)
    
    // Test OCR processing
    const result = await processDocumentWithOCR(
      imageBuffer, 
      'test-user-debug', 
      'Capture.PNG', 
      'test/Capture.PNG'
    )

    return NextResponse.json({
      success: true,
      message: 'OCR debug test completed',
      extractedData: result,
      bufferSize: imageBuffer.length
    })

  } catch (error) {
    console.error('Debug OCR test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Debug test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}