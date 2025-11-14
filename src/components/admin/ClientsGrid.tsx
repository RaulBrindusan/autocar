'use client'

import { useState, useEffect } from 'react'
import { ClientModal } from '@/components/admin/ClientModal'
import { 
  Users, 
  Phone, 
  Mail,
  Calendar,
  Car,
  Plus,
  UserCheck,
  User,
  Search,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/Button"
// import { createClient } from '@/lib/supabase/client'

interface User {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
  car_requests_count: number
  cost_estimates_count: number
  openlane_submissions_count: number
}

export function ClientsGrid() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedClient, setSelectedClient] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'create'>('view')
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'created_at' | 'full_name' | 'email'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { data, error } = await supabase.rpc('admin_get_users')
      
      if (error) throw error
      
      // Filter to only show users with role 'user' (not admins)
      const regularUsers = (data || []).filter((user: User) => user.role === 'user')
      setUsers(regularUsers)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err instanceof Error ? err.message : 'A apărut o eroare')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClientClick = (client: User) => {
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
    fetchUsers()
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

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter(user => {
      const matchesSearch = 
        (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm))
      
      return matchesSearch
    })
    .sort((a, b) => {
      let aValue: string | number | Date
      let bValue: string | number | Date
      
      switch (sortBy) {
        case 'full_name':
          aValue = a.full_name || a.email
          bValue = b.full_name || b.email
          break
        case 'email':
          aValue = a.email
          bValue = b.email
          break
        case 'created_at':
        default:
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  const registeredUsersCount = users.length
  const totalCarRequests = users.reduce((sum, u) => sum + u.car_requests_count, 0)
  const totalCostEstimates = users.reduce((sum, u) => sum + u.cost_estimates_count, 0)
  const totalOpenLaneSubmissions = users.reduce((sum, u) => sum + u.openlane_submissions_count, 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Membri Înregistrați</h1>
          <p className="text-gray-600 mt-2">
            Gestionează membrii înregistrați și cererile lor de import mașini
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
              <p className="text-sm font-medium text-gray-600">Total Membri</p>
              <p className="text-2xl font-bold text-gray-900">{registeredUsersCount}</p>
            </div>
            <UserCheck className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cereri Mașini</p>
              <p className="text-2xl font-bold text-blue-600">{totalCarRequests}</p>
            </div>
            <Car className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Estimări Cost</p>
              <p className="text-2xl font-bold text-green-600">{totalCostEstimates}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">OpenLane</p>
              <p className="text-2xl font-bold text-purple-600">{totalOpenLaneSubmissions}</p>
            </div>
            <Car className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search, Sort, and Filter Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Caută membri..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64 placeholder-black"
              />
            </div>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder]
                setSortBy(newSortBy)
                setSortOrder(newSortOrder)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto text-black"
            >
              <option value="created_at-desc">Cel mai recent înregistrați</option>
              <option value="created_at-asc">Cel mai vechi înregistrați</option>
              <option value="full_name-asc">Nume A-Z</option>
              <option value="full_name-desc">Nume Z-A</option>
              <option value="email-asc">Email A-Z</option>
              <option value="email-desc">Email Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Clients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Membrii Înregistrați ({filteredAndSortedUsers.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <div className="space-y-4 p-6">
            {filteredAndSortedUsers?.map((user) => (
              <div 
                key={user.id} 
                className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleClientClick(user)}
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* User Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-lg">
                          {(user.full_name || user.email)?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          {user.full_name || 'Nume nedefinit'}
                          <span title="Membru înregistrat">
                            <UserCheck className="h-4 w-4 ml-2 text-green-600" />
                          </span>
                        </h3>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Summary */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Activitate</h4>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Car className="h-4 w-4 mr-1" />
                        {user.car_requests_count} cereri mașini
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {user.cost_estimates_count} estimări cost
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        {user.openlane_submissions_count} OpenLane
                      </div>
                    </div>
                  </div>

                  {/* Member Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Membru</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-600">
                          Înregistrat: {formatDate(user.created_at)}
                        </span>
                      </div>
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        Membru înregistrat
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )) }
            
            {filteredAndSortedUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm 
                    ? 'Nu s-au găsit membri care să corespundă criteriilor' 
                    : 'Nu există membri înregistrați'
                  }
                </p>
                {!searchTerm && (
                  <Button onClick={handleAddClient} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Adaugă primul membru
                  </Button>
                )}
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