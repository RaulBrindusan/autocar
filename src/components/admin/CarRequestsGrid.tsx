'use client'

import { useState } from 'react'
import { CarRequestModal } from '@/components/admin/CarRequestModal'
import { 
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
}

interface CarRequestsGridProps {
  carRequests: CarRequest[]
}

export function CarRequestsGrid({ carRequests }: CarRequestsGridProps) {
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

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Cereri Mașini
        </h1>
        <p className="text-gray-600 mt-2">
          Gestionează toate cererile de import mașini
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cereri</p>
              <p className="text-2xl font-bold text-gray-900">{carRequests?.length || 0}</p>
            </div>
            <Car className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">În așteptare</p>
              <p className="text-2xl font-bold text-yellow-600">
                {carRequests?.filter(r => r.status === 'pending').length || 0}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">În procesare</p>
              <p className="text-2xl font-bold text-blue-600">
                {carRequests?.filter(r => r.status === 'in_progress').length || 0}
              </p>
            </div>
            <Cog className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Finalizate</p>
              <p className="text-2xl font-bold text-green-600">
                {carRequests?.filter(r => r.status === 'completed').length || 0}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Car Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Toate Cererile</h2>
        </div>
        
        <div className="overflow-x-auto">
          <div className="space-y-4 p-6">
            {carRequests?.map((request) => (
              <div 
                key={request.id} 
                className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleRequestClick(request.id)}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Car Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Car className="h-5 w-5 text-blue-600 mr-2" />
                      {request.brand} {request.model} {request.year}
                    </h3>
                    <div className="space-y-2 text-sm">
                      {request.fuel_type && (
                        <div className="flex items-center text-gray-600">
                          <Fuel className="h-4 w-4 mr-2" />
                          Combustibil: {request.fuel_type}
                        </div>
                      )}
                      {request.transmission && (
                        <div className="flex items-center text-gray-600">
                          <Cog className="h-4 w-4 mr-2" />
                          Transmisie: {request.transmission}
                        </div>
                      )}
                      {request.mileage_max && (
                        <div className="flex items-center text-gray-600">
                          <Gauge className="h-4 w-4 mr-2" />
                          Kilometraj max: {request.mileage_max.toLocaleString()} km
                        </div>
                      )}
                      <div className="flex items-center text-gray-600">
                        <Euro className="h-4 w-4 mr-2" />
                        Buget: €{request.max_budget?.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <User className="h-4 w-4 text-gray-600 mr-2" />
                      Contact Client
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        {request.user_full_name || request.contact_name}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {request.user_email || request.contact_email}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {request.contact_phone}
                      </div>
                    </div>
                    
                    {request.additional_requirements && (
                      <div className="mt-3">
                        <div className="flex items-start text-gray-600">
                          <FileText className="h-4 w-4 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Note:</p>
                            <p className="text-sm">{request.additional_requirements}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status & Features */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'quoted' ? 'bg-purple-100 text-purple-800' :
                        request.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status === 'pending' ? 'În așteptare' :
                         request.status === 'in_progress' ? 'În procesare' :
                         request.status === 'quoted' ? 'Ofertat' :
                         request.status === 'completed' ? 'Finalizat' :
                         request.status}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <p>Creat: {new Date(request.created_at).toLocaleDateString('ro-RO')}</p>
                      <p>Actualizat: {new Date(request.updated_at).toLocaleDateString('ro-RO')}</p>
                    </div>

                    {request.custom_features && request.custom_features.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Caracteristici dorite:</p>
                        <div className="flex flex-wrap gap-1">
                          {request.custom_features.slice(0, 3).map((feature, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                              {feature}
                            </span>
                          ))}
                          {request.custom_features.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                              +{request.custom_features.length - 3} mai multe
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center py-12">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nu există cereri de mașini</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <CarRequestModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        requestId={selectedRequestId}
        onRequestUpdated={handleRequestUpdated}
      />
    </>
  )
}