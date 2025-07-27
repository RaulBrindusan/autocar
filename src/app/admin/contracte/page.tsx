'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { ContractComponent } from '@/components/admin/ContractComponent'
import PrestariServContract from '@/app/contracte/prestariserv'
import { ContractModal } from '@/components/admin/ContractModal'
import DigitalSignature from '@/components/ui/DigitalSignature'
import { generatePDFFromHTML } from '@/lib/pdf-utils'
import { createClient } from '@/lib/supabase/client'
import { Eye, Download, Plus, FileText, Trash2, Edit, PenTool, Send } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface Contract {
  id: string
  name: string
  type: string
  description: string
  createdAt: string
  status: 'draft' | 'semnat' | 'trimis_la_client' | 'semnat_de_client' | 'archived' | 'cancelled'
}

interface DatabaseContract {
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
  
  // Signature fields
  prestator_signature?: string
  prestator_signed_at?: string
  prestator_signed_by?: string
  client_signature?: string
  client_signed_at?: string
  client_signed_by?: string
  
  // Additional contract metadata
  contract_type: 'servicii' | 'vanzare' | 'cumparare'
  status: 'draft' | 'semnat' | 'trimis_la_client' | 'semnat_de_client' | 'archived' | 'cancelled'
  
  // Timestamps
  created_at: string
  updated_at: string
}

// Mock contract data - we'll replace this with real data later
const mockContracts: Contract[] = [
  {
    id: '1',
    name: 'Contract de Prestări Servicii',
    type: 'Servicii Licitație',
    description: 'Contract standard pentru servicii de licitație auto pe platforma OpenLane',
    createdAt: '2025-01-26',
    status: 'draft'
  }
]

export default function ContractePage() {
  const [contracts] = useState<Contract[]>(mockContracts)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [selectedDatabaseContract, setSelectedDatabaseContract] = useState<DatabaseContract | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContract, setEditingContract] = useState<DatabaseContract | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [databaseContracts, setDatabaseContracts] = useState<DatabaseContract[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [signingContract, setSigningContract] = useState<DatabaseContract | null>(null)
  const [isSignatureSaving, setIsSignatureSaving] = useState(false)
  const [isSendingToClient, setIsSendingToClient] = useState(false)
  const [toast, setToast] = useState<{type: 'success' | 'error', message: string} | null>(null)
  const contractRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchDatabaseContracts()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const fetchDatabaseContracts = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('contracte')
        .select('*')
        .order('contract_number', { ascending: false })
      
      if (error) {
        console.error('Error fetching contracts:', error)
        console.error('Error details:', error.message, error.details, error.hint)
        return
      }
      
      setDatabaseContracts(data || [])
    } catch (error) {
      console.error('Error fetching contracts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignContract = (contract: DatabaseContract) => {
    setSigningContract(contract)
    setShowSignatureModal(true)
  }

  const handleSaveSignature = async (signature: string) => {
    if (!signingContract) return

    try {
      setIsSignatureSaving(true)
      
      const { data: userData } = await supabase.auth.getUser()
      
      const { error } = await supabase
        .from('contracte')
        .update({
          prestator_signature: signature,
          prestator_signed_at: new Date().toISOString(),
          prestator_signed_by: userData.user?.id,
          status: 'semnat'
        })
        .eq('id', signingContract.id)
      
      if (error) throw error
      
      // Refresh contracts list
      await fetchDatabaseContracts()
      
      // Update selected contract if it's the one being signed
      if (selectedDatabaseContract?.id === signingContract.id) {
        const updatedContract = databaseContracts.find(c => c.id === signingContract.id)
        if (updatedContract) {
          setSelectedDatabaseContract({
            ...updatedContract,
            prestator_signature: signature,
            prestator_signed_at: new Date().toISOString(),
            prestator_signed_by: userData.user?.id,
            status: 'semnat'
          })
        }
      }
      
      setShowSignatureModal(false)
      setSigningContract(null)
    } catch (error) {
      console.error('Error saving signature:', error)
      alert('Eroare la salvarea semnăturii')
    } finally {
      setIsSignatureSaving(false)
    }
  }

  const handleCancelSignature = () => {
    setShowSignatureModal(false)
    setSigningContract(null)
  }

  const handleSendToClient = async (contract: DatabaseContract) => {
    if (!confirm(`Ești sigur că vrei să trimiți contractul #${contract.contract_number} la clientul ${contract.nume_prenume}?`)) {
      return
    }

    try {
      setIsSendingToClient(true)
      
      const { error } = await supabase
        .from('contracte')
        .update({
          status: 'trimis_la_client'
        })
        .eq('id', contract.id)
      
      if (error) throw error
      
      // Refresh contracts list
      await fetchDatabaseContracts()
      
      // Update selected contract if it's the one being sent
      if (selectedDatabaseContract?.id === contract.id) {
        setSelectedDatabaseContract({
          ...selectedDatabaseContract,
          status: 'trimis_la_client'
        })
      }
      
      // Show success toast
      setToast({
        type: 'success',
        message: `Contractul #${contract.contract_number} a fost trimis cu succes la ${contract.nume_prenume}!`
      })
    } catch (error) {
      console.error('Error sending contract to client:', error)
      setToast({
        type: 'error',
        message: 'Eroare la trimiterea contractului. Încercați din nou.'
      })
    } finally {
      setIsSendingToClient(false)
    }
  }

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract)
    setSelectedDatabaseContract(null)
  }

  const handleViewDatabaseContract = (contract: DatabaseContract) => {
    setSelectedDatabaseContract(contract)
    setSelectedContract(null)
  }

  const handleDeleteContract = async (contractId: string) => {
    if (!confirm('Ești sigur că vrei să ștergi acest contract? Această acțiune nu poate fi anulată.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('contracte')
        .delete()
        .eq('id', contractId)
      
      if (error) throw error
      
      await fetchDatabaseContracts()
      if (selectedDatabaseContract?.id === contractId) {
        setSelectedDatabaseContract(null)
      }
    } catch (error) {
      console.error('Error deleting contract:', error)
      alert('Eroare la ștergerea contractului')
    }
  }

  const handleContractCreated = () => {
    fetchDatabaseContracts()
  }

  const handleCreateNewContract = () => {
    setModalMode('create')
    setEditingContract(null)
    setIsModalOpen(true)
  }

  const handleEditContract = (contract: DatabaseContract) => {
    setModalMode('edit')
    setEditingContract(contract)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingContract(null)
    setModalMode('create')
  }

  const getContractTypeName = (type: string) => {
    switch (type) {
      case 'servicii': return 'Prestări Servicii'
      case 'vanzare': return 'Vânzare'
      case 'cumparare': return 'Cumpărare'
      default: return type
    }
  }

  const convertDatabaseContractToTemplate = (contract: DatabaseContract) => {
    return {
      nr: contract.nr || contract.contract_number.toString(),
      data: new Date(contract.data).toLocaleDateString('ro-RO'),
      nume_prenume: contract.nume_prenume,
      localitatea: contract.localitatea,
      strada: contract.strada,
      nr_strada: contract.nr_strada,
      bl: contract.bl,
      scara: contract.scara,
      etaj: contract.etaj,
      apartament: contract.apartament,
      judet: contract.judet,
      ci_seria: contract.ci_seria,
      ci_nr: contract.ci_nr,
      cnp: contract.cnp,
      spclep: contract.spclep,
      ci_data: new Date(contract.ci_data).toLocaleDateString('ro-RO'),
      suma_licitatie: contract.suma_licitatie.toLocaleString() + ' EUR',
      email: contract.email,
      prestator_signature: contract.prestator_signature,
      prestator_signed_at: contract.prestator_signed_at,
      prestator_signed_by: contract.prestator_signed_by,
      client_signature: contract.client_signature,
      client_signed_at: contract.client_signed_at,
      client_signed_by: contract.client_signed_by
    }
  }

  const handleDownloadPDF = async (contract: Contract | DatabaseContract) => {
    if (contractRef.current) {
      // Get the HTML content of the contract
      const contractHTML = contractRef.current.innerHTML
      
      // Generate filename based on contract type
      let filename = ''
      if ('name' in contract) {
        // Template contract
        filename = `${contract.name.replace(/\s+/g, '_')}.pdf`
      } else {
        // Database contract
        filename = `Contract_${contract.contract_number}_${contract.nume_prenume.replace(/\s+/g, '_')}.pdf`
      }
      
      // Generate PDF using jsPDF and html2canvas
      await generatePDFFromHTML(contractHTML, filename)
    } else {
      // If no contract is currently displayed, show an alert
      alert('Vă rugăm să deschideți mai întâi contractul pentru previzualizare.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'semnat':
        return 'bg-blue-100 text-blue-800'
      case 'trimis_la_client':
        return 'bg-indigo-100 text-indigo-800'
      case 'semnat_de_client':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Draft'
      case 'semnat':
        return 'Semnat'
      case 'trimis_la_client':
        return 'Trimis la Client'
      case 'semnat_de_client':
        return 'Semnat de Client'
      case 'cancelled':
        return 'Anulat'
      case 'archived':
        return 'Arhivat'
      default:
        return status
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Contracte</h1>
            <p className="text-black">Gestionează șabloanele de contracte și documentele</p>
          </div>
          <Button 
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-sm sm:text-base"
            onClick={handleCreateNewContract}
          >
            <Plus className="h-4 w-4 flex-shrink-0" />
            <span className="whitespace-nowrap">Contract Nou</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((contract) => (
            <Card key={contract.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{contract.name}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                    {getStatusLabel(contract.status)}
                  </span>
                </div>
                <CardDescription>{contract.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{contract.description}</p>
                <div className="text-xs text-gray-500 mb-4">
                  Creat: {new Date(contract.createdAt).toLocaleDateString('ro-RO')}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewContract(contract)}
                    className="flex items-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Vizualizează</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadPDF(contract)}
                    className="flex items-center space-x-1"
                  >
                    <Download className="h-4 w-4" />
                    <span>PDF</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contract Viewer Modal/Section - Template Contract */}
        {selectedContract && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Previzualizare: {selectedContract.name}</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadPDF(selectedContract)}
                      className="flex items-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Descarcă PDF</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedContract(null)}
                    >
                      Închide
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="max-h-[600px] overflow-y-auto" ref={contractRef}>
                    <ContractComponent mode="html" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contract Viewer Modal/Section - Database Contract */}
        {selectedDatabaseContract && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Contract #{selectedDatabaseContract.contract_number} - {selectedDatabaseContract.nume_prenume}</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    {selectedDatabaseContract.prestator_signature ? (
                      <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                        <span>✓ Semnat de Prestator</span>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => handleSignContract(selectedDatabaseContract)}
                        className="flex items-center space-x-1"
                      >
                        <PenTool className="h-4 w-4" />
                        <span>Semnează Contract</span>
                      </Button>
                    )}
                    {selectedDatabaseContract.client_signature ? (
                      <div className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                        <span>✓ Semnat de Client</span>
                      </div>
                    ) : selectedDatabaseContract.status === 'trimis_la_client' ? (
                      <div className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm">
                        <span>⏳ Așteptare Semnătură Client</span>
                      </div>
                    ) : null}
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadPDF(selectedDatabaseContract)}
                      className="flex items-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Descarcă PDF</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedDatabaseContract(null)}
                    >
                      Închide
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="max-h-[600px] overflow-y-auto" ref={contractRef}>
                    <PrestariServContract data={convertDatabaseContractToTemplate(selectedDatabaseContract)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Database Contracts Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-black">Contracte Create</h2>
            <span className="text-sm text-gray-600">
              {databaseContracts.length} contract{databaseContracts.length !== 1 ? 'e' : ''}
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-black">Se încarcă contractele...</div>
            </div>
          ) : databaseContracts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Niciun contract creat</h3>
                <p className="text-gray-600 mb-4">
                  Începe prin a crea primul contract folosind butonul "Contract Nou" de mai sus.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {databaseContracts.map((contract) => (
                <Card key={contract.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        Contract #{contract.contract_number}
                      </CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                        {getStatusLabel(contract.status)}
                      </span>
                    </div>
                    <CardDescription>
                      {getContractTypeName(contract.contract_type)} - {contract.nume_prenume}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p><strong>Client:</strong> {contract.nume_prenume}</p>
                      <p><strong>Email:</strong> {contract.email}</p>
                      <p><strong>Valoare:</strong> {contract.suma_licitatie.toLocaleString()} EUR</p>
                      <p><strong>Data:</strong> {new Date(contract.data).toLocaleDateString('ro-RO')}</p>
                      <p><strong>Localitatea:</strong> {contract.localitatea}, {contract.judet}</p>
                      {contract.prestator_signature && (
                        <p className="text-green-600"><strong>✓ Prestator:</strong> Semnat</p>
                      )}
                      {contract.client_signature && (
                        <p className="text-blue-600"><strong>✓ Client:</strong> Semnat pe {new Date(contract.client_signed_at!).toLocaleDateString('ro-RO')}</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mb-4">
                      Creat: {new Date(contract.created_at).toLocaleDateString('ro-RO')}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                        onClick={() => handleViewDatabaseContract(contract)}
                      >
                        <Eye className="h-4 w-4" />
                        <span>Vizualizează</span>
                      </Button>
                      {contract.status === 'semnat' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                          onClick={() => handleSendToClient(contract)}
                          disabled={isSendingToClient}
                        >
                          <Send className="h-4 w-4" />
                          <span>{isSendingToClient ? 'Se trimite...' : 'Trimite la Client'}</span>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                        onClick={() => handleEditContract(contract)}
                      >
                        <Edit className="h-4 w-4" />
                        <span>Editează</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                        onClick={() => handleDownloadPDF(contract)}
                      >
                        <Download className="h-4 w-4" />
                        <span>PDF</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteContract(contract.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Șterge</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Contract Creation/Edit Modal */}
        <ContractModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onContractCreated={handleContractCreated}
          editingContract={editingContract}
          mode={modalMode}
        />

        {/* Digital Signature Modal */}
        {showSignatureModal && signingContract && (
          <DigitalSignature
            onSave={handleSaveSignature}
            onCancel={handleCancelSignature}
            initialSignature={signingContract.prestator_signature}
            isLoading={isSignatureSaving}
          />
        )}

        {/* Enhanced Toast Notification */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out ${
            toast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}>
            <div className={`rounded-xl shadow-2xl border-l-4 overflow-hidden ${
              toast.type === 'success' 
                ? 'bg-white border-l-green-500' 
                : 'bg-white border-l-red-500'
            }`}>
              <div className="p-4">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    toast.type === 'success' 
                      ? 'bg-green-100' 
                      : 'bg-red-100'
                  }`}>
                    {toast.type === 'success' ? (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-sm font-semibold ${
                          toast.type === 'success' ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {toast.type === 'success' ? 'Contract Trimis cu Succes!' : 'Eroare'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {toast.message}
                        </p>
                      </div>
                      <button
                        onClick={() => setToast(null)}
                        className="ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Progress bar for auto-dismiss */}
              <div className="h-1 bg-gray-100">
                <div 
                  className={`h-full transition-all duration-5000 ease-linear ${
                    toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{
                    animation: 'shrink 5s linear forwards'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Add CSS animation for progress bar */}
        <style jsx>{`
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>
    </AdminLayout>
  )
}