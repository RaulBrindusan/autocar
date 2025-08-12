import { createClient } from '@/lib/supabase/server'
import { createWorker } from 'tesseract.js'
import DocumentIntelligence, { getLongRunningPoller } from '@azure-rest/ai-document-intelligence'
import { AzureKeyCredential } from '@azure/core-auth'

// Azure Document Intelligence configuration
const azureDocClient = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT && process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY
  ? DocumentIntelligence(
      process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT,
      new AzureKeyCredential(process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY)
    )
  : null

interface ExtractedDocumentData {
  localitatea?: string
  judetul?: string
  strada?: string
  nr_strada?: string
  bl?: string
  sc?: string
  etaj?: string
  apartment?: string
  serie?: string
  nr?: string
  cnp?: string
  slclep?: string
  valabilitate?: string
}


export async function processDocumentWithOCR(
  fileBuffer: Buffer,
  userId: string,
  fileName: string,
  filePath: string
): Promise<ExtractedDocumentData> {
  try {
    console.log('Starting document processing for user:', userId, 'file:', fileName)
    console.log('File size:', fileBuffer.length, 'bytes')
    
    let extractedData: ExtractedDocumentData = {}
    const imageBuffer: Buffer = fileBuffer
    
    // Handle PDF files - try Azure first since it supports PDFs natively
    if (fileName.toLowerCase().endsWith('.pdf')) {
      console.log('PDF file detected. Attempting Azure OCR processing...')
      
      if (azureDocClient) {
        try {
          extractedData = await processWithAzureDocumentIntelligence(fileBuffer, fileName)
          console.log('Azure PDF processing successful:', extractedData)
          await saveDocumentData(userId, fileName, filePath, extractedData)
          return extractedData
        } catch (azureError) {
          console.error('Azure PDF processing failed:', azureError)
        }
      }
      
      // If Azure is not available or failed, save empty record for now
      console.log('Azure not available for PDF processing. Saving PDF document record without OCR data...')
      extractedData = {}
      await saveDocumentData(userId, fileName, filePath, extractedData)
      return extractedData
    }
    
    // Try Azure Document Intelligence first for best accuracy
    if (azureDocClient) {
      try {
        console.log('Attempting OCR with Azure Document Intelligence...')
        extractedData = await processWithAzureDocumentIntelligence(imageBuffer, fileName)
        console.log('Azure Document Intelligence processing successful:', extractedData)
        
        // Check if we got meaningful data from Azure
        const hasValidData = Object.values(extractedData).some(value => 
          value !== null && value !== undefined && value !== ''
        )
        
        if (!hasValidData) {
          console.log('No meaningful data extracted from Azure, trying fallbacks...')
          throw new Error('No meaningful data extracted from Azure')
        }
        
      } catch (azureError) {
        console.error('Azure Document Intelligence processing failed:', azureError)
        
        // Fallback to Tesseract.js
        try {
          console.log('Falling back to Tesseract.js...')
          extractedData = await processWithTesseract(imageBuffer, fileName)
          console.log('Tesseract.js processing successful:', extractedData)
          
          // Check if we got meaningful data from Tesseract
          const hasValidData = Object.values(extractedData).some(value => 
            value !== null && value !== undefined && value !== ''
          )
          
          if (!hasValidData) {
            console.log('No meaningful data extracted from Tesseract, trying OpenAI fallback...')
            throw new Error('No meaningful data extracted from Tesseract')
          }
          
        } catch (tesseractError) {
          console.error('Both Azure and Tesseract processing failed:', tesseractError)
          extractedData = {}
        }
      }
    } else {
      // Original fallback chain if Azure is not configured
      try {
        console.log('Azure not configured, attempting OCR with Tesseract.js...')
        extractedData = await processWithTesseract(imageBuffer, fileName)
        console.log('Tesseract.js processing successful:', extractedData)
        
        // Check if we got meaningful data from Tesseract
        const hasValidData = Object.values(extractedData).some(value => 
          value !== null && value !== undefined && value !== ''
        )
        
        if (!hasValidData) {
          console.log('No meaningful data extracted from Tesseract, trying OpenAI fallback...')
          throw new Error('No meaningful data extracted from Tesseract')
        }
        
      } catch (tesseractError) {
        console.error('Tesseract processing failed and Azure is not configured:', tesseractError)
        extractedData = {}
      }
    }

    // Save extracted data to database
    console.log('Saving document data to database...')
    await saveDocumentData(userId, fileName, filePath, extractedData)
    console.log('Document data saved successfully')

    return extractedData
  } catch (error) {
    console.error('Error processing document:', error)
    
    // Save document record even if processing failed
    await saveDocumentData(userId, fileName, filePath, {})
    
    throw error
  }
}

async function processWithAzureDocumentIntelligence(imageBuffer: Buffer, fileName: string): Promise<ExtractedDocumentData> {
  console.log('Starting Azure Document Intelligence processing...')
  
  if (!azureDocClient) {
    throw new Error('Azure Document Intelligence client is not configured')
  }

  try {
    console.log('Uploading document to Azure Document Intelligence...')
    
    // Use the prebuilt-read model for general document text extraction
    const initialResponse = await azureDocClient.path('/documentModels/{modelId}:analyze', 'prebuilt-read').post({
      contentType: 'application/octet-stream',
      body: imageBuffer,
    })

    if (initialResponse.status !== '202') {
      throw new Error(`Azure Document Intelligence API returned status: ${initialResponse.status}`)
    }

    console.log('Document uploaded successfully, waiting for analysis to complete...')
    
    // Get the operation location from the response headers
    const operationLocation = initialResponse.headers['operation-location']
    if (!operationLocation) {
      throw new Error('No operation location returned from Azure')
    }

    // Poll for completion
    const poller = getLongRunningPoller(azureDocClient, initialResponse)
    const result = await poller.pollUntilDone()

    console.log('Azure analysis completed, processing results...')
    
    if (result.status !== '200' || !result.body) {
      throw new Error(`Analysis failed with status: ${result.status}`)
    }

    const analyzeResult = result.body.analyzeResult
    
    if (!analyzeResult?.content) {
      console.log('No content extracted from Azure Document Intelligence')
      return {}
    }

    console.log('Azure extracted text length:', analyzeResult.content.length)
    console.log('Azure extracted full text:')
    console.log('---START AZURE TEXT---')
    console.log(analyzeResult.content)
    console.log('---END AZURE TEXT---')

    // Extract structured data from the OCR text using our existing Romanian ID extraction logic
    const extractedData = extractRomanianIDData(analyzeResult.content)
    console.log('Final extracted data from Azure:', extractedData)
    
    return extractedData

  } catch (error) {
    console.error('Error in processWithAzureDocumentIntelligence:', error)
    throw error
  }
}

async function processWithTesseract(imageBuffer: Buffer, fileName: string): Promise<ExtractedDocumentData> {
  console.log('Creating Tesseract worker...')
  
  let worker;
  try {
    // Use English since Romanian (ron) might not be available, and Romanian ID cards often have mixed text
    worker = await createWorker('eng')
    
    console.log('Tesseract worker created successfully')
    
    console.log('Starting OCR recognition with basic settings...')
    // Use basic settings first to see if we can get any text
    const { data: { text } } = await worker.recognize(imageBuffer)
    console.log('Tesseract extracted text length:', text?.length || 0)
    console.log('Tesseract extracted full text:')
    console.log('---START TEXT---')
    console.log(text || 'NO TEXT EXTRACTED')
    console.log('---END TEXT---')
    
    if (!text || text.trim().length === 0) {
      throw new Error('Tesseract extracted no text from the image')
    }
    
    // Extract structured data from the OCR text
    const extractedData = extractRomanianIDData(text)
    console.log('Final extracted data from Tesseract:', extractedData)
    
    return extractedData
  } catch (error) {
    console.error('Error in processWithTesseract:', error)
    throw error
  } finally {
    if (worker) {
      console.log('Terminating Tesseract worker...')
      try {
        await worker.terminate()
      } catch (terminateError) {
        console.error('Error terminating Tesseract worker:', terminateError)
      }
    }
  }
}


function extractRomanianIDData(text: string): ExtractedDocumentData {
  console.log('Extracting Romanian ID data from text:', text.substring(0, 500))
  const data: ExtractedDocumentData = {}
  
  // Split text into lines for better structure analysis
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  
  // Find address block more precisely
  let addressStartIndex = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes('adresa') || lines[i].toLowerCase().includes('domiciliu')) {
      addressStartIndex = i
      break
    }
  }
  
  if (addressStartIndex >= 0 && addressStartIndex + 2 < lines.length) {
    console.log('Found address section starting at line:', addressStartIndex)
    
    // JUDETUL: First row below Address category - starts with "Jud." and following 2 letters
    const judLine = lines[addressStartIndex + 1]
    console.log('Jud line:', judLine)
    const judMatch = judLine.match(/jud\.?\s*([a-zA-ZĂÂÎȘȚăâîșț]{2})/i)
    if (judMatch) {
      data.judetul = judMatch[1].toUpperCase()
      console.log('Extracted judetul:', data.judetul)
    }
    
    // STRADA: Second row below Address category
    const stradaLine = lines[addressStartIndex + 2]
    console.log('Strada line:', stradaLine)
    // Clean up the strada line - remove common prefixes and extract the actual street name
    const stradaClean = stradaLine.replace(/^(str\.?|strada)\s*/i, '').trim()
    if (stradaClean && stradaClean.length > 0) {
      data.strada = stradaClean
      console.log('Extracted strada:', data.strada)
    }
    
    // LOCALITATEA: Look for after Mun., Com., Sat., Sat, or Loc. in the jud line or nearby lines
    const localitatePattern = /(?:mun\.?|com\.?|sat\.?|loc\.?)\s*([a-zA-ZĂÂÎȘȚăâîșț\s\-]+)/i
    for (let i = Math.max(0, addressStartIndex); i < Math.min(lines.length, addressStartIndex + 4); i++) {
      const localitateMatch = lines[i].match(localitatePattern)
      if (localitateMatch) {
        data.localitatea = localitateMatch[1].trim()
        console.log('Extracted localitatea:', data.localitatea)
        break
      }
    }
  }
  
  // NR_STRADA: Leave empty if not found clearly - only extract if very clear
  // This is intentionally more restrictive as per requirement
  const nrStradaMatch = text.match(/nr\.?\s*(\d+[a-zA-Z]?)\s/i)
  if (nrStradaMatch && nrStradaMatch[1]) {
    const nrValue = nrStradaMatch[1].trim()
    // Only set if it's clearly a street number (numeric with optional letter)
    if (/^\d+[a-zA-Z]?$/.test(nrValue)) {
      data.nr_strada = nrValue
    }
  }
  
  // Other address components (more flexible)
  const patterns = {
    bl: /(?:bl\.?\s*|bloc\s*)[:\s]*([A-Z0-9\-]+)/i,
    sc: /(?:sc\.?\s*|scara\s*)[:\s]*([A-Z0-9]+)/i,
    etaj: /(?:et\.?\s*|etaj\s*)[:\s]*([0-9\-]+)/i,
    apartment: /(?:ap\.?\s*|apart\.?\s*|apartament\s*)[:\s]*([0-9A-Z\-]+)/i,
  }
  
  for (const [field, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern)
    if (match && match[1]) {
      data[field as keyof ExtractedDocumentData] = match[1].trim()
    }
  }

  // CNP: Find 13-digit sequences
  const cnpMatch = text.match(/\b([0-9]{13})\b/)
  if (cnpMatch) {
    data.cnp = cnpMatch[1]
  }

  // Document series and number: Find Romanian ID series pattern (2-3 letters followed by numbers)
  const serieMatch = text.match(/\b([A-Z]{1,3})\s*([0-9]{6,9})\b/)
  if (serieMatch) {
    data.serie = serieMatch[1]
    data.nr = serieMatch[2]
  }
  
  // SPCLEP: Display only "SPCLEP XXX" format - extract only the SPCLEP identifier
  const spclepMatch = text.match(/SPCLEP\s+([A-Z0-9]+)/i)
  if (spclepMatch) {
    data.slclep = `SPCLEP ${spclepMatch[1]}`
    console.log('Extracted SPCLEP:', data.slclep)
  }
  
  // VALABILITATE: Extract only the first date from dates on bottom right corner
  // Look for date patterns and take the first one that appears to be an expiration date
  const datePatterns = [
    /(\d{1,2}[\.\/\-]\d{1,2}[\.\/\-]\d{4})/g,
    /(\d{4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2})/g
  ]
  
  for (const pattern of datePatterns) {
    const matches = Array.from(text.matchAll(pattern))
    if (matches.length > 0) {
      // Take the first date found - typically the issue date, which we'll use as validity start
      let firstDate = matches[0][1]
      console.log('Found first date:', firstDate)
      
      // Convert to YYYY-MM-DD format
      let dateMatch = firstDate.match(/(\d{1,2})[\.\/\-](\d{1,2})[\.\/\-](\d{4})/)
      if (dateMatch) {
        const [, day, month, year] = dateMatch
        data.valabilitate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      } else {
        dateMatch = firstDate.match(/(\d{4})[\.\/\-](\d{1,2})[\.\/\-](\d{1,2})/)
        if (dateMatch) {
          const [, year, month, day] = dateMatch
          data.valabilitate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        }
      }
      break
    }
  }

  console.log('Final extracted Romanian ID data:', data)
  return data
}

async function saveDocumentData(
  userId: string,
  fileName: string,
  filePath: string,
  extractedData: ExtractedDocumentData
): Promise<void> {
  try {
    console.log('Preparing to save document data to database:')
    console.log('- User ID:', userId)
    console.log('- File name:', fileName)
    console.log('- File path:', filePath)
    console.log('- Extracted data:', JSON.stringify(extractedData, null, 2))
    
    const supabase = await createClient()
    
    const documentRecord = {
      user_id: userId,
      file_name: fileName,
      file_path: filePath,
      localitatea: extractedData.localitatea || null,
      judetul: extractedData.judetul || null,
      strada: extractedData.strada || null,
      nr_strada: extractedData.nr_strada || null,
      bl: extractedData.bl || null,
      sc: extractedData.sc || null,
      etaj: extractedData.etaj || null,
      apartment: extractedData.apartment || null,
      serie: extractedData.serie || null,
      nr: extractedData.nr || null,
      cnp: extractedData.cnp || null,
      slclep: extractedData.slclep || null,
      valabilitate: extractedData.valabilitate || null,
    }
    
    console.log('Document record to insert:', JSON.stringify(documentRecord, null, 2))
    
    const { data, error } = await supabase
      .from('documents')
      .insert(documentRecord)
      .select()

    if (error) {
      console.error('Database error saving document data:', error)
      throw error
    }
    
    console.log('Document data saved successfully:', data)
  } catch (error) {
    console.error('Error in saveDocumentData:', error)
    throw error
  }
}

function extractDataManually(text: string): ExtractedDocumentData {
  // Fallback manual extraction if JSON parsing fails - use same improved logic as main function
  console.log('Attempting manual extraction from text:', text.substring(0, 500))
  
  // Use the same improved extraction logic as the main function
  return extractRomanianIDData(text)
}

function getMimeType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'pdf':
      return 'application/pdf'
    default:
      return 'image/jpeg' // Default fallback
  }
}