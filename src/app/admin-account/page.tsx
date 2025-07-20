import { requireAdmin } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Calendar,
  Settings,
  Lock,
  Edit,
  Activity
} from "lucide-react"
import { Button } from "@/components/ui/Button"

export default async function AdminAccountPage() {
  // Require admin role to access this page
  const { user, profile } = await requireAdmin()
  
  const supabase = await createClient()

  // Fetch admin activity stats
  const [
    { count: recentCarRequests },
    { count: recentUsers },
    { count: totalActions }
  ] = await Promise.all([
    supabase.from("car_requests").select("*", { count: "exact", head: true }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase.from("users").select("*", { count: "exact", head: true }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase.from("car_requests").select("*", { count: "exact", head: true })
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Cont Administrator
          </h1>
          <p className="text-gray-600 mt-2">
            Gestionează setările și informațiile contului tău de administrator
          </p>
        </div>

        {/* Admin Profile Card */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-start space-x-6">
            {/* Profile Picture */}
            <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center">
              <Shield className="h-12 w-12 text-red-600" />
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.full_name || "Administrator"}
                </h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <Shield className="h-4 w-4 mr-1" />
                  Administrator
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-gray-900">{profile.email}</p>
                  </div>
                </div>
                
                {profile.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Telefon</p>
                      <p className="text-gray-900">{profile.phone}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Administrator din</p>
                    <p className="text-gray-900">
                      {new Date(profile.created_at).toLocaleDateString('ro-RO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">ID Utilizator</p>
                    <p className="text-xs text-gray-600 font-mono">{profile.id}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button variant="outline" className="flex items-center">
                  <Edit className="h-4 w-4 mr-2" />
                  Editează Profil
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Schimbă Parola
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cereri Săptămână Aceasta</p>
                <p className="text-3xl font-bold text-gray-900">{recentCarRequests || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilizatori Noi</p>
                <p className="text-3xl font-bold text-gray-900">{recentUsers || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <User className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Acțiuni</p>
                <p className="text-3xl font-bold text-gray-900">{totalActions || 0}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acțiuni Cont</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col">
              <Edit className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Actualizează Informații</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col">
              <Lock className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Securitate & Parola</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col">
              <Settings className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Preferințe Admin</span>
            </Button>
          </div>
        </div>

        {/* Navigation Back to Admin Panel */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Înapoi la Panou Administrare</h3>
              <p className="text-blue-700">Continuă să gestionezi platforma AutoCar</p>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <a href="/admin">
                <Shield className="h-4 w-4 mr-2" />
                Panou Admin
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}