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
import { Eye, Download, Plus, FileText, Trash2, Edit, PenTool } from 'lucide-react'
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
  const contractRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchDatabaseContracts()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDatabaseContracts = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('contracte')
        .select('*')
        .order('contract_number', { ascending: false })
      
      if (error) {
        console.error('Error fetching contracts:', error)
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
      prestator_signed_by: contract.prestator_signed_by
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
            className="flex items-center space-x-2"
            onClick={handleCreateNewContract}
          >
            <Plus className="h-4 w-4" />
            <span>Contract Nou</span>
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
                        <span>✓ Semnat Digital</span>
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
                    </div>
                    <div className="text-xs text-gray-500 mb-4">
                      Creat: {new Date(contract.created_at).toLocaleDateString('ro-RO')}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                        onClick={() => handleViewDatabaseContract(contract)}
                      >
                        <Eye className="h-4 w-4" />
                        <span>Vizualizează</span>
                      </Button>
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
      </div>
    </AdminLayout>
  )
}