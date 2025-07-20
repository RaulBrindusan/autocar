import { requireAdmin } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import { 
  Users, 
  Car, 
  FileText, 
  BarChart3, 
  Settings, 
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Mail,
  Phone
} from "lucide-react"
import { Button } from "@/components/ui/Button"

export default async function AdminPage() {
  // Require admin role to access this page
  await requireAdmin()
  
  const supabase = await createClient()

  // Fetch statistics
  const [
    { count: totalUsers },
    { count: totalCarRequests },
    { count: totalCostEstimates },
    { count: totalOpenLaneSubmissions }
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("car_requests").select("*", { count: "exact", head: true }),
    supabase.from("cost_estimates").select("*", { count: "exact", head: true }),
    supabase.from("openlane_submissions").select("*", { count: "exact", head: true })
  ])

  // Fetch recent car requests
  const { data: recentCarRequests } = await supabase
    .from("car_requests")
    .select(`
      *,
      users(full_name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch recent users
  const { data: recentUsers } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Panou Administrare AutoCar
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

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acțiuni Rapide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-auto p-4 flex-col bg-blue-600 hover:bg-blue-700">
              <Users className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Gestionează Utilizatori</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col">
              <Car className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Revizuiește Cereri</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col">
              <Settings className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Configurări Sistem</span>
            </Button>
          </div>
        </div>

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Car Requests */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cereri Recente Mașini</h2>
            <div className="space-y-4">
              {recentCarRequests?.map((request) => (
                <div key={request.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {request.brand} {request.model} {request.year}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Client: {request.users?.full_name || request.contact_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Email: {request.users?.email || request.contact_email}
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Utilizatori Noi</h2>
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
      </div>
    </div>
  )
}