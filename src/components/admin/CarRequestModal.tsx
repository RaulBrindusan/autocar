'use client'

import { useState, useEffect } from 'react'
import { X, Car, User, Mail, Phone, Calendar, Euro, Fuel, Cog, Gauge, FileText, Save, Trash2, Edit, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import Select from 'react-select'

interface CarRequest {
  id: string
  user_id: string | null
  brand: string
  model: string
  year: number | null
  max_budget: number | null
  preferred_color: string | null
  fuel_type: string | null
  transmission: string | null
  mileage_max: number | null
  additional_requirements: string | null
  contact_email: string
  contact_phone: string | null
  contact_name: string
  status: string
  created_at: string
  updated_at: string
  custom_features: string[] | null
  user_full_name: string | null
  user_email: string | null
  timeline_stage: string
  timeline_updated_at: string | null
  timeline_updated_by: string | null
  auction_result: 'win' | 'lose' | null
  auction_decided_at: string | null
  auto_reset_scheduled: boolean
  reset_scheduled_at: string | null
}

interface CarRequestModalProps {
  isOpen: boolean
  onClose: () => void
  requestId: string | null
  onRequestUpdated: () => void
}

interface Option {
  value: string
  label: string
}

export function CarRequestModal({ isOpen, onClose, requestId, onRequestUpdated }: CarRequestModalProps) {
  const [request, setRequest] = useState<CarRequest | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<CarRequest>>({})
  const [years, setYears] = useState<Option[]>([])
  const [selectedYear, setSelectedYear] = useState<Option | null>(null)
  const [selectedFuelType, setSelectedFuelType] = useState<Option | null>(null)
  const [selectedTransmission, setSelectedTransmission] = useState<Option | null>(null)
  const [selectedTimelineStage, setSelectedTimelineStage] = useState<Option | null>(null)
  const [selectedAuctionResult, setSelectedAuctionResult] = useState<Option | null>(null)

  const supabase = createClient()

  // Fuel type options
  const fuelTypeOptions: Option[] = [
    { value: "benzina", label: "Benzină" },
    { value: "motorina", label: "Motorină" },
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
    { value: "range-extender", label: "Range Extender" }
  ]

  // Transmission options
  const transmissionOptions: Option[] = [
    { value: "manuala", label: "Manuală" },
    { value: "automata", label: "Automată" },
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
    { value: "imt", label: "iMT" }
  ]

  // Timeline stage options
  const timelineStageOptions: Option[] = [
    { value: "requested", label: "Cerere trimisă" },
    { value: "searching", label: "Căutare activă" },
    { value: "found", label: "Mașină găsită" },
    { value: "auction_time", label: "Timp de licitație" },
    { value: "auction_won", label: "Licitație câștigată" },
    { value: "auction_lost", label: "Achizitie Esuata (pret depasit)" },
    { value: "purchased", label: "Cumpărată" },
    { value: "purchase_failed", label: "Achizitie Esuata (pret depasit)" },
    { value: "in_transit", label: "În transport" },
    { value: "delivered", label: "Livrată" }
  ]

  // Auction result options
  const auctionResultOptions: Option[] = [
    { value: "win", label: "Câștigat" },
    { value: "lose", label: "Pierdut" }
  ]

  // Generate years on component mount
  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const yearOptions = []
    for (let year = currentYear; year >= 1985; year--) {
      yearOptions.push({ value: year.toString(), label: year.toString() })
    }
    setYears(yearOptions)
  }, [])

  useEffect(() => {
    if (isOpen && requestId) {
      fetchRequest()
    } else if (!isOpen) {
      // Reset states when modal closes
      setSelectedYear(null)
      setSelectedFuelType(null)
      setSelectedTransmission(null)
      setSelectedTimelineStage(null)
      setSelectedAuctionResult(null)
      setIsEditing(false)
      setError(null)
    }
  }, [isOpen, requestId]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRequest = async () => {
    if (!requestId) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.rpc('admin_get_car_request', { 
        request_id: requestId 
      })
      
      if (error) throw error
      
      if (data && data.length > 0) {
        const requestData = data[0]
        
        // Automatically change status from 'pending' to 'completed' when modal is opened
        if (requestData.status === 'pending') {
          try {
            await supabase.rpc('admin_update_car_request', {
              request_id: requestId,
              new_status: 'completed'
            })
            
            // Update the local data to reflect the change
            requestData.status = 'completed'
            requestData.updated_at = new Date().toISOString()
            
            // Notify parent component to refresh data
            onRequestUpdated()
          } catch (statusError) {
            console.error('Error updating status:', statusError)
            // Continue with original status if update fails
          }
        }
        
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
        if (requestData.timeline_stage) {
          const timelineOption = timelineStageOptions.find(option => option.value === requestData.timeline_stage)
          setSelectedTimelineStage(timelineOption || null)
        }
        if (requestData.auction_result) {
          const auctionOption = auctionResultOptions.find(option => option.value === requestData.auction_result)
          setSelectedAuctionResult(auctionOption || null)
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
  }

  const handleTimelineUpdate = async () => {
    if (!request || !selectedTimelineStage) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Get current user for tracking who updated
      const { data: { user } } = await supabase.auth.getUser()
      
      const updateData: any = {
        timeline_stage: selectedTimelineStage.value,
        timeline_updated_at: new Date().toISOString(),
        timeline_updated_by: user?.id
      }

      // Handle auction result
      if (selectedTimelineStage.value === 'auction_time' && selectedAuctionResult) {
        updateData.auction_result = selectedAuctionResult.value
        updateData.auction_decided_at = new Date().toISOString()
        
        // If auction lost, schedule auto-reset after 5 minutes
        if (selectedAuctionResult.value === 'lose') {
          updateData.auto_reset_scheduled = true
          updateData.reset_scheduled_at = new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes from now
          updateData.timeline_stage = 'purchase_failed'
        } else if (selectedAuctionResult.value === 'win') {
          updateData.timeline_stage = 'auction_won'
        }
      }

      const { error } = await supabase
        .from('car_requests')
        .update(updateData)
        .eq('id', request.id)

      if (error) throw error

      await fetchRequest()
      onRequestUpdated()
      
      // Show success message
      alert('Timeline updated successfully!')
    } catch (err) {
      console.error('Error updating timeline:', err)
      setError('Failed to update timeline')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!request || !editData) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.rpc('admin_update_car_request', {
        request_id: request.id,
        new_brand: editData.brand !== request.brand ? editData.brand : null,
        new_model: editData.model !== request.model ? editData.model : null,
        new_year: editData.year !== request.year ? editData.year : null,
        new_max_budget: editData.max_budget !== request.max_budget ? editData.max_budget : null,
        new_preferred_color: editData.preferred_color !== request.preferred_color ? editData.preferred_color : null,
        new_fuel_type: editData.fuel_type !== request.fuel_type ? editData.fuel_type : null,
        new_transmission: editData.transmission !== request.transmission ? editData.transmission : null,
        new_mileage_max: editData.mileage_max !== request.mileage_max ? editData.mileage_max : null,
        new_additional_requirements: editData.additional_requirements !== request.additional_requirements ? editData.additional_requirements : null,
        new_contact_email: editData.contact_email !== request.contact_email ? editData.contact_email : null,
        new_contact_phone: editData.contact_phone !== request.contact_phone ? editData.contact_phone : null,
        new_contact_name: editData.contact_name !== request.contact_name ? editData.contact_name : null,
        new_status: editData.status !== request.status ? editData.status : null,
        new_custom_features: editData.custom_features !== request.custom_features ? editData.custom_features : null,
      })
      
      if (error) throw error
      
      setIsEditing(false)
      await fetchRequest()
      onRequestUpdated()
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
      const { error } = await supabase.rpc('admin_delete_car_request', {
        request_id: request.id
      })
      
      if (error) throw error
      
      onRequestUpdated()
      onClose()
    } catch (err) {
      console.error('Error deleting request:', err)
      setError('Failed to delete request')
    } finally {
      setIsLoading(false)
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
      case 'quoted': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'În așteptare'
      case 'in_progress': return 'În procesare'
      case 'quoted': return 'Ofertat'
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
                {request ? `${request.brand} ${request.model}` : 'Cerere Mașină'}
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                          className="react-select-container"
                          classNamePrefix="react-select"
                          isSearchable
                          instanceId="year-select"
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
                          onChange={(e) => setEditData({...editData, max_budget: parseFloat(e.target.value) || null})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                          className="react-select-container"
                          classNamePrefix="react-select"
                          isSearchable
                          instanceId="fuel-type-select"
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
                          className="react-select-container"
                          classNamePrefix="react-select"
                          isSearchable
                          instanceId="transmission-select"
                        />
                      ) : (
                        <p className="text-gray-900">{request.transmission}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kilometraj Maxim</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editData.mileage_max || ''}
                          onChange={(e) => setEditData({...editData, mileage_max: parseInt(e.target.value) || null})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{request.mileage_max?.toLocaleString()} km</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Culoare Preferată</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.preferred_color || ''}
                          onChange={(e) => setEditData({...editData, preferred_color: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{request.preferred_color || 'Nu specificat'}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    {isEditing ? (
                      <select
                        value={editData.status || ''}
                        onChange={(e) => setEditData({...editData, status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">În așteptare</option>
                        <option value="in_progress">În procesare</option>
                        <option value="quoted">Ofertat</option>
                        <option value="completed">Finalizat</option>
                        <option value="cancelled">Anulat</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    )}
                  </div>

                  {request.custom_features && request.custom_features.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Caracteristici Dorite</label>
                      <div className="flex flex-wrap gap-2">
                        {request.custom_features.map((feature, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-sm">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {request.additional_requirements && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cerințe Adiționale</label>
                      {isEditing ? (
                        <textarea
                          value={editData.additional_requirements || ''}
                          onChange={(e) => setEditData({...editData, additional_requirements: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{request.additional_requirements}</p>
                      )}
                    </div>
                  )}
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
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.contact_name || ''}
                        onChange={(e) => setEditData({...editData, contact_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{request.user_full_name || request.contact_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.contact_email || ''}
                        onChange={(e) => setEditData({...editData, contact_email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{request.user_email || request.contact_email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.contact_phone || ''}
                        onChange={(e) => setEditData({...editData, contact_phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{request.contact_phone}</p>
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
                      {request.user_id && (
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          Utilizator înregistrat: Da
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Management Section */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  Gestionare Timeline
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Etapă curentă: <span className="font-semibold text-blue-600">
                        {timelineStageOptions.find(opt => opt.value === request.timeline_stage)?.label || request.timeline_stage}
                      </span>
                    </label>
                    {request.timeline_updated_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        Actualizat ultima dată: {formatDate(request.timeline_updated_at)}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Schimbă etapa la:
                      </label>
                      <Select
                        options={timelineStageOptions}
                        value={selectedTimelineStage}
                        onChange={setSelectedTimelineStage}
                        placeholder="Selectează etapa..."
                        className="react-select-container"
                        classNamePrefix="react-select"
                        instanceId="timeline-stage-select"
                      />
                    </div>
                    
                    {selectedTimelineStage?.value === 'auction_time' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rezultat licitație:
                        </label>
                        <Select
                          options={auctionResultOptions}
                          value={selectedAuctionResult}
                          onChange={setSelectedAuctionResult}
                          placeholder="Selectează rezultatul..."
                          className="react-select-container"
                          classNamePrefix="react-select"
                          instanceId="auction-result-select"
                        />
                      </div>
                    )}
                  </div>

                  {request.auction_result && (
                    <div className="mt-4 p-3 bg-white rounded-lg border">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Istoric licitație:</h4>
                      <div className="text-sm text-gray-600">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          request.auction_result === 'win' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {request.auction_result === 'win' ? 'Câștigat' : 'Pierdut'}
                        </span>
                        {request.auction_decided_at && (
                          <span className="ml-2 text-gray-500">
                            la {formatDate(request.auction_decided_at)}
                          </span>
                        )}
                      </div>
                      {request.auto_reset_scheduled && (
                        <p className="text-xs text-orange-600 mt-2">
                          ⚠️ Auto-reset programat pentru {formatDate(request.reset_scheduled_at)} (întoarcere la căutare activă)
                        </p>
                      )}
                    </div>
                  )}
                  
                  <Button
                    onClick={handleTimelineUpdate}
                    disabled={!selectedTimelineStage || isLoading}
                    className="w-full mt-4"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Actualizează Timeline
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}