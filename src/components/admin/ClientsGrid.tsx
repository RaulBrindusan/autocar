'use client'

import { useState } from 'react'
import { ClientModal } from '@/components/admin/ClientModal'
import { 
  Users, 
  Phone, 
  Mail,
  Calendar,
  Car,
  Plus,
  UserCheck,
  User
} from "lucide-react"
import { Button } from "@/components/ui/Button"

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

interface ClientsGridProps {
  clients: Client[]
}

export function ClientsGrid({ clients }: ClientsGridProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'create'>('view')

  const handleClientClick = (client: Client) => {
    setSelectedClient(client)
    setModalMode('view')
    setIsModalOpen(true)
  }

  const handleAddClient = () => {
    setSelectedClient(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedClient(null)
  }

  const handleClientUpdated = () => {
    // In a real app, you'd refresh the data here
    // For now, we'll just close the modal and the parent will need to refresh
    window.location.reload()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string | null) => {
    if (!status) return 'bg-gray-100 text-gray-800'
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'quoted': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string | null) => {
    if (!status) return 'Necunoscut'
    switch (status) {
      case 'pending': return 'În așteptare'
      case 'in_progress': return 'În procesare'
      case 'quoted': return 'Ofertat'
      case 'completed': return 'Finalizat'
      case 'cancelled': return 'Anulat'
      default: return status
    }
  }

  const registeredClientsCount = clients.filter(c => c.user_id).length
  const guestClientsCount = clients.filter(c => !c.user_id).length
  const totalRequests = clients.reduce((sum, c) => sum + c.total_requests, 0)

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clienti</h1>
          <p className="text-gray-600 mt-2">
            Gestionează toți clienții și cererile lor de mașini
          </p>
        </div>
        <Button onClick={handleAddClient} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Adaugă Client
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clienti</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Înregistrați</p>
              <p className="text-2xl font-bold text-green-600">{registeredClientsCount}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Oaspeți</p>
              <p className="text-2xl font-bold text-orange-600">{guestClientsCount}</p>
            </div>
            <User className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cereri</p>
              <p className="text-2xl font-bold text-purple-600">{totalRequests}</p>
            </div>
            <Car className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Toți Clienții</h2>
        </div>
        
        <div className="overflow-x-auto">
          <div className="space-y-4 p-6">
            {clients?.map((client) => (
              <div 
                key={client.id} 
                className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleClientClick(client)}
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Client Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-lg">
                          {(client.contact_name || client.contact_email)?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          {client.contact_name || 'Nume nedefinit'}
                          {client.user_id && (
                            <span title="Utilizator înregistrat">
                              <UserCheck className="h-4 w-4 ml-2 text-green-600" />
                            </span>
                          )}
                        </h3>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            {client.contact_email}
                          </div>
                          {client.contact_phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              {client.contact_phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Latest Request */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Ultima Cerere</h4>
                    {client.latest_request_brand ? (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          {client.latest_request_brand} {client.latest_request_model} {client.latest_request_year}
                        </p>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(client.latest_request_date)}
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.latest_request_status)}`}>
                          {getStatusText(client.latest_request_status)}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Fără cereri</p>
                    )}
                  </div>

                  {/* Stats */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Statistici</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Car className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-600">{client.total_requests} cereri</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-600">
                          Client din {formatDate(client.latest_request_date)}
                        </span>
                      </div>
                      {client.user_id ? (
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          Cont înregistrat
                        </div>
                      ) : (
                        <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                          Client oaspete
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nu există clienți</p>
                <Button onClick={handleAddClient} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Adaugă primul client
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        client={selectedClient}
        mode={modalMode}
        onClientUpdated={handleClientUpdated}
      />
    </>
  )
}