'use client'

import { useState } from 'react'
import { CarRequestModal } from '@/components/admin/CarRequestModal'
import { ClientRequestModal } from '@/components/admin/ClientRequestModal'
import { AnalyticsWidget } from '@/components/admin/AnalyticsWidget'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-4 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Total Utilizatori</p>
                <p className="text-2xl sm:text-4xl font-bold text-white">{totalUsers || 0}</p>
                <div className="mt-1 sm:mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-200 mr-1 sm:mr-2" />
                  <span className="text-blue-200 text-xs sm:text-sm">+12% față de luna trecută</span>
                </div>
              </div>
              <div className="bg-white/20 p-3 sm:p-4 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-4 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Cereri Mașini</p>
                <p className="text-2xl sm:text-4xl font-bold text-white">{totalCarRequests || 0}</p>
                <div className="mt-1 sm:mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-200 mr-1 sm:mr-2" />
                  <span className="text-emerald-200 text-xs sm:text-sm">+8% față de săptămâna trecută</span>
                </div>
              </div>
              <div className="bg-white/20 p-3 sm:p-4 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                <Car className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-4 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Cereri Membri</p>
                <p className="text-2xl sm:text-4xl font-bold text-white">{totalMemberRequests || 0}</p>
                <div className="mt-1 sm:mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-purple-200 mr-1 sm:mr-2" />
                  <span className="text-purple-200 text-xs sm:text-sm">+15% față de luna trecută</span>
                </div>
              </div>
              <div className="bg-white/20 p-3 sm:p-4 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-4 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 font-medium mb-1 sm:mb-2 text-sm sm:text-base">OpenLane Linkuri</p>
                <p className="text-2xl sm:text-4xl font-bold text-white">{totalOpenLaneSubmissions || 0}</p>
                <div className="mt-1 sm:mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-orange-200 mr-1 sm:mr-2" />
                  <span className="text-orange-200 text-xs sm:text-sm">+5% față de săptămâna trecută</span>
                </div>
              </div>
              <div className="bg-white/20 p-3 sm:p-4 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
        {/* Analytics Widget */}
        <AnalyticsWidget />
        
          {/* Recent Member Requests */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 flex flex-col">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl mr-4">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Cereri Membri</h2>
                <p className="text-gray-600">{totalMemberRequests} cereri active</p>
              </div>
            </div>
          <div className="space-y-4 flex-1">
            {paginatedMemberRequests?.map((request) => (
              <div 
                key={request.id} 
                className="border-b border-gray-100 pb-4 last:border-b-0 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => handleMemberRequestClick(request.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="bg-purple-100 p-2 rounded-lg mr-3">
                        <Car className="h-4 w-4 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        {request.brand} {request.model} {request.year && `(${request.year})`}
                      </h3>
                    </div>
                    <div className="ml-11 space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-3 w-3 mr-2" />
                        {request.contact_name}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-3 w-3 mr-2" />
                        {request.contact_email}
                      </div>
                      <div className="flex items-center text-sm font-medium text-emerald-600">
                        <span>€{request.max_budget?.toLocaleString()}</span>
                      </div>
                    </div>
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
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 flex flex-col">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-3 rounded-xl mr-4">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Cereri Mașini</h2>
                <p className="text-gray-600">{totalCarRequests} cereri active</p>
              </div>
            </div>
          <div className="space-y-4 flex-1">
            {paginatedCarRequests?.map((request) => (
              <div 
                key={request.id} 
                className="border-b border-gray-100 pb-4 last:border-b-0 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => handleCarRequestClick(request.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                        <Car className="h-4 w-4 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        {request.brand} {request.model} {request.year}
                      </h3>
                    </div>
                    <div className="ml-11 space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-3 w-3 mr-2" />
                        {request.user_full_name || request.contact_name}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-3 w-3 mr-2" />
                        {request.user_email || request.contact_email}
                      </div>
                      <div className="flex items-center text-sm font-medium text-emerald-600">
                        <span>€{request.max_budget?.toLocaleString()}</span>
                      </div>
                    </div>
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
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 flex flex-col">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl mr-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Utilizatori Recenți</h2>
                <p className="text-gray-600">{totalUsers} utilizatori înregistrați</p>
              </div>
            </div>
          <div className="space-y-4 flex-1">
            {paginatedUsers?.map((user) => (
              <div key={user.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {user.full_name || 'Nume nedefinit'}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Mail className="h-3 w-3 mr-2" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Phone className="h-3 w-3 mr-2" />
                          {user.phone}
                        </div>
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
    </div>
  )
}