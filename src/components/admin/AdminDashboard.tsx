'use client'

import { useState } from 'react'
import { CarRequestModal } from '@/components/admin/CarRequestModal'
import { ClientRequestModal } from '@/components/admin/ClientRequestModal'
import { 
  Users, 
  Car, 
  FileText, 
  BarChart3, 
  Calendar,
  TrendingUp,
  Mail,
  Phone,
  UserCheck
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

interface MemberRequest {
  id: string
  brand: string
  model: string
  year?: number
  max_budget: number
  contact_name: string
  contact_email: string
  contact_phone?: string
  status: string
  created_at: string
}

interface AdminDashboardProps {
  totalUsers: number
  totalCarRequests: number
  totalMemberRequests: number
  totalOpenLaneSubmissions: number
  recentUsers: User[]
  recentCarRequests: CarRequest[]
  recentMemberRequests: MemberRequest[]
}

export function AdminDashboard({
  totalUsers,
  totalCarRequests,
  totalMemberRequests,
  totalOpenLaneSubmissions,
  recentUsers,
  recentCarRequests,
  recentMemberRequests
}: AdminDashboardProps) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [selectedMemberRequestId, setSelectedMemberRequestId] = useState<string | null>(null)
  const [isCarModalOpen, setIsCarModalOpen] = useState(false)
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  
  // Pagination states
  const [currentMemberPage, setCurrentMemberPage] = useState(1)
  const [currentCarPage, setCurrentCarPage] = useState(1)
  const [currentUserPage, setCurrentUserPage] = useState(1)
  const itemsPerPage = 5

  const handleCarRequestClick = (requestId: string) => {
    setSelectedRequestId(requestId)
    setIsCarModalOpen(true)
  }

  const handleMemberRequestClick = (requestId: string) => {
    setSelectedMemberRequestId(requestId)
    setIsClientModalOpen(true)
  }

  const handleCloseCarModal = () => {
    setIsCarModalOpen(false)
    setSelectedRequestId(null)
  }

  const handleCloseClientModal = () => {
    setIsClientModalOpen(false)
    setSelectedMemberRequestId(null)
  }

  const handleRequestUpdated = () => {
    // In a real app, you'd refresh the data here
    // For now, we'll just close the modal and the parent will need to refresh
    window.location.reload()
  }

  // Pagination helpers
  const paginateData = (data: any[], currentPage: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return data?.slice(startIndex, startIndex + itemsPerPage) || []
  }

  const getTotalPages = (data: any[]) => {
    return Math.ceil((data?.length || 0) / itemsPerPage)
  }

  // Paginated data
  const paginatedMemberRequests = paginateData(recentMemberRequests, currentMemberPage)
  const paginatedCarRequests = paginateData(recentCarRequests, currentCarPage)
  const paginatedUsers = paginateData(recentUsers, currentUserPage)

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
              <p className="text-sm font-medium text-gray-600">Cereri Membri</p>
              <p className="text-3xl font-bold text-gray-900">{totalMemberRequests || 0}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <UserCheck className="h-6 w-6 text-purple-600" />
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Member Requests */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cereri Membri ({totalMemberRequests})</h2>
          <div className="space-y-4 flex-1">
            {paginatedMemberRequests?.map((request) => (
              <div 
                key={request.id} 
                className="border-b border-gray-100 pb-4 last:border-b-0 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => handleMemberRequestClick(request.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {request.brand} {request.model} {request.year && `(${request.year})`}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Client: {request.contact_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Email: {request.contact_email}
                    </p>
                    <p className="text-sm text-gray-500">
                      Buget: €{request.max_budget?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status === 'pending' ? 'În așteptare' :
                       request.status === 'in_progress' ? 'În procesare' :
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
              <p className="text-gray-500 text-center py-4">Nu există cereri membre</p>
            )}
          </div>
          
          {/* Pagination for Member Requests */}
          {recentMemberRequests && recentMemberRequests.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setCurrentMemberPage(prev => Math.max(prev - 1, 1))}
                disabled={currentMemberPage === 1}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Înapoi
              </button>
              <span className="text-sm text-gray-600">
                {currentMemberPage} din {getTotalPages(recentMemberRequests)}
              </span>
              <button
                onClick={() => setCurrentMemberPage(prev => Math.min(prev + 1, getTotalPages(recentMemberRequests)))}
                disabled={currentMemberPage === getTotalPages(recentMemberRequests)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Înainte
              </button>
            </div>
          )}
        </div>

        {/* Recent Car Requests */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cereri Mașini ({totalCarRequests})</h2>
          <div className="space-y-4 flex-1">
            {paginatedCarRequests?.map((request) => (
              <div 
                key={request.id} 
                className="border-b border-gray-100 pb-4 last:border-b-0 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => handleCarRequestClick(request.id)}
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
          
          {/* Pagination for Car Requests */}
          {recentCarRequests && recentCarRequests.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setCurrentCarPage(prev => Math.max(prev - 1, 1))}
                disabled={currentCarPage === 1}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Înapoi
              </button>
              <span className="text-sm text-gray-600">
                {currentCarPage} din {getTotalPages(recentCarRequests)}
              </span>
              <button
                onClick={() => setCurrentCarPage(prev => Math.min(prev + 1, getTotalPages(recentCarRequests)))}
                disabled={currentCarPage === getTotalPages(recentCarRequests)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Înainte
              </button>
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Utilizatori ({totalUsers})</h2>
          <div className="space-y-4 flex-1">
            {paginatedUsers?.map((user) => (
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
          
          {/* Pagination for Users */}
          {recentUsers && recentUsers.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setCurrentUserPage(prev => Math.max(prev - 1, 1))}
                disabled={currentUserPage === 1}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Înapoi
              </button>
              <span className="text-sm text-gray-600">
                {currentUserPage} din {getTotalPages(recentUsers)}
              </span>
              <button
                onClick={() => setCurrentUserPage(prev => Math.min(prev + 1, getTotalPages(recentUsers)))}
                disabled={currentUserPage === getTotalPages(recentUsers)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Înainte
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CarRequestModal
        isOpen={isCarModalOpen}
        onClose={handleCloseCarModal}
        requestId={selectedRequestId}
        onRequestUpdated={handleRequestUpdated}
      />
      
      <ClientRequestModal
        isOpen={isClientModalOpen}
        onClose={handleCloseClientModal}
        requestId={selectedMemberRequestId}
        onRequestUpdated={handleRequestUpdated}
      />
    </div>
  )
}