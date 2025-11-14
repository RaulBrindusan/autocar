"use client"

import { useState, useEffect } from 'react'
// import { createClient } from '@/lib/supabase/client'
import { Eye, Download, FileText, User, Calendar, AlertCircle, Trash2 } from 'lucide-react'

interface DocumentData {
  fileName: string
  uploadedAt: string
  userId: string
  userEmail: string
  userName: string
  fileSize?: number
  contentType?: string
}

export function AdminDocumentsList() {
  const [documents, setDocuments] = useState<DocumentData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewingDocument, setViewingDocument] = useState<string | null>(null)
  const [deletingDocument, setDeletingDocument] = useState<DocumentData | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError(null)

      // const supabase = createClient() // Firebase migration
      
      // Check if user is admin
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Neautorizat')
        return
      }

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        setError('Acces interzis - doar pentru administratori')
        return
      }

      // Fetch documents from API
      const response = await fetch('/api/admin/documents')
      if (!response.ok) {
        throw new Error('Eroare la încărcarea documentelor')
      }

      const data = await response.json()
      setDocuments(data.documents)
    } catch (err) {
      console.error('Error fetching documents:', err)
      setError(err instanceof Error ? err.message : 'Eroare necunoscută')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDocument = (fileName: string) => {
    setViewingDocument(fileName)
  }

  const handleDownloadDocument = async (fileName: string) => {
    try {
      const response = await fetch(`/api/admin/documents/view?fileName=${encodeURIComponent(fileName)}`)
      if (!response.ok) {
        throw new Error('Eroare la descărcarea documentului')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName.split('/').pop() || 'document'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error downloading document:', err)
      alert('Eroare la descărcarea documentului')
    }
  }

  const handleDeleteDocument = (document: DocumentData) => {
    setDeletingDocument(document)
  }

  const confirmDeleteDocument = async () => {
    if (!deletingDocument) return

    try {
      setDeleteLoading(true)
      
      const response = await fetch('/api/admin/documents/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: deletingDocument.fileName,
          userId: deletingDocument.userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Eroare la ștergerea documentului')
      }

      // Refresh the documents list
      await fetchDocuments()
      
      setDeletingDocument(null)
      alert('Document șters cu succes')
    } catch (err) {
      console.error('Error deleting document:', err)
      alert('Eroare la ștergerea documentului')
    } finally {
      setDeleteLoading(false)
    }
  }

  const cancelDeleteDocument = () => {
    setDeletingDocument(null)
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }


  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-semibold mb-2">Eroare</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Documente Utilizatori</h1>
            <p className="text-gray-600 mt-2">
              Gestionează documentele de identitate încărcate de utilizatori
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total documente</p>
                  <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Utilizatori cu documente</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(documents.map(doc => doc.userId)).size}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Încărcări astăzi</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {documents.filter(doc => {
                      const uploadDate = new Date(doc.uploadedAt)
                      const today = new Date()
                      return uploadDate.toDateString() === today.toDateString()
                    }).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Lista Documente</h2>
            </div>
            
            {documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Nu există documente încărcate</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilizator
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dimensiune
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data încărcare
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acțiuni
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm">
                                {doc.userName?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {doc.userName || 'Nume necunoscut'}
                              </div>
                              <div className="text-sm text-gray-500">{doc.userEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm text-gray-900 font-mono">
                                {doc.fileName.split('/').pop()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {doc.contentType || 'unknown'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatFileSize(doc.fileSize)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(doc.uploadedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDocument(doc.fileName)}
                              className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                            >
                              <Eye className="h-4 w-4" />
                              <span>Vezi</span>
                            </button>
                            <button
                              onClick={() => handleDownloadDocument(doc.fileName)}
                              className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                            >
                              <Download className="h-4 w-4" />
                              <span>Descarcă</span>
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(doc)}
                              className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Șterge</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 h-5/6 max-w-4xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                Document: {viewingDocument.split('/').pop()}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownloadDocument(viewingDocument)}
                  className="text-green-600 hover:text-green-800 flex items-center space-x-1"
                >
                  <Download className="h-4 w-4" />
                  <span>Descarcă</span>
                </button>
                <button
                  onClick={() => setViewingDocument(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold px-3 py-1"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-4 h-full">
              <iframe
                src={`/api/admin/documents/view?fileName=${encodeURIComponent(viewingDocument)}`}
                className="w-full h-full border rounded"
                title="Document Viewer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmare ștergere document
                </h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  Ești sigur că vrei să ștergi acest document?
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">
                    Utilizator: {deletingDocument.userName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: {deletingDocument.userEmail}
                  </p>
                  <p className="text-sm text-gray-600">
                    Document: {deletingDocument.fileName.split('/').pop()}
                  </p>
                </div>
                <p className="text-sm text-red-600 mt-2">
                  <strong>Atenție:</strong> Această acțiune nu poate fi anulată. Documentul va fi șters permanent din storage și utilizatorul va trebui să îl încarce din nou.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDeleteDocument}
                  disabled={deleteLoading}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors disabled:opacity-50"
                >
                  Anulează
                </button>
                <button
                  onClick={confirmDeleteDocument}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {deleteLoading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <span>{deleteLoading ? 'Se șterge...' : 'Șterge document'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}