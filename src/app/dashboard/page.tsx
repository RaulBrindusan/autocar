import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Car, Settings, User, FileText, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user profile data
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bună ziua, {profile?.full_name || user.email}!
          </h1>
          <p className="text-gray-600 mt-2">
            Bine ai venit în dashboard-ul tău Automode
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cereri Active</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Oferte Primite</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Estimări</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acțiuni Rapide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 flex-col">
              <Link href="/request-car?tab=car">
                <Car className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">Comandă Mașină</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex-col">
              <Link href="/request-car?tab=openlane">
                <FileText className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">Trimite OpenLane</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex-col">
              <Link href="#cost-estimator">
                <BarChart3 className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">Calculator Costuri</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex-col">
              <Link href="/profile">
                <Settings className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">Setări Cont</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informații Cont</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nume</label>
                <p className="text-gray-900">{profile?.full_name || "Nu este setat"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Telefon</label>
                <p className="text-gray-900">{profile?.phone || "Nu este setat"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Membru din</label>
                <p className="text-gray-900">
                  {new Date(profile?.created_at || user.created_at).toLocaleDateString('ro-RO')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Activitate Recentă</h2>
            <div className="text-center py-8">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Nu există activitate recentă</p>
              <p className="text-sm text-gray-400 mt-1">
                Comenzile și ofertele tale vor apărea aici
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}