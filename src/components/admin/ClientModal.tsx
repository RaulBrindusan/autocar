'use client'

import { useState, useEffect } from 'react'
import { X, Users, Mail, Phone, Calendar, Car, Euro, Plus, Edit, Save, Trash2, Settings, Fuel, Cog, Gauge } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal'
// import { createClient } from '@/lib/supabase/client'
import Select from 'react-select'

interface Option {
  value: string
  label: string
}

interface User {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
  car_requests_count: number
  cost_estimates_count: number
  openlane_submissions_count: number
}

interface MemberCarRequest {
  id: string
  user_id: string
  brand: string
  model: string
  year: number | null
  engine_capacity: number | null
  horsepower: number | null
  fuel_type: string | null
  transmission: string | null
  drivetrain: string | null
  body_type: string | null
  doors: number | null
  seats: number | null
  condition: string | null
  mileage_km: number | null
  accident_history: boolean | null
  service_records_available: boolean | null
  preferred_colors: string[] | null
  max_budget: number | null
  budget_currency: string | null
  max_mileage_km: number | null
  min_year: number | null
  required_features: string[] | null
  preferred_features: string[] | null
  excluded_features: string[] | null
  preferred_origin_countries: string[] | null
  delivery_location: string | null
  delivery_deadline: string | null
  inspection_required: boolean | null
  contact_name: string
  contact_email: string
  contact_phone: string | null
  preferred_contact_method: string | null
  contact_language: string | null
  urgency_level: string | null
  flexibility_level: string | null
  additional_notes: string | null
  special_requirements: string | null
  status: string
  priority_level: string | null
  assigned_agent_id: string | null
  source_platform: string | null
  estimated_completion_date: string | null
  internal_notes: string | null
  created_at: string
  updated_at: string
  expires_at: string | null
}

interface ClientModalProps {
  isOpen: boolean
  onClose: () => void
  client: User | null
  mode: 'view' | 'create'
  onClientUpdated: () => void
}

export function ClientModal({ isOpen, onClose, client, mode, onClientUpdated }: ClientModalProps) {
  const [memberRequests, setMemberRequests] = useState<MemberCarRequest[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editClientData, setEditClientData] = useState({
    contact_name: '',
    contact_phone: ''
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  // Form data for creating new clients
  const [formData, setFormData] = useState({
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    max_budget: 10000,
    preferred_color: '',
    fuel_type: '',
    transmission: '',
    mileage_max: 150000,
    additional_requirements: '',
    status: 'pending',
    custom_features: [] as string[]
  })

  // State for dropdowns
  const [makes, setMakes] = useState<Option[]>([])
  const [models, setModels] = useState<Option[]>([])
  const [years, setYears] = useState<Option[]>([])
  const [loadingMakes, setLoadingMakes] = useState(false)
  const [loadingModels, setLoadingModels] = useState(false)
  const [selectedMake, setSelectedMake] = useState<Option | null>(null)
  const [selectedModel, setSelectedModel] = useState<Option | null>(null)
  const [selectedYear, setSelectedYear] = useState<Option | null>(null)
  const [selectedFuelType, setSelectedFuelType] = useState<Option | null>(null)
  const [selectedTransmission, setSelectedTransmission] = useState<Option | null>(null)
  const [selectedFeatures, setSelectedFeatures] = useState<Option[]>([])

  // const supabase = createClient() // Firebase migration

  // Common car features
  const featuresOptions: Option[] = [
    { value: "leather", label: "Interior din piele" },
    { value: "sunroof", label: "Trapă" },
    { value: "navigation", label: "Sistem de navigație" },
    { value: "heated-seats", label: "Scaune încălzite" },
    { value: "cooled-seats", label: "Scaune ventilate" },
    { value: "heated-steering", label: "Volan încălzit" },
    { value: "bluetooth", label: "Bluetooth" },
    { value: "backup-camera", label: "Cameră de mers înapoi" },
    { value: "360-camera", label: "Cameră 360°" },
    { value: "cruise-control", label: "Cruise control" },
    { value: "adaptive-cruise", label: "Cruise control adaptiv" },
    { value: "keyless", label: "Pornire fără cheie" },
    { value: "keyless-entry", label: "Acces fără cheie" },
    { value: "premium-audio", label: "Sistem audio premium" },
    { value: "xenon", label: "Faruri Xenon/LED" },
    { value: "matrix-led", label: "Faruri Matrix LED" },
    { value: "parking-sensors", label: "Senzori de parcare" },
    { value: "auto-park", label: "Parcare automată" },
    { value: "climate-control", label: "Climatizare automată" },
    { value: "dual-zone-climate", label: "Climatizare bi-zonă" },
    { value: "tri-zone-climate", label: "Climatizare tri-zonă" },
    { value: "lane-assist", label: "Asistent de bandă" },
    { value: "blind-spot", label: "Monitor unghi mort" },
    { value: "collision-warning", label: "Avertizare coliziune" },
    { value: "emergency-brake", label: "Frânare de urgență" },
    { value: "traffic-sign", label: "Recunoaștere indicatoare" },
    { value: "wireless-charging", label: "Încărcare wireless" },
    { value: "apple-carplay", label: "Apple CarPlay" },
    { value: "android-auto", label: "Android Auto" },
    { value: "heads-up-display", label: "Head-up Display" },
    { value: "panoramic-roof", label: "Plafonul panoramic" },
    { value: "electric-seats", label: "Scaune electrice" },
    { value: "memory-seats", label: "Scaune cu memorie" },
    { value: "massage-seats", label: "Scaune cu masaj" },
    { value: "sport-suspension", label: "Suspensie sport" },
    { value: "air-suspension", label: "Suspensie pneumatică" },
    { value: "awd", label: "Tracțiune integrală" },
    { value: "sport-mode", label: "Moduri de conducere" },
    { value: "start-stop", label: "Sistem Start-Stop" },
    { value: "eco-mode", label: "Mod Eco" },
    { value: "night-vision", label: "Vedere nocturnă" },
    { value: "ambient-lighting", label: "Iluminare ambientală" }
  ]

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
    if (isOpen) {
      if (mode === 'view' && client) {
        fetchClientDetails()
        setEditClientData({
          contact_name: client.full_name || '',
          contact_phone: client.phone || ''
        })
      } else if (mode === 'create') {
        setIsEditing(true)
        fetchMakes()
        resetCreateForm()
      }
    }
  }, [isOpen, client, mode]) // eslint-disable-line react-hooks/exhaustive-deps

  const resetCreateForm = () => {
    const currentYear = new Date().getFullYear()
    setFormData({
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      brand: '',
      model: '',
      year: currentYear,
      max_budget: 10000,
      preferred_color: '',
      fuel_type: '',
      transmission: '',
      mileage_max: 150000,
      additional_requirements: '',
      status: 'pending',
      custom_features: []
    })
    setSelectedMake(null)
    setSelectedModel(null)
    setSelectedYear({ value: currentYear.toString(), label: currentYear.toString() })
    setSelectedFuelType(null)
    setSelectedTransmission(null)
    setSelectedFeatures([])
    setModels([])
  }

  const fetchMakes = async () => {
    try {
      setLoadingMakes(true)
      const response = await fetch('/api/cars/makes')
      const data = await response.json()
      
      if (data.success) {
        setMakes(data.makes.map((make: any) => ({
          value: make.Make_Name,
          label: make.Make_Name
        })))
      }
    } catch (error) {
      console.error('Error fetching makes:', error)
      // Fallback to common European makes
      setMakes([
        { value: "BMW", label: "BMW" },
        { value: "Mercedes-Benz", label: "Mercedes-Benz" },
        { value: "Audi", label: "Audi" },
        { value: "Volkswagen", label: "Volkswagen" },
        { value: "Porsche", label: "Porsche" },
        { value: "Volvo", label: "Volvo" },
        { value: "Jaguar", label: "Jaguar" },
        { value: "Land Rover", label: "Land Rover" },
        { value: "MINI", label: "MINI" },
        { value: "Skoda", label: "Škoda" }
      ])
    } finally {
      setLoadingMakes(false)
    }
  }

  const fetchModels = async (make: string) => {
    try {
      setLoadingModels(true)
      const response = await fetch(`/api/cars/models?make=${encodeURIComponent(make)}`)
      const data = await response.json()
      
      if (data.success) {
        setModels(data.models.map((model: any) => ({
          value: model.Model_Name,
          label: model.Model_Name
        })))
      }
    } catch (error) {
      console.error('Error fetching models:', error)
      // Fallback models based on make
      const fallbackModels = getFallbackModels(make)
      setModels(fallbackModels)
    } finally {
      setLoadingModels(false)
    }
  }

  const getFallbackModels = (make: string): Option[] => {
    const modelMap: { [key: string]: string[] } = {
      "BMW": ["Seria 1", "Seria 3", "Seria 5", "Seria 7", "X1", "X3", "X5", "X6", "Z4"],
      "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLC", "GLE", "G-Class"],
      "Audi": ["A1", "A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "TT"],
      "Volkswagen": ["Golf", "Passat", "Tiguan", "Touareg", "Polo", "Jetta", "Arteon"],
      "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan", "Boxster", "Cayman"]
    }
    
    const models = modelMap[make] || ["Model 1", "Model 2", "Model 3"]
    return models.map(model => ({ value: model, label: model }))
  }

  const fetchClientDetails = async () => {
    if (!client) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.rpc('admin_get_member_details', { 
        member_user_id: client.id 
      })
      
      if (error) {
        console.error('Supabase RPC error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        throw error
      }
      
      setMemberRequests(data || [])
    } catch (err) {
      console.error('Error fetching member details:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        clientId: client.id,
        errorType: typeof err,
        stringifiedError: JSON.stringify(err, null, 2)
      })
      setError(`Failed to load member details: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Dropdown change handlers
  const handleMakeChange = (option: Option | null) => {
    setSelectedMake(option)
    setSelectedModel(null)
    setModels([])
    
    if (option) {
      setFormData({...formData, brand: option.value, model: ''})
      fetchModels(option.value)
    }
  }

  const handleModelChange = (option: Option | null) => {
    setSelectedModel(option)
    if (option) {
      setFormData({...formData, model: option.value})
    }
  }

  const handleYearChange = (option: Option | null) => {
    setSelectedYear(option)
    if (option) {
      setFormData({...formData, year: parseInt(option.value)})
    }
  }

  const handleFuelTypeChange = (option: Option | null) => {
    setSelectedFuelType(option)
    if (option) {
      setFormData({...formData, fuel_type: option.value})
    }
  }

  const handleTransmissionChange = (option: Option | null) => {
    setSelectedTransmission(option)
    if (option) {
      setFormData({...formData, transmission: option.value})
    }
  }

  const handleFeaturesChange = (options: readonly Option[]) => {
    setSelectedFeatures(Array.from(options))
    setFormData({...formData, custom_features: options.map(opt => opt.value)})
  }

  const handleCreateClient = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.rpc('admin_create_car_request', {
        new_contact_name: formData.contact_name,
        new_contact_email: formData.contact_email,
        new_contact_phone: formData.contact_phone || null,
        new_brand: formData.brand || 'Necunoscut',
        new_model: formData.model || 'Necunoscut',
        new_year: formData.year,
        new_max_budget: formData.max_budget,
        new_preferred_color: formData.preferred_color || null,
        new_fuel_type: formData.fuel_type || null,
        new_transmission: formData.transmission || null,
        new_mileage_max: formData.mileage_max,
        new_additional_requirements: formData.additional_requirements || null,
        new_status: formData.status,
        new_custom_features: formData.custom_features.length > 0 ? formData.custom_features : null
      })
      
      if (error) throw error
      
      onClientUpdated()
      onClose()
    } catch (err) {
      console.error('Error creating client:', err)
      setError('Failed to create client')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateClient = async () => {
    if (!client) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Update user profile in users table
      const { error } = await supabase
        .from('users')
        .update({
          full_name: editClientData.contact_name,
          phone: editClientData.contact_phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', client.id)
      
      if (error) throw error
      
      setIsEditing(false)
      await fetchClientDetails()
      onClientUpdated()
    } catch (err) {
      console.error('Error updating member:', err)
      setError('Failed to update member')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClient = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDeleteClient = async () => {
    if (!client) return
    
    setShowDeleteConfirm(false)
    setIsLoading(true)
    setError(null)
    
    try {
      // Call API to delete member (admin only)
      const response = await fetch('/api/admin/delete-member', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId: client.id }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete member')
      }
      
      onClientUpdated()
      onClose()
    } catch (err) {
      console.error('Error deleting member:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete member')
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
      case 'reviewing': return 'bg-blue-100 text-blue-800'
      case 'sourcing': return 'bg-purple-100 text-purple-800'
      case 'found_options': return 'bg-indigo-100 text-indigo-800'
      case 'negotiating': return 'bg-orange-100 text-orange-800'
      case 'approved': return 'bg-cyan-100 text-cyan-800'
      case 'purchasing': return 'bg-pink-100 text-pink-800'
      case 'shipping': return 'bg-teal-100 text-teal-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'În așteptare'
      case 'reviewing': return 'În evaluare'
      case 'sourcing': return 'Căutare mașină'
      case 'found_options': return 'Opțiuni găsite'
      case 'negotiating': return 'Negociere'
      case 'approved': return 'Aprobat'
      case 'purchasing': return 'Achiziție'
      case 'shipping': return 'Transport'
      case 'completed': return 'Finalizat'
      case 'cancelled': return 'Anulat'
      case 'expired': return 'Expirat'
      default: return status
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'create' ? 'Adaugă Membru Nou' : `Membru: ${client?.full_name || client?.email}`}
              </h2>
              {mode === 'view' && client && (
                <p className="text-sm text-gray-600">
                  {client.car_requests_count} cereri mașini • {client.cost_estimates_count} estimări • Înregistrat: {formatDate(client.created_at)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {mode === 'create' && (
              <Button
                onClick={handleCreateClient}
                disabled={isLoading || !formData.contact_name || !formData.contact_email}
              >
                <Save className="h-4 w-4 mr-1" />
                Salvează Client
              </Button>
            )}
            {mode === 'view' && client && !isEditing && (
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
                  onClick={handleDeleteClient}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Șterge
                </Button>
              </>
            )}
            {mode === 'view' && isEditing && (
              <>
                <Button
                  size="sm"
                  onClick={handleUpdateClient}
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
                    setEditClientData({
                      contact_name: client?.full_name || '',
                      contact_phone: client?.phone || ''
                    })
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
          {isLoading && mode === 'view' && (
            <div className="flex items-center justify-center py-12">
              <div className="text-black">Se încarcă...</div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {mode === 'create' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Client Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  Informații Client
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Nume *</label>
                    <input
                      type="text"
                      value={formData.contact_name}
                      onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="Numele clientului"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Email *</label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="email@exemplu.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Telefon</label>
                    <input
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="+40 770 123 456"
                    />
                  </div>
                </div>
              </div>

              {/* Car Request Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Car className="h-5 w-5 text-green-600 mr-2" />
                  Prima Cerere Mașină
                </h3>
                <div className="space-y-4">
                  {/* Make Selection */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      <Car className="h-4 w-4 inline mr-1" />
                      Marca *
                    </label>
                    <Select
                      options={makes}
                      value={selectedMake}
                      onChange={handleMakeChange}
                      placeholder="Selectează marca..."
                      isLoading={loadingMakes}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isSearchable
                      instanceId="make-select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: '42px',
                          fontSize: '14px'
                        })
                      }}
                    />
                  </div>

                  {/* Model Selection */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Modelul *
                    </label>
                    <Select
                      options={models}
                      value={selectedModel}
                      onChange={handleModelChange}
                      placeholder="Selectează modelul..."
                      isLoading={loadingModels}
                      isDisabled={!selectedMake}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isSearchable
                      instanceId="model-select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: '42px',
                          fontSize: '14px'
                        })
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">An</label>
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
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Buget (€)</label>
                      <input
                        type="number"
                        value={formData.max_budget}
                        onChange={(e) => setFormData({...formData, max_budget: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        min="1000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Combustibil</label>
                      <select
                        value={formData.fuel_type}
                        onChange={(e) => setFormData({...formData, fuel_type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      >
                        <option value="benzina">Benzină</option>
                        <option value="motorina">Motorină</option>
                        <option value="hibrid">Hibrid</option>
                        <option value="electric">Electric</option>
                        <option value="gpl">GPL</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Transmisie</label>
                      <select
                        value={formData.transmission}
                        onChange={(e) => setFormData({...formData, transmission: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      >
                        <option value="manuala">Manuală</option>
                        <option value="automata">Automată</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Cerințe Adiționale</label>
                    <textarea
                      value={formData.additional_requirements}
                      onChange={(e) => setFormData({...formData, additional_requirements: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="Orice cerințe speciale..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {mode === 'view' && client && memberRequests.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Client Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  Informații Client
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Nume</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editClientData.contact_name}
                        onChange={(e) => setEditClientData({...editClientData, contact_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-black">{client.full_name || 'Nume nedefinit'}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Email</label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-black">{client.email}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Telefon</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editClientData.contact_phone}
                        onChange={(e) => setEditClientData({...editClientData, contact_phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="Număr de telefon"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-black">{client.phone || 'Nu este specificat'}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4 text-gray-500" />
                    <span className="text-black">{client.car_requests_count} cereri total</span>
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    Utilizator înregistrat
                  </div>
                </div>
              </div>

              {/* Member Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Car className="h-5 w-5 text-green-600 mr-2" />
                  Activitate Membru
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{client.car_requests_count}</div>
                      <div className="text-sm text-gray-600">Cereri Mașini</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{client.cost_estimates_count}</div>
                      <div className="text-sm text-gray-600">Estimări Cost</div>
                    </div>
                  </div>
                  <div className="text-center pt-2 border-t border-gray-200">
                    <div className="text-lg font-semibold text-purple-600">{client.openlane_submissions_count}</div>
                    <div className="text-sm text-gray-600">Submisii OpenLane</div>
                  </div>
                  <div className="flex items-center justify-center space-x-2 mt-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Înregistrat: {formatDate(client.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Member Requests */}
          {mode === 'view' && memberRequests.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Toate Cererile de Import ({memberRequests.length})</h3>
              <div className="space-y-4">
                {memberRequests.map((request, index) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Vehicle Info */}
                      <div className="flex-1">
                        <h4 className="font-medium text-black text-lg mb-2">
                          {request.brand} {request.model} {request.year}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          {request.engine_capacity && (
                            <div className="flex items-center">
                              <Settings className="h-4 w-4 mr-1" />
                              Motor: {request.engine_capacity}L
                              {request.horsepower && ` • ${request.horsepower} CP`}
                            </div>
                          )}
                          {request.fuel_type && (
                            <div className="flex items-center">
                              <Fuel className="h-4 w-4 mr-1" />
                              Combustibil: {request.fuel_type}
                            </div>
                          )}
                          {request.transmission && (
                            <div className="flex items-center">
                              <Cog className="h-4 w-4 mr-1" />
                              Transmisie: {request.transmission}
                            </div>
                          )}
                          {request.mileage_km && (
                            <div className="flex items-center">
                              <Gauge className="h-4 w-4 mr-1" />
                              Km: {request.mileage_km.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Budget & Requirements */}
                      <div>
                        <div className="text-sm text-black space-y-2">
                          {request.max_budget && (
                            <div className="flex items-center font-medium">
                              <Euro className="h-4 w-4 mr-1" />
                              Buget: {request.max_budget.toLocaleString()} {request.budget_currency || 'EUR'}
                            </div>
                          )}
                          {request.delivery_location && (
                            <div className="text-sm text-gray-600">
                              Livrare: {request.delivery_location}
                            </div>
                          )}
                          {request.urgency_level && (
                            <div className="text-sm text-gray-600">
                              Urgență: {request.urgency_level}
                            </div>
                          )}
                          {request.preferred_colors && request.preferred_colors.length > 0 && (
                            <div className="text-sm text-gray-600">
                              Culori: {request.preferred_colors.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status & Dates */}
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                        {request.priority_level && (
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            Prioritate: {request.priority_level}
                          </span>
                        )}
                        <div className="text-xs text-gray-500 text-right">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Creat: {formatDate(request.created_at)}
                          </div>
                          {request.expires_at && (
                            <div className="mt-1 text-orange-600">
                              Expiră: {formatDate(request.expires_at)}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          #{request.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>

                    {/* Additional Info */}
                    {(request.additional_notes || request.special_requirements || request.internal_notes) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        {request.additional_notes && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Note client: </span>
                            <span className="text-sm text-gray-600">{request.additional_notes}</span>
                          </div>
                        )}
                        {request.special_requirements && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Cerințe speciale: </span>
                            <span className="text-sm text-gray-600">{request.special_requirements}</span>
                          </div>
                        )}
                        {request.internal_notes && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-red-700">Note interne: </span>
                            <span className="text-sm text-red-600">{request.internal_notes}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onConfirm={confirmDeleteClient}
        onCancel={() => setShowDeleteConfirm(false)}
        title="Confirmare Ștergere Membru"
        message={`Ești sigur că vrei să ștergi membrul ${client?.full_name || client?.email} și toate cererile sale? Această acțiune nu poate fi anulată.`}
        confirmText="Da, Șterge Membrul"
        cancelText="Anulează"
      />
    </div>
  )
}