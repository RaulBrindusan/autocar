'use client'

import { useState, useEffect } from 'react'
import { X, FileText, User, Phone, Mail, CreditCard, Calendar, Save, Settings } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { UserSearchDropdown } from '@/components/ui/UserSearchDropdown'
import { createClient } from '@/lib/supabase/client'
import { z } from 'zod'

interface Contract {
  id: string
  contract_number: number
  user_id?: string
  
  // Contract identification
  nr?: string
  data: string
  
  // Personal information
  nume_prenume: string
  localitatea: string
  strada: string
  nr_strada: string
  bl?: string
  scara?: string
  etaj?: string
  apartament?: string
  judet: string
  
  // ID document information
  ci_seria: string
  ci_nr: string
  cnp: string
  spclep: string
  ci_data: string
  
  // Contract details
  suma_licitatie: number
  email: string
  
  // Additional contract metadata
  contract_type: 'servicii' | 'vanzare' | 'cumparare'
  status: 'draft' | 'semnat' | 'trimis_la_client' | 'semnat_de_client' | 'archived' | 'cancelled'
  
  // Timestamps
  created_at: string
  updated_at: string
}

interface ContractModalProps {
  isOpen: boolean
  onClose: () => void
  onContractCreated: () => void
  editingContract?: Contract | null
  mode?: 'create' | 'edit'
}

// Validation schema for prestari servicii contract
const contractSchema = z.object({
  // Contract identification
  nr: z.string().optional(),
  data: z.string().min(1, 'Data contractului este obligatorie'),
  
  // Personal information
  nume_prenume: z.string().min(1, 'Numele și prenumele sunt obligatorii'),
  localitatea: z.string().min(1, 'Localitatea este obligatorie'),
  strada: z.string().min(1, 'Strada este obligatorie'),
  nr_strada: z.string().min(1, 'Numărul străzii este obligatoriu'),
  bl: z.string().optional(),
  scara: z.string().optional(),
  etaj: z.string().optional(),
  apartament: z.string().optional(),
  judet: z.string().min(1, 'Județul este obligatoriu'),
  
  // ID document information
  ci_seria: z.string().min(1, 'Seria CI este obligatorie'),
  ci_nr: z.string().min(1, 'Numărul CI este obligatoriu'),
  cnp: z.string().min(13, 'CNP trebuie să aibă 13 cifre').max(13, 'CNP trebuie să aibă 13 cifre'),
  spclep: z.string().min(1, 'SPCLEP este obligatoriu'),
  ci_data: z.string().min(1, 'Data eliberării CI este obligatorie'),
  
  // Contract details
  suma_licitatie: z.number().min(0.01, 'Suma licitației trebuie să fie mai mare de 0'),
  email: z.string().email('Email invalid'),
  
  // Additional metadata
  contract_type: z.enum(['servicii', 'vanzare', 'cumparare']),
  status: z.enum(['draft', 'semnat', 'trimis_la_client', 'semnat_de_client', 'archived', 'cancelled'])
})

type ContractFormData = z.infer<typeof contractSchema>

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: string
}

export function ContractModal({ isOpen, onClose, onContractCreated, editingContract, mode = 'create' }: ContractModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  
  const [formData, setFormData] = useState<ContractFormData>({
    // Contract identification
    nr: '',
    data: new Date().toISOString().split('T')[0],
    
    // Personal information
    nume_prenume: '',
    localitatea: '',
    strada: '',
    nr_strada: '',
    bl: '',
    scara: '',
    etaj: '',
    apartament: '',
    judet: '',
    
    // ID document information
    ci_seria: '',
    ci_nr: '',
    cnp: '',
    spclep: '',
    ci_data: new Date().toISOString().split('T')[0],
    
    // Contract details
    suma_licitatie: 0,
    email: '',
    
    // Additional metadata
    contract_type: 'servicii',
    status: 'draft'
  })

  const supabase = createClient()

  // Handle user selection from dropdown
  const handleUserSelect = async (user: UserProfile) => {
    setSelectedUser(user)
    
    // Set basic user data
    setFormData(prev => ({
      ...prev,
      nume_prenume: user.full_name || '',
      email: user.email,
    }))

    // Fetch user and document data for this user
    try {
      const response = await fetch(`/api/admin/user-documents?userId=${user.id}`)
      if (response.ok) {
        const result = await response.json()
        
        if (result.success) {
          const { userData, documentData } = result
          
          // Populate form with user data from users table and document data from documents table
          setFormData(prev => ({
            ...prev,
            // User data from users table
            nume_prenume: userData.full_name || user.full_name || '',
            email: userData.email || user.email,
            // Address data from documents table
            localitatea: documentData?.localitatea || '',
            judetul: documentData?.judetul || '',
            strada: documentData?.strada || '',
            nr_strada: documentData?.nr_strada || '',
            bl: documentData?.bl || '',
            scara: documentData?.sc || '',
            etaj: documentData?.etaj || '',
            apartament: documentData?.apartment || '',
            // ID document data from documents table
            ci_seria: documentData?.serie || '',
            ci_nr: documentData?.nr || '',
            cnp: documentData?.cnp || '',
            spclep: documentData?.slclep || '',
            ci_data: documentData?.valabilitate || prev.ci_data,
          }))
        }
      } else {
        console.warn('Failed to fetch document data for user:', user.id)
      }
    } catch (error) {
      console.error('Error fetching document data:', error)
    }
  }

  // Handle manual input change for nume_prenume
  const handleNumePretumeChange = (value: string) => {
    setFormData(prev => ({ ...prev, nume_prenume: value }))
    // Clear selected user if manually typing
    if (selectedUser && value !== selectedUser.full_name) {
      setSelectedUser(null)
    }
  }

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && editingContract) {
        setFormData({
          nr: editingContract.nr || '',
          data: editingContract.data,
          nume_prenume: editingContract.nume_prenume,
          localitatea: editingContract.localitatea,
          strada: editingContract.strada,
          nr_strada: editingContract.nr_strada,
          bl: editingContract.bl || '',
          scara: editingContract.scara || '',
          etaj: editingContract.etaj || '',
          apartament: editingContract.apartament || '',
          judet: editingContract.judet,
          ci_seria: editingContract.ci_seria,
          ci_nr: editingContract.ci_nr,
          cnp: editingContract.cnp,
          spclep: editingContract.spclep,
          ci_data: editingContract.ci_data,
          suma_licitatie: editingContract.suma_licitatie,
          email: editingContract.email,
          contract_type: editingContract.contract_type,
          status: editingContract.status
        })
      } else {
        resetForm()
        setSelectedUser(null)
      }
    }
  }, [isOpen, mode, editingContract])

  const resetForm = () => {
    setFormData({
      // Contract identification
      nr: '',
      data: new Date().toISOString().split('T')[0],
      
      // Personal information
      nume_prenume: '',
      localitatea: '',
      strada: '',
      nr_strada: '',
      bl: '',
      scara: '',
      etaj: '',
      apartament: '',
      judet: '',
      
      // ID document information
      ci_seria: '',
      ci_nr: '',
      cnp: '',
      spclep: '',
      ci_data: new Date().toISOString().split('T')[0],
      
      // Contract details
      suma_licitatie: 0,
      email: '',
      
      // Additional metadata
      contract_type: 'servicii',
      status: 'draft'
    })
    setError(null)
    setValidationErrors({})
    setSelectedUser(null)
  }

  const handleCreateContract = async () => {
    setIsLoading(true)
    setError(null)
    setValidationErrors({})
    
    try {
      // Validate form data
      const result = contractSchema.safeParse(formData)
      
      if (!result.success) {
        const errors: Record<string, string> = {}
        result.error.issues.forEach((error) => {
          if (error.path.length > 0) {
            errors[error.path[0] as string] = error.message
          }
        })
        setValidationErrors(errors)
        return
      }

      const contractData = {
        ...result.data,
        nr: result.data.nr || null,
        bl: result.data.bl || null,
        scara: result.data.scara || null,
        etaj: result.data.etaj || null,
        apartament: result.data.apartament || null,
        // Include user_id if a user was selected from dropdown
        ...(selectedUser && { user_id: selectedUser.id })
      }

      if (mode === 'edit' && editingContract) {
        // Update existing contract
        const { error } = await supabase
          .from('contracte')
          .update(contractData)
          .eq('id', editingContract.id)
        
        if (error) throw error
      } else {
        // Create new contract
        const { error } = await supabase
          .from('contracte')
          .insert([contractData])
        
        if (error) throw error
      }
      
      onContractCreated()
      onClose()
    } catch (err) {
      console.error('Error saving contract:', err)
      setError(mode === 'edit' ? 'Eroare la actualizarea contractului. Vă rugăm să încercați din nou.' : 'Eroare la crearea contractului. Vă rugăm să încercați din nou.')
    } finally {
      setIsLoading(false)
    }
  }

  const getFieldError = (fieldName: string) => {
    return validationErrors[fieldName]
  }

  const isFormValid = () => {
    const result = contractSchema.safeParse(formData)
    return result.success
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'edit' ? `Editează Contract #${editingContract?.contract_number}` : 'Contract Nou'}
              </h2>
              <p className="text-sm text-gray-600">
                {mode === 'edit' ? 'Modifică datele contractului existent' : 'Completează datele pentru crearea unui contract nou'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleCreateContract}
              disabled={isLoading || !isFormValid()}
              className="flex items-center space-x-1 px-2 sm:px-4 py-2 text-sm sm:text-base"
            >
              <Save className="h-4 w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">
                {mode === 'edit' ? 'Actualizează Contract' : 'Salvează Contract'}
              </span>
            </Button>
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
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Contract Type and Status - First Row */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="h-5 w-5 text-purple-600 mr-2" />
              Configurări Contract
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Tip Contract
                </label>
                <select
                  value={formData.contract_type}
                  onChange={(e) => setFormData({...formData, contract_type: e.target.value as any})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                    getFieldError('contract_type') ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="servicii">Contract de Prestări Servicii</option>
                  <option value="vanzare">Contract de Vânzare</option>
                  <option value="cumparare">Contract de Cumpărare</option>
                </select>
                {getFieldError('contract_type') && (
                  <p className="text-red-600 text-sm mt-1">{getFieldError('contract_type')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Status Contract
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                    getFieldError('status') ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="draft">Draft</option>
                  <option value="semnat">Semnat</option>
                  <option value="trimis_la_client">Trimis la Client</option>
                  <option value="semnat_de_client">Semnat de Client</option>
                  <option value="archived">Arhivat</option>
                  <option value="cancelled">Anulat</option>
                </select>
                {getFieldError('status') && (
                  <p className="text-red-600 text-sm mt-1">{getFieldError('status')}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contract Identification & Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                Informații Personal Client
              </h3>
              <div className="space-y-4">
                {/* Contract Number and Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Nr. Contract
                    </label>
                    <input
                      type="text"
                      value={formData.nr}
                      onChange={(e) => setFormData({...formData, nr: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                        getFieldError('nr') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Auto-generat"
                    />
                    {getFieldError('nr') && (
                      <p className="text-red-600 text-sm mt-1">{getFieldError('nr')}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Data *
                    </label>
                    <input
                      type="date"
                      value={formData.data}
                      onChange={(e) => setFormData({...formData, data: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                        getFieldError('data') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    />
                    {getFieldError('data') && (
                      <p className="text-red-600 text-sm mt-1">{getFieldError('data')}</p>
                    )}
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Selectează Client *
                  </label>
                  <UserSearchDropdown
                    value={formData.nume_prenume}
                    onUserSelect={handleUserSelect}
                    onInputChange={handleNumePretumeChange}
                    placeholder="Caută client sau introdu numele manual..."
                    error={getFieldError('nume_prenume')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                      getFieldError('email') ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="email@exemplu.com"
                    required
                  />
                  {getFieldError('email') && (
                    <p className="text-red-600 text-sm mt-1">{getFieldError('email')}</p>
                  )}
                </div>


                {/* Address Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Localitatea *
                    </label>
                    <input
                      type="text"
                      value={formData.localitatea}
                      onChange={(e) => setFormData({...formData, localitatea: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                        getFieldError('localitatea') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="București"
                      required
                    />
                    {getFieldError('localitatea') && (
                      <p className="text-red-600 text-sm mt-1">{getFieldError('localitatea')}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Județul *
                    </label>
                    <input
                      type="text"
                      value={formData.judet}
                      onChange={(e) => setFormData({...formData, judet: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                        getFieldError('judet') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Ilfov sau Sectorul 1"
                      required
                    />
                    {getFieldError('judet') && (
                      <p className="text-red-600 text-sm mt-1">{getFieldError('judet')}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Strada *
                    </label>
                    <input
                      type="text"
                      value={formData.strada}
                      onChange={(e) => setFormData({...formData, strada: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                        getFieldError('strada') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Calea Victoriei"
                      required
                    />
                    {getFieldError('strada') && (
                      <p className="text-red-600 text-sm mt-1">{getFieldError('strada')}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Nr. Strada *
                    </label>
                    <input
                      type="text"
                      value={formData.nr_strada}
                      onChange={(e) => setFormData({...formData, nr_strada: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                        getFieldError('nr_strada') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="123"
                      required
                    />
                    {getFieldError('nr_strada') && (
                      <p className="text-red-600 text-sm mt-1">{getFieldError('nr_strada')}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Bl.
                    </label>
                    <input
                      type="text"
                      value={formData.bl}
                      onChange={(e) => setFormData({...formData, bl: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                        getFieldError('bl') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="A1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Scara
                    </label>
                    <input
                      type="text"
                      value={formData.scara}
                      onChange={(e) => setFormData({...formData, scara: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                        getFieldError('scara') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Etaj
                    </label>
                    <input
                      type="text"
                      value={formData.etaj}
                      onChange={(e) => setFormData({...formData, etaj: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                        getFieldError('etaj') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Apartament
                    </label>
                    <input
                      type="text"
                      value={formData.apartament}
                      onChange={(e) => setFormData({...formData, apartament: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                        getFieldError('apartament') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="15"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ID Document Information & Contract Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 text-green-600 mr-2" />
                Documente Identitate & Contract
              </h3>
              <div className="space-y-4">
                {/* ID Document Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      CI Seria *
                    </label>
                    <input
                      type="text"
                      value={formData.ci_seria}
                      onChange={(e) => setFormData({...formData, ci_seria: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                        getFieldError('ci_seria') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="IF"
                      required
                    />
                    {getFieldError('ci_seria') && (
                      <p className="text-red-600 text-sm mt-1">{getFieldError('ci_seria')}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      CI Nr *
                    </label>
                    <input
                      type="text"
                      value={formData.ci_nr}
                      onChange={(e) => setFormData({...formData, ci_nr: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                        getFieldError('ci_nr') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="123456"
                      required
                    />
                    {getFieldError('ci_nr') && (
                      <p className="text-red-600 text-sm mt-1">{getFieldError('ci_nr')}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    CNP *
                  </label>
                  <input
                    type="text"
                    value={formData.cnp}
                    onChange={(e) => setFormData({...formData, cnp: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                      getFieldError('cnp') ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="1234567890123"
                    maxLength={13}
                    required
                  />
                  {getFieldError('cnp') && (
                    <p className="text-red-600 text-sm mt-1">{getFieldError('cnp')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    SPCLEP *
                  </label>
                  <input
                    type="text"
                    value={formData.spclep}
                    onChange={(e) => setFormData({...formData, spclep: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                      getFieldError('spclep') ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="SPCLEP Ilfov"
                    required
                  />
                  {getFieldError('spclep') && (
                    <p className="text-red-600 text-sm mt-1">{getFieldError('spclep')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    CI Data *
                  </label>
                  <input
                    type="date"
                    value={formData.ci_data}
                    onChange={(e) => setFormData({...formData, ci_data: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                      getFieldError('ci_data') ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  />
                  {getFieldError('ci_data') && (
                    <p className="text-red-600 text-sm mt-1">{getFieldError('ci_data')}</p>
                  )}
                </div>

                {/* Contract Details */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Suma Licitație (Euro) *
                  </label>
                  <input
                    type="number"
                    value={formData.suma_licitatie}
                    onChange={(e) => setFormData({...formData, suma_licitatie: parseFloat(e.target.value) || 0})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                      getFieldError('suma_licitatie') ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="10000.00"
                    min="0"
                    step="0.01"
                    required
                  />
                  {getFieldError('suma_licitatie') && (
                    <p className="text-red-600 text-sm mt-1">{getFieldError('suma_licitatie')}</p>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}