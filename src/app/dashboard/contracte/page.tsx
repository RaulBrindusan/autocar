'use client'

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { FileText, Download, Eye, Clock, CheckCircle, XCircle, X, PenTool } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useState, useEffect } from "react"
import PrestariServContract from '@/app/contracte/prestariserv'
import DigitalSignature from '@/components/ui/DigitalSignature'

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

export default function UserContractePage() {
  const [user, setUser] = useState<any>(null)
  const [contracts, setContracts] = useState<DatabaseContract[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<DatabaseContract | null>(null)
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [isSignatureSaving, setIsSignatureSaving] = useState(false)
  const [toast, setToast] = useState<{type: 'success' | 'error', message: string} | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }
    
    setUser(user)
    await fetchUserContracts(user)
  }

  const fetchUserContracts = async (currentUser: any) => {
    try {
      setIsLoading(true)
      
      // Fetch user's contracts that have been sent to client or signed by client
      // Match by user_id OR email (since contracts can be created with just email)
      
      // Query 1: Contracts linked by user_id
      const { data: contractsByUserId, error: error1 } = await supabase
        .from("contracte")
        .select("*")
        .eq("user_id", currentUser.id)
        .in("status", ["trimis_la_client", "semnat_de_client"])

      // Query 2: Contracts linked by email
      const { data: contractsByEmail, error: error2 } = await supabase
        .from("contracte")
        .select("*")
        .eq("email", currentUser.email)
        .in("status", ["trimis_la_client", "semnat_de_client"])

      // Combine results and remove duplicates
      const combinedContracts = [...(contractsByUserId || []), ...(contractsByEmail || [])]
      const uniqueContracts = combinedContracts.filter((contract, index, self) => 
        index === self.findIndex(c => c.id === contract.id)
      )

      // Sort by creation date
      const data = uniqueContracts.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )

      const error = error1 || error2
      
      if (error) {
        console.error('Error fetching contracts:', error)
      } else {
        setContracts(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignContract = () => {
    setShowSignatureModal(true)
  }

  const handleSaveSignature = async (signature: string) => {
    if (!selectedContract || !user) return

    try {
      setIsSignatureSaving(true)
      
      const { error } = await supabase
        .from('contracte')
        .update({
          client_signature: signature,
          client_signed_at: new Date().toISOString(),
          client_signed_by: user.id,
          status: 'semnat_de_client'
        })
        .eq('id', selectedContract.id)
      
      if (error) throw error
      
      // Refresh contracts list
      await fetchUserContracts(user)
      
      // Update selected contract
      setSelectedContract({
        ...selectedContract,
        client_signature: signature,
        client_signed_at: new Date().toISOString(),
        client_signed_by: user.id,
        status: 'semnat_de_client'
      })
      
      // Show success toast
      setToast({
        type: 'success',
        message: `Contractul #${selectedContract.contract_number} a fost semnat cu succes!`
      })
      
      setShowSignatureModal(false)
    } catch (error) {
      console.error('Error saving signature:', error)
      setToast({
        type: 'error',
        message: 'Eroare la semnarea contractului. Încercați din nou.'
      })
    } finally {
      setIsSignatureSaving(false)
    }
  }

  const handleCancelSignature = () => {
    setShowSignatureModal(false)
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

  if (!user) {
    return <div>Loading...</div>
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-800", icon: Clock, label: "Draft" },
      semnat: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Semnat" },
      trimis_la_client: { color: "bg-blue-100 text-blue-800", icon: Clock, label: "Trimis la Client" },
      semnat_de_client: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Semnat de Client" },
      archived: { color: "bg-gray-100 text-gray-800", icon: XCircle, label: "Arhivat" },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Anulat" },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    )
  }

  const getContractTypeLabel = (type: string) => {
    const types = {
      servicii: "Prestări Servicii",
      vanzare: "Vânzare",
      cumparare: "Cumpărare"
    }
    return types[type as keyof typeof types] || type
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contractele Tale</h1>
          <p className="text-gray-600 mt-2">
            Vezi și gestionează contractele tale cu Automode
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Contracte</p>
                <p className="text-2xl font-bold text-gray-900">{contracts?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">În așteptare</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contracts?.filter(contract => contract.status === 'draft' || contract.status === 'trimis_la_client').length || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Semnate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contracts?.filter(contract => contract.status === 'semnat' || contract.status === 'semnat_de_client').length || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Servicii</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contracts?.filter(contract => contract.contract_type === 'servicii').length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contracts List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-black">Se încarcă contractele...</div>
            </div>
          ) : contracts && contracts.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {contracts.map((contract) => (
                <div key={contract.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Contract #{contract.contract_number}
                        </h3>
                        {getStatusBadge(contract.status)}
                        <span className="text-sm text-gray-500">
                          {getContractTypeLabel(contract.contract_type)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Client:</span> {contract.nume_prenume}
                        </div>
                        <div>
                          <span className="font-medium">Suma:</span> €{contract.suma_licitatie?.toLocaleString() || '0'}
                        </div>
                        <div>
                          <span className="font-medium">Data:</span> {new Date(contract.data).toLocaleDateString('ro-RO')}
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {contract.email}
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-500">
                        Creat pe {new Date(contract.created_at).toLocaleDateString('ro-RO')}
                      </div>
                    </div>
                    
                    <div className="ml-6 flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedContract(contract)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Vezi
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Niciun contract încă
              </h3>
              <p className="text-gray-600 mb-6">
                Contractele tale cu Automode vor apărea aici odată ce sunt create.
              </p>
              <Button variant="outline">
                Contactează-ne pentru un contract
              </Button>
            </div>
          )}
        </div>

        {/* Contract Viewing Modal */}
        {selectedContract && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Contract #{selectedContract.contract_number}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedContract.nume_prenume} - {new Date(selectedContract.data).toLocaleDateString('ro-RO')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedContract.status === 'trimis_la_client' && !selectedContract.client_signature && (
                    <Button
                      onClick={handleSignContract}
                      className="flex items-center space-x-1 bg-green-600 hover:bg-green-700"
                    >
                      <PenTool className="h-4 w-4" />
                      <span>Semnează</span>
                    </Button>
                  )}
                  {selectedContract.client_signature && (
                    <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                      <span>✓ Semnat de Client</span>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setSelectedContract(null)}
                    className="flex items-center space-x-1"
                  >
                    <X className="h-4 w-4" />
                    <span>Închide</span>
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="max-h-[600px] overflow-y-auto">
                    <PrestariServContract data={convertDatabaseContractToTemplate(selectedContract)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Digital Signature Modal */}
        {showSignatureModal && selectedContract && (
          <DigitalSignature
            onSave={handleSaveSignature}
            onCancel={handleCancelSignature}
            initialSignature={selectedContract.client_signature}
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
                          {toast.type === 'success' ? 'Contract Semnat cu Succes!' : 'Eroare'}
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
    </div>
  )
}