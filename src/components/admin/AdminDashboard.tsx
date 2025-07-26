'use client'

import { useState } from 'react'
import { CarRequestModal } from '@/components/admin/CarRequestModal'
import { 
  Users, 
  Car, 
  FileText, 
  BarChart3, 
  Calendar,
  TrendingUp,
  Mail,
  Phone
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

interface User {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: string
  created_at: string
  updated_at: string
}

interface AdminDashboardProps {
  totalUsers: number
  totalCarRequests: number
  totalCostEstimates: number
  totalOpenLaneSubmissions: number
  recentUsers: User[]
  recentCarRequests: CarRequest[]
}

export function AdminDashboard({
  totalUsers,
  totalCarRequests,
  totalCostEstimates,
  totalOpenLaneSubmissions,
  recentUsers,
  recentCarRequests
}: AdminDashboardProps) {
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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 md:mt-0 mt-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Gestionează utilizatorii, cererile și statisticile platformei
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Utilizatori</p>
              <p className="text-3xl font-bold text-gray-900">{totalUsers || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cereri Mașini</p>
              <p className="text-3xl font-bold text-gray-900">{totalCarRequests || 0}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Car className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Estimări Costuri</p>
              <p className="text-3xl font-bold text-gray-900">{totalCostEstimates || 0}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">OpenLane Linkuri</p>
              <p className="text-3xl font-bold text-gray-900">{totalOpenLaneSubmissions || 0}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Car Requests */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cereri Recente Mașini</h2>
          <div className="space-y-4">
            {recentCarRequests?.map((request) => (
              <div 
                key={request.id} 
                className="border-b border-gray-100 pb-4 last:border-b-0 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => handleRequestClick(request.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {request.brand} {request.model} {request.year}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Client: {request.user_full_name || request.contact_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Email: {request.user_email || request.contact_email}
                    </p>
                    <p className="text-sm text-gray-500">
                      Buget: €{request.max_budget?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(request.created_at).toLocaleDateString('ro-RO')}
                    </span>
                  </div>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-4">Nu există cereri recente</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Utilizatori ({totalUsers})</h2>
          <div className="space-y-4">
            {recentUsers?.map((user) => (
              <div key={user.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {user.full_name || 'Nume nedefinit'}
                      </h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.phone && (
                        <p className="text-sm text-gray-500">{user.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'Utilizator'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(user.created_at).toLocaleDateString('ro-RO')}
                    </p>
                  </div>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-4">Nu există utilizatori noi</p>
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
    </div>
  )
}