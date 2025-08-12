'use client'

import { useState } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'

export default function OCRTestPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/debug/test-ocr', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'OCR test failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">OCR Test Tool</h1>
          <p className="text-gray-600 mb-8">
            Test the OpenAI document processing with Romanian ID card images
          </p>

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-8">
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className="text-center">
              <Upload className={`mx-auto h-12 w-12 ${isUploading ? 'text-gray-400' : 'text-gray-500'} mb-4`} />
              <p className="text-lg font-medium text-gray-900 mb-2">
                {isUploading ? 'Processing document...' : 'Upload Romanian ID card image'}
              </p>
              <p className="text-gray-500">
                JPG, PNG files only. Max 10MB.
              </p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
                <div>
                  <h3 className="text-red-800 font-medium">OCR Test Failed</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Result */}
          {result && result.success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-400 mt-0.5 mr-3" />
                <div className="flex-1">
                  <h3 className="text-green-800 font-medium text-lg mb-4">OCR Processing Successful!</h3>
                  
                  {/* File Info */}
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">File Information:</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <p className="font-medium">{result.fileInfo?.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <p className="font-medium">{result.fileInfo?.type}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Size:</span>
                        <p className="font-medium">{Math.round((result.fileInfo?.size || 0) / 1024)}KB</p>
                      </div>
                    </div>
                  </div>

                  {/* Extracted Data */}
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Extracted Data:</h4>
                    <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
                      {JSON.stringify(result.extractedData, null, 2)}
                    </pre>
                    
                    {/* Data Summary */}
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Address Data:</h5>
                        <ul className="space-y-1">
                          <li><span className="text-gray-600">Localitatea:</span> {result.extractedData?.localitatea || 'N/A'}</li>
                          <li><span className="text-gray-600">Județul:</span> {result.extractedData?.judetul || 'N/A'}</li>
                          <li><span className="text-gray-600">Strada:</span> {result.extractedData?.strada || 'N/A'}</li>
                          <li><span className="text-gray-600">Nr. Strada:</span> {result.extractedData?.nr_strada || 'N/A'}</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Document Data:</h5>
                        <ul className="space-y-1">
                          <li><span className="text-gray-600">Serie:</span> {result.extractedData?.serie || 'N/A'}</li>
                          <li><span className="text-gray-600">Nr:</span> {result.extractedData?.nr || 'N/A'}</li>
                          <li><span className="text-gray-600">CNP:</span> {result.extractedData?.cnp || 'N/A'}</li>
                          <li><span className="text-gray-600">SLCLEP:</span> {result.extractedData?.slclep || 'N/A'}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Failed Result */}
          {result && !result.success && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-yellow-400 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-yellow-800 font-medium">OCR Processing Failed</h3>
                  <p className="text-yellow-700 mt-1">{result.details}</p>
                  {result.fileInfo && (
                    <div className="mt-4 p-3 bg-white rounded text-sm">
                      <strong>File:</strong> {result.fileInfo.name} ({result.fileInfo.type}, {Math.round(result.fileInfo.size / 1024)}KB)
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">How to use:</h3>
            <ol className="list-decimal list-inside text-blue-800 text-sm space-y-1">
              <li>Upload a clear image of a Romanian identity card (Carte de Identitate)</li>
              <li>The system will process the image using OpenAI Vision API</li>
              <li>Review the extracted data to see what information was successfully read</li>
              <li>Check the browser console for detailed processing logs</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}