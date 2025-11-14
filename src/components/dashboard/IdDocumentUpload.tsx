"use client"

import { useState } from 'react'
// import { createClient } from '@/lib/supabase/client'
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface IdDocumentUploadProps {
  userId: string
  onUploadComplete: () => void
}

export function IdDocumentUpload({ userId, onUploadComplete }: IdDocumentUploadProps) {
  const { t } = useLanguage()
  const [isUploading, setIsUploading] = useState(false)
  const [gdprAccepted, setGdprAccepted] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [processingSuccess, setProcessingSuccess] = useState(false)
  const [processingDetails, setProcessingDetails] = useState<any>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Vă rugăm să încărcați un fișier valid (JPG, PNG, PDF)')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Fișierul este prea mare. Dimensiunea maximă este 10MB')
      return
    }

    if (!gdprAccepted) {
      setUploadError('Trebuie să acceptați termenii de prelucrare a datelor personale')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', userId)

      const response = await fetch('/api/upload-id-document', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Eroare la încărcarea documentului')
      }

      const result = await response.json()
      
      if (result.success) {
        setUploadSuccess(true)
        
        // Show different messages based on processing result
        if (result.processingError) {
          setUploadError(`Document încărcat, dar procesarea a eșuat: ${result.error}`)
        } else if (result.extractedData) {
          // Show success with extracted data info
          setProcessingSuccess(true)
          setProcessingDetails(result.extractedData)
          console.log('Document uploaded with extracted data:', result.extractedData)
        }
        
        // Complete upload and hide component after showing success
        onUploadComplete()
        
        // Hide success messages after 3 seconds
        setTimeout(() => {
          setUploadSuccess(false)
          setProcessingSuccess(false)
          setProcessingDetails(null)
        }, 3000)
      } else {
        throw new Error(result.error || 'Eroare la încărcarea documentului')
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Eroare necunoscută')
    } finally {
      setIsUploading(false)
    }
  }


  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-dashed border-blue-200 mb-8">
      <div className="flex items-start space-x-4">
        <div className="bg-blue-100 p-3 rounded-xl">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Încărcarea actului de identitate
          </h3>
          <p className="text-gray-600 mb-4">
            Pentru a continua cu serviciile noastre, vă rugăm să încărcați o copie a actului de identitate (CI/Pașaport).
            Acest document va fi folosit exclusiv pentru verificarea identității în procesul de import auto.
          </p>

          {/* GDPR Checkbox */}
          <div className="mb-4">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={gdprAccepted}
                onChange={(e) => setGdprAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                Sunt de acord cu prelucrarea datelor mele personale în conformitate cu{' '}
                <a href="/privacy-policy" target="_blank" className="text-blue-600 hover:underline">
                  Politica de Confidențialitate
                </a>{' '}
                și{' '}
                <a href="/gdpr" target="_blank" className="text-blue-600 hover:underline">
                  Regulamentul GDPR
                </a>
                . Înțeleg că acest document va fi stocat securizat și folosit exclusiv pentru verificarea identității.
              </span>
            </label>
          </div>

          {/* Upload Section */}
          <div className="space-y-4">
            {!uploadSuccess ? (
              <div className="relative">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileUpload}
                  disabled={isUploading || !gdprAccepted}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className={`
                  flex items-center justify-center px-6 py-4 border-2 border-dashed rounded-xl transition-all duration-200
                  ${gdprAccepted 
                    ? 'border-blue-300 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer' 
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  }
                  ${isUploading ? 'animate-pulse' : ''}
                `}>
                  <Upload className={`h-5 w-5 mr-2 ${gdprAccepted ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className={`font-medium ${gdprAccepted ? 'text-blue-600' : 'text-gray-400'}`}>
                    {isUploading 
                      ? 'Se încarcă documentul...' 
                      : 'Faceți clic pentru a încărca documentul (JPG, PNG, PDF - max 10MB)'
                    }
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center px-6 py-4 bg-green-50 border-2 border-green-200 rounded-xl">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                <span className="font-medium text-green-700">
                  Documentul a fost încărcat cu succes!
                </span>
              </div>
            )}

            {uploadError && (
              <div className="flex items-start px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-red-700 text-sm">{uploadError}</span>
              </div>
            )}

            <div className="text-xs text-gray-500">
              <p className="mb-1">• Formateaccept: JPG, PNG, PDF</p>
              <p className="mb-1">• Dimensiune maximă: 10MB</p>
              <p>• Documentul va fi stocat securizat și șters după procesarea cererii</p>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Success Toast */}
      {processingSuccess && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
          <div className="bg-white rounded-lg shadow-2xl border-l-4 border-l-green-500 overflow-hidden">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        Document Procesat cu Succes!
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Datele din act au fost extrase și salvate automat.
                      </p>
                      {processingDetails && (
                        <div className="mt-2 text-xs text-gray-500">
                          <p>
                            {processingDetails.localitatea && `📍 ${processingDetails.localitatea}`}
                            {processingDetails.cnp && ` • 🆔 CNP: ${processingDetails.cnp.substring(0, 4)}***`}
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setProcessingSuccess(false)
                        setProcessingDetails(null)
                      }}
                      className="ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-1 bg-gray-100">
              <div className="h-full bg-green-500 transition-all duration-5000 ease-linear animate-shrink" />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-shrink {
          animation: shrink 5s linear forwards;
        }
      `}</style>
    </div>
  )
}