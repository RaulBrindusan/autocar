'use client'

import { useState } from 'react'
import { ClientRequestModal } from '@/components/admin/ClientRequestModal'
import { 
  UserCheck, 
  Car, 
  Phone, 
  Mail,
  Calendar,
  Fuel,
  Cog,
  Gauge,
  Euro,
  User,
  FileText
} from "lucide-react"

interface MemberCarRequest {
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
  user_id: string
}

interface MemberRequestsGridProps {
  memberRequests: MemberCarRequest[]
}

export function MemberRequestsGrid({ memberRequests }: MemberRequestsGridProps) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRequestClick = (requestId: string) => {
    setSelectedRequestId(requestId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRequestId(null)
  }

  const handleRequestUpdated = () => {
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

  const getFuelTypeText = (fuelType?: string) => {
    const fuelMap: { [key: string]: string } = {
      'benzina': 'Benzină',
      'motorina': 'Motorină', 
      'hybrid': 'Hibrid',
      'electric': 'Electric',
      'gpl': 'GPL',
      'gasoline': 'Benzină',
      'diesel': 'Motorină',
      'other': 'Altul'
    }
    return fuelType ? fuelMap[fuelType] || fuelType : 'Nu specificat'
  }

  const getTransmissionText = (transmission?: string) => {
    const transMap: { [key: string]: string } = {
      'manuala': 'Manuală',
      'automata': 'Automată',
      'manual': 'Manuală',
      'automatic': 'Automată',
      'cvt': 'CVT',
      'semiautomata': 'Semiautomată',
      'other': 'Altul'
    }
    return transmission ? transMap[transmission] || transmission : 'Nu specificat'
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <UserCheck className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Cereri Membri</h1>
        </div>
        <p className="text-gray-600">
          Gestionează cererile de mașini primite de la membrii înregistrați
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cereri</p>
              <p className="text-2xl font-bold text-gray-900">{memberRequests?.length || 0}</p>
            </div>
            <UserCheck className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">În așteptare</p>
              <p className="text-2xl font-bold text-yellow-600">
                {memberRequests?.filter(r => r.status === 'pending').length || 0}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">În progres</p>
              <p className="text-2xl font-bold text-blue-600">
                {memberRequests?.filter(r => r.status === 'reviewing' || r.status === 'sourcing' || r.status === 'found_options' || r.status === 'negotiating' || r.status === 'approved' || r.status === 'purchasing' || r.status === 'shipping').length || 0}
              </p>
            </div>
            <Car className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completate</p>
              <p className="text-2xl font-bold text-green-600">
                {memberRequests?.filter(r => r.status === 'completed').length || 0}
              </p>
            </div>
            <Euro className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Lista Cereri Membri</h2>
        </div>
        
        <div className="overflow-x-auto">
          {memberRequests && memberRequests.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {memberRequests.map((request) => (
                <div 
                  key={request.id} 
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleRequestClick(request.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <Car className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {request.brand} {request.model} {request.year && `(${request.year})`}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Contact */}
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          <span>{request.contact_name}</span>
                        </div>
                        
                        {/* Budget */}
                        <div className="flex items-center text-sm text-gray-600">
                          <Euro className="h-4 w-4 mr-2" />
                          <span>{request.max_budget?.toLocaleString()}</span>
                        </div>
                        
                        {/* Fuel Type */}
                        {request.fuel_type && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Fuel className="h-4 w-4 mr-2" />
                            <span>{getFuelTypeText(request.fuel_type)}</span>
                          </div>
                        )}
                        
                        {/* Date */}
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(request.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <UserCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nu există cereri de membri</h3>
              <p className="text-gray-500">
                Cererile de mașini de la membrii înregistrați vor apărea aici.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <ClientRequestModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        requestId={selectedRequestId}
        onRequestUpdated={handleRequestUpdated}
      />
    </>
  )
}