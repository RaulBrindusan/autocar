'use client'

import { useState, useEffect } from 'react'
import { X, Users, Mail, Phone, Calendar, Car, Euro, Plus, Edit, Save, Trash2, Settings, Fuel, Cog, Gauge } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import Select from 'react-select'

interface Option {
  value: string
  label: string
}

interface Client {
  id: string
  contact_name: string | null
  contact_email: string
  contact_phone: string | null
  user_id: string | null
  user_full_name: string | null
  user_email: string | null
  total_requests: number
  latest_request_date: string
  latest_request_brand: string | null
  latest_request_model: string | null
  latest_request_year: number | null
  latest_request_status: string | null
}

interface ClientDetails {
  client_name: string | null
  client_email: string
  client_phone: string | null
  user_id: string | null
  user_full_name: string | null
  user_email: string | null
  request_id: string
  brand: string
  model: string
  year: number | null
  max_budget: number | null
  status: string
  created_at: string
  updated_at: string
}

interface ClientModalProps {
  isOpen: boolean
  onClose: () => void
  client: Client | null
  mode: 'view' | 'create'
  onClientUpdated: () => void
}

export function ClientModal({ isOpen, onClose, client, mode, onClientUpdated }: ClientModalProps) {
  const [clientDetails, setClientDetails] = useState<ClientDetails[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editClientData, setEditClientData] = useState({
    contact_name: '',
    contact_phone: ''
  })
  
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

  const supabase = createClient()

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
          contact_name: client.contact_name || '',
          contact_phone: client.contact_phone || ''
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
      const { data, error } = await supabase.rpc('admin_get_client_details', { 
        client_email_param: client.contact_email 
      })
      
      if (error) throw error
      
      setClientDetails(data || [])
    } catch (err) {
      console.error('Error fetching client details:', err)
      setError('Failed to load client details')
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
      const { error } = await supabase.rpc('admin_update_client_info', {
        client_email_param: client.contact_email,
        new_contact_name: editClientData.contact_name !== client.contact_name ? editClientData.contact_name : null,
        new_contact_phone: editClientData.contact_phone !== client.contact_phone ? editClientData.contact_phone : null
      })
      
      if (error) throw error
      
      setIsEditing(false)
      await fetchClientDetails()
      onClientUpdated()
    } catch (err) {
      console.error('Error updating client:', err)
      setError('Failed to update client')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClient = async () => {
    if (!client) return
    
    if (!confirm(`Ești sigur că vrei să ștergi clientul ${client.contact_name || client.contact_email} și toate cererile sale? Această acțiune nu poate fi anulată.`)) {
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.rpc('admin_delete_client', {
        client_email_param: client.contact_email
      })
      
      if (error) throw error
      
      onClientUpdated()
      onClose()
    } catch (err) {
      console.error('Error deleting client:', err)
      setError('Failed to delete client')
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
                {mode === 'create' ? 'Adaugă Client Nou' : `Client: ${client?.contact_name || client?.contact_email}`}
              </h2>
              {mode === 'view' && client && (
                <p className="text-sm text-gray-600">
                  {client.total_requests} cereri • Ultima cerere: {formatDate(client.latest_request_date)}
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
                      contact_name: client?.contact_name || '',
                      contact_phone: client?.contact_phone || ''
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

          {mode === 'view' && client && clientDetails.length > 0 && (
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
                        <span className="font-medium text-black">{client.contact_name || 'Nume nedefinit'}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Email</label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-black">{client.contact_email}</span>
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
                        <span className="text-black">{client.contact_phone || 'Nu este specificat'}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4 text-gray-500" />
                    <span className="text-black">{client.total_requests} cereri total</span>
                  </div>
                  {client.user_id && (
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      Utilizator înregistrat
                    </div>
                  )}
                </div>
              </div>

              {/* Latest Request */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Car className="h-5 w-5 text-green-600 mr-2" />
                  Ultima Cerere
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-black">
                      {client.latest_request_brand} {client.latest_request_model} {client.latest_request_year}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.latest_request_status || '')}`}>
                      {getStatusText(client.latest_request_status || '')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-black">{formatDate(client.latest_request_date)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Requests */}
          {mode === 'view' && clientDetails.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Toate Cererile ({clientDetails.length})</h3>
              <div className="space-y-4">
                {clientDetails.map((detail, index) => (
                  <div key={detail.request_id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-black">
                          {detail.brand} {detail.model} {detail.year}
                        </h4>
                        <div className="mt-2 text-sm text-black space-y-1">
                          {detail.max_budget && (
                            <div className="flex items-center">
                              <Euro className="h-4 w-4 mr-1" />
                              Buget: €{detail.max_budget.toLocaleString()}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Creat: {formatDate(detail.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(detail.status)}`}>
                          {getStatusText(detail.status)}
                        </span>
                        <span className="text-xs text-black">
                          #{detail.request_id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}