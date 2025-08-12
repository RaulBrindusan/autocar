"use client"

import { useState, useEffect, useCallback } from "react"
import { X, User, Car, Euro, Calendar, Save, Trash2, Link, Send } from "lucide-react"
import { Button } from "@/components/ui/Button"
import toast from "react-hot-toast"

interface MemberRequest {
  id: string
  brand: string
  model: string
  year?: number
  fuel_type?: string
  transmission?: string
  max_mileage_km?: number
  max_budget: number
  required_features?: string[]
  additional_notes?: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  status: string
  created_at: string
  admin_notes?: string
}

interface MemberRequestModalProps {
  isOpen: boolean
  onClose: () => void
  requestId: string | null
  onRequestUpdated: () => void
}

export function MemberRequestModal({
  isOpen,
  onClose,
  requestId,
  onRequestUpdated
}: MemberRequestModalProps) {
  const [request, setRequest] = useState<MemberRequest | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [status, setStatus] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [offerLink, setOfferLink] = useState("")
  const [sendingOffer, setSendingOffer] = useState(false)

  const fetchRequest = useCallback(async () => {
    if (!requestId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/member-requests/${requestId}`)
      const data = await response.json()
      
      if (data.success) {
        setRequest(data.data)
        setStatus(data.data.status)
        setAdminNotes(data.data.admin_notes || "")
      } else {
        toast.error("Nu am putut încărca cererea")
      }
    } catch (error) {
      console.error("Error fetching request:", error)
      toast.error("Eroare la încărcarea cererii")
    } finally {
      setLoading(false)
    }
  }, [requestId])

  useEffect(() => {
    if (isOpen && requestId) {
      fetchRequest()
    }
  }, [isOpen, requestId, fetchRequest])

  const handleSave = async () => {
    if (!requestId) return
    
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/member-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          admin_notes: adminNotes
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success("Cererea a fost actualizată cu succes")
        onRequestUpdated()
        onClose()
      } else {
        toast.error(data.error || "Nu am putut actualiza cererea")
      }
    } catch (error) {
      console.error("Error updating request:", error)
      toast.error("Eroare la actualizarea cererii")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!requestId || !request) return
    
    if (!confirm(`Sigur vrei să ștergi cererea pentru ${request.brand} ${request.model} de la ${request.contact_name}?`)) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/member-requests/${requestId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success("Cererea a fost ștearsă cu succes")
        onRequestUpdated()
        onClose()
      } else {
        toast.error(data.error || "Nu am putut șterge cererea")
      }
    } catch (error) {
      console.error("Error deleting request:", error)
      toast.error("Eroare la ștergerea cererii")
    } finally {
      setDeleting(false)
    }
  }

  const handleSendOffer = async () => {
    if (!requestId || !request || !offerLink.trim()) {
      toast.error("Te rog introdu un link valid")
      return
    }

    setSendingOffer(true)
    try {
      const response = await fetch('/api/admin/send-offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          offerLink: offerLink.trim()
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success("Oferta a fost trimisă cu succes!")
        setOfferLink("")
        onRequestUpdated()
      } else {
        toast.error(data.error || "Nu am putut trimite oferta")
      }
    } catch (error) {
      console.error("Error sending offer:", error)
      toast.error("Eroare la trimiterea ofertei")
    } finally {
      setSendingOffer(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'În așteptare'
      case 'in_progress': return 'În progres'
      case 'completed': return 'Completat'
      case 'cancelled': return 'Anulat'
      default: return status
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {loading ? "Se încarcă..." : `Cerere Membru - ${request?.brand} ${request?.model}`}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Se încarcă cererea...</p>
          </div>
        ) : request ? (
          <div className="p-6 space-y-6">
            {/* Request Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vehicle Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Car className="h-4 w-4 mr-2" />
                  Detalii Vehicul
                </h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Marca:</span> {request.brand}</div>
                  <div><span className="font-medium">Model:</span> {request.model}</div>
                  {request.year && <div><span className="font-medium">An:</span> {request.year}</div>}
                  {request.fuel_type && <div><span className="font-medium">Combustibil:</span> {request.fuel_type}</div>}
                  {request.transmission && <div><span className="font-medium">Transmisie:</span> {request.transmission}</div>}
                  {request.max_mileage_km && <div><span className="font-medium">Km maxim:</span> {request.max_mileage_km.toLocaleString()}</div>}
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Contact
                </h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Nume:</span> {request.contact_name}</div>
                  <div><span className="font-medium">Email:</span> {request.contact_email}</div>
                  {request.contact_phone && <div><span className="font-medium">Telefon:</span> {request.contact_phone}</div>}
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Euro className="h-4 w-4 mr-2" />
                Buget
              </h3>
              <div className="text-2xl font-bold text-green-700">
                {request.max_budget?.toLocaleString()}
              </div>
            </div>

            {/* Features */}
            {request.required_features && request.required_features.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Caracteristici dorite:</h3>
                <div className="flex flex-wrap gap-2">
                  {request.required_features.map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {request.additional_notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Note adiționale client:</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {request.additional_notes}
                </p>
              </div>
            )}

            {/* Admin Controls */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Administrare</h3>
              
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">În așteptare</option>
                  <option value="in_progress">În progres</option>
                  <option value="completed">Completat</option>
                  <option value="cancelled">Anulat</option>
                </select>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note administrative
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Adaugă note despre această cerere..."
                />
              </div>

              {/* Send Offer Section */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Link className="h-4 w-4 mr-2 text-green-600" />
                  Trimite Ofertă Client
                </h4>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={offerLink}
                      onChange={(e) => setOfferLink(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="https://example.com/masina-oferta-link"
                    />
                  </div>
                  <Button
                    onClick={handleSendOffer}
                    disabled={sendingOffer || !offerLink.trim()}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    {sendingOffer ? "Se trimite..." : "Trimite"}
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Clientul va primi un email cu linkul către oferta de mașină.
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="text-xs text-gray-500 border-t pt-4">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Creată pe {formatDate(request.created_at)}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Nu am putut încărca cererea
          </div>
        )}

        {/* Footer */}
        {request && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <Button
              onClick={handleDelete}
              disabled={deleting}
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? "Se șterge..." : "Șterge"}
            </Button>
            
            <div className="flex space-x-3">
              <Button
                onClick={onClose}
                variant="outline"
              >
                Anulează
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Se salvează..." : "Salvează"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}