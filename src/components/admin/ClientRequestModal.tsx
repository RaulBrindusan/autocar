"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { X, Car, User, Mail, Phone, Calendar, Euro, Fuel, Cog, Gauge, FileText, Save, Trash2, Edit, Link, Send } from "lucide-react"
import { Button } from "@/components/ui/Button"
// import { createClient } from "@/lib/supabase/client"
import Select from "react-select"
import toast from "react-hot-toast"

interface ClientRequest {
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
  updated_at: string
  admin_notes?: string
  users?: {
    phone?: string
    full_name?: string
    email?: string
  }
}

interface ClientRequestModalProps {
  isOpen: boolean
  onClose: () => void
  requestId: string | null
  onRequestUpdated: () => void
}

interface Option {
  value: string
  label: string
}

export function ClientRequestModal({ isOpen, onClose, requestId, onRequestUpdated }: ClientRequestModalProps) {
  const [request, setRequest] = useState<ClientRequest | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<ClientRequest>>({})
  const [years, setYears] = useState<Option[]>([])
  const [selectedYear, setSelectedYear] = useState<Option | null>(null)
  const [selectedFuelType, setSelectedFuelType] = useState<Option | null>(null)
  const [selectedTransmission, setSelectedTransmission] = useState<Option | null>(null)
  const [offerLink, setOfferLink] = useState("")
  const [sendingOffer, setSendingOffer] = useState(false)

  const supabase = createClient()

  // Fuel type options
  const fuelTypeOptions: Option[] = useMemo(() => [
    { value: "benzina", label: "Benzină" },
    { value: "motorina", label: "Motorină" },
    { value: "gasoline", label: "Benzină" },
    { value: "diesel", label: "Motorină" },
    { value: "hybrid", label: "Hibrid" },
    { value: "electric", label: "Electric" },
    { value: "gpl", label: "GPL" },
    { value: "cng", label: "CNG" },
    { value: "mild-hybrid", label: "Mild Hybrid" },
    { value: "plug-in-hybrid", label: "Plug-in Hybrid" },
    { value: "hydrogen", label: "Hidrogen" },
    { value: "ethanol", label: "Etanol" },
    { value: "lpg", label: "LPG" },
    { value: "flex-fuel", label: "Flex Fuel" },
    { value: "bi-fuel", label: "Bi-Fuel" },
    { value: "range-extender", label: "Range Extender" },
    { value: "other", label: "Altul" }
  ], [])

  // Transmission options
  const transmissionOptions: Option[] = useMemo(() => [
    { value: "manuala", label: "Manuală" },
    { value: "automata", label: "Automată" },
    { value: "manual", label: "Manuală" },
    { value: "automatic", label: "Automată" },
    { value: "semiautomata", label: "Semiautomată" },
    { value: "cvt", label: "CVT" },
    { value: "dsg", label: "DSG" },
    { value: "tiptronic", label: "Tiptronic" },
    { value: "multitronic", label: "Multitronic" },
    { value: "s-tronic", label: "S-Tronic" },
    { value: "pdk", label: "PDK" },
    { value: "zf-8hp", label: "ZF 8HP" },
    { value: "torque-converter", label: "Torque Converter" },
    { value: "dual-clutch", label: "Dual Clutch" },
    { value: "single-speed", label: "Single Speed (Electric)" },
    { value: "e-cvt", label: "e-CVT" },
    { value: "amt", label: "AMT" },
    { value: "imt", label: "iMT" },
    { value: "other", label: "Altul" }
  ], [])

  // Generate years on component mount
  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const yearOptions = []
    for (let year = currentYear; year >= 1985; year--) {
      yearOptions.push({ value: year.toString(), label: year.toString() })
    }
    setYears(yearOptions)
  }, [])

  const fetchRequest = useCallback(async () => {
    if (!requestId) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/admin/member-requests/${requestId}`)
      const data = await response.json()
      
      if (data.success) {
        const requestData = data.data
        setRequest(requestData)
        setEditData(requestData)
        
        // Initialize dropdown selected values
        if (requestData.year) {
          setSelectedYear({ value: requestData.year.toString(), label: requestData.year.toString() })
        }
        if (requestData.fuel_type) {
          const fuelOption = fuelTypeOptions.find(option => option.value === requestData.fuel_type)
          setSelectedFuelType(fuelOption || null)
        }
        if (requestData.transmission) {
          const transmissionOption = transmissionOptions.find(option => option.value === requestData.transmission)
          setSelectedTransmission(transmissionOption || null)
        }
      } else {
        setError('Request not found')
      }
    } catch (err) {
      console.error('Error fetching request:', err)
      setError('Failed to load request')
    } finally {
      setIsLoading(false)
    }
  }, [requestId, fuelTypeOptions, transmissionOptions])

  useEffect(() => {
    if (isOpen && requestId) {
      fetchRequest()
    } else if (!isOpen) {
      // Reset states when modal closes
      setSelectedYear(null)
      setSelectedFuelType(null)
      setSelectedTransmission(null)
      setIsEditing(false)
      setError(null)
    }
  }, [isOpen, requestId, fetchRequest])

  const handleSave = async () => {
    if (!request || !editData) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/admin/member-requests/${request.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brand: editData.brand !== request.brand ? editData.brand : undefined,
          model: editData.model !== request.model ? editData.model : undefined,
          year: editData.year !== request.year ? editData.year : undefined,
          max_budget: editData.max_budget !== request.max_budget ? editData.max_budget : undefined,
          fuel_type: editData.fuel_type !== request.fuel_type ? editData.fuel_type : undefined,
          transmission: editData.transmission !== request.transmission ? editData.transmission : undefined,
          max_mileage_km: editData.max_mileage_km !== request.max_mileage_km ? editData.max_mileage_km : undefined,
          additional_notes: editData.additional_notes !== request.additional_notes ? editData.additional_notes : undefined,
          admin_notes: editData.admin_notes !== request.admin_notes ? editData.admin_notes : undefined,
          required_features: editData.required_features !== request.required_features ? editData.required_features : undefined
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setIsEditing(false)
        await fetchRequest()
        onRequestUpdated()
      } else {
        setError(data.error || 'Failed to update request')
      }
    } catch (err) {
      console.error('Error updating request:', err)
      setError('Failed to update request')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!request) return
    
    if (!confirm('Ești sigur că vrei să ștergi această cerere? Această acțiune nu poate fi anulată.')) {
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/admin/member-requests/${request.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        onRequestUpdated()
        onClose()
      } else {
        setError(data.error || 'Failed to delete request')
      }
    } catch (err) {
      console.error('Error deleting request:', err)
      setError('Failed to delete request')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOffer = async () => {
    if (!request || !offerLink.trim()) {
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
          requestId: request.id,
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
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'În așteptare'
      case 'in_progress': return 'În procesare'
      case 'completed': return 'Finalizat'
      case 'cancelled': return 'Anulat'
      default: return status
    }
  }

  // Dropdown change handlers
  const handleYearChange = (option: Option | null) => {
    setSelectedYear(option)
    if (option) {
      setEditData({...editData, year: parseInt(option.value)})
    }
  }

  const handleFuelTypeChange = (option: Option | null) => {
    setSelectedFuelType(option)
    if (option) {
      setEditData({...editData, fuel_type: option.value})
    }
  }

  const handleTransmissionChange = (option: Option | null) => {
    setSelectedTransmission(option)
    if (option) {
      setEditData({...editData, transmission: option.value})
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Car className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {request ? `${request.brand} ${request.model}` : 'Cerere Client'}
              </h2>
              {request && (
                <p className="text-sm text-gray-600">
                  ID: {request.id}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {request && !isEditing && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  disabled={isLoading}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editează
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Șterge
                </Button>
              </>
            )}
            {isEditing && (
              <>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Salvează
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false)
                    setEditData(request || {})
                  }}
                  disabled={isLoading}
                >
                  Anulează
                </Button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
              disabled={isLoading}
            >
              <X className="h-5 w-5 text-black" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading && !request && (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-600">Se încarcă...</div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {request && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Car Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Car className="h-5 w-5 text-blue-600 mr-2" />
                  Detalii Mașină
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.brand || ''}
                          onChange={(e) => setEditData({...editData, brand: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        />
                      ) : (
                        <p className="text-gray-900">{request.brand}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.model || ''}
                          onChange={(e) => setEditData({...editData, model: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        />
                      ) : (
                        <p className="text-gray-900">{request.model}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">An</label>
                      {isEditing ? (
                        <Select
                          options={years}
                          value={selectedYear}
                          onChange={handleYearChange}
                          placeholder="Selectează anul..."
                          className="react-select-container text-black"
                          classNamePrefix="react-select"
                          isSearchable
                          instanceId="year-select"
                          styles={{
                            singleValue: (provided) => ({
                              ...provided,
                              color: 'black'
                            }),
                            input: (provided) => ({
                              ...provided,
                              color: 'black'
                            })
                          }}
                        />
                      ) : (
                        <p className="text-gray-900">{request.year}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Buget Maxim (€)</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editData.max_budget || ''}
                          onChange={(e) => setEditData({...editData, max_budget: parseFloat(e.target.value) || undefined})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        />
                      ) : (
                        <p className="text-gray-900">€{request.max_budget?.toLocaleString()}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Combustibil</label>
                      {isEditing ? (
                        <Select
                          options={fuelTypeOptions}
                          value={selectedFuelType}
                          onChange={handleFuelTypeChange}
                          placeholder="Selectează combustibilul..."
                          className="react-select-container text-black"
                          classNamePrefix="react-select"
                          isSearchable
                          instanceId="fuel-type-select"
                          styles={{
                            singleValue: (provided) => ({
                              ...provided,
                              color: 'black'
                            }),
                            input: (provided) => ({
                              ...provided,
                              color: 'black'
                            })
                          }}
                        />
                      ) : (
                        <p className="text-gray-900">{request.fuel_type}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Transmisie</label>
                      {isEditing ? (
                        <Select
                          options={transmissionOptions}
                          value={selectedTransmission}
                          onChange={handleTransmissionChange}
                          placeholder="Selectează transmisia..."
                          className="react-select-container text-black"
                          classNamePrefix="react-select"
                          isSearchable
                          instanceId="transmission-select"
                          styles={{
                            singleValue: (provided) => ({
                              ...provided,
                              color: 'black'
                            }),
                            input: (provided) => ({
                              ...provided,
                              color: 'black'
                            })
                          }}
                        />
                      ) : (
                        <p className="text-gray-900">{request.transmission}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kilometraj Maxim</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData.max_mileage_km || ''}
                        onChange={(e) => setEditData({...editData, max_mileage_km: parseInt(e.target.value) || undefined})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    ) : (
                      <p className="text-gray-900">{request.max_mileage_km?.toLocaleString()} km</p>
                    )}
                  </div>


                  {request.required_features && request.required_features.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Caracteristici Dorite</label>
                      <div className="flex flex-wrap gap-2">
                        {request.required_features.map((feature, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-sm">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {request.additional_notes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Note Adiționale</label>
                      {isEditing ? (
                        <textarea
                          value={editData.additional_notes || ''}
                          onChange={(e) => setEditData({...editData, additional_notes: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        />
                      ) : (
                        <p className="text-gray-900">{request.additional_notes}</p>
                      )}
                    </div>
                  )}

                  {/* Admin Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Note Administrative</label>
                    {isEditing ? (
                      <textarea
                        value={editData.admin_notes || ''}
                        onChange={(e) => setEditData({...editData, admin_notes: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="Note pentru echipa administrativă..."
                      />
                    ) : (
                      <p className="text-gray-900">{request.admin_notes || 'Nu există note administrative'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact & Meta */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 text-green-600 mr-2" />
                  Contact Client
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nume</label>
                    <p className="text-gray-900">{request.users?.full_name || request.contact_name}</p>
                    {request.users?.full_name && request.contact_name && request.users.full_name !== request.contact_name && (
                      <p className="text-xs text-gray-500 mt-1">Nume cerere: {request.contact_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{request.users?.email || request.contact_email}</p>
                    {request.users?.email && request.contact_email && request.users.email !== request.contact_email && (
                      <p className="text-xs text-gray-500 mt-1">Email cerere: {request.contact_email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <p className="text-gray-900">{request.users?.phone || request.contact_phone || 'Nu a fost furnizat'}</p>
                    {request.users?.phone && request.contact_phone && request.users.phone !== request.contact_phone && (
                      <p className="text-xs text-gray-500 mt-1">Telefon cerere: {request.contact_phone}</p>
                    )}
                  </div>

                  <div className="border-t pt-4 mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Informații Cerere</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Creat: {formatDate(request.created_at)}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Actualizat: {formatDate(request.updated_at)}
                      </div>
                    </div>
                  </div>

                  {/* Send Offer Section */}
                  <div className="border-t pt-4 mt-6">
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black placeholder-gray-500"
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
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}