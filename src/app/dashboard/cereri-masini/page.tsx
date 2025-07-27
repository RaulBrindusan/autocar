import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Car, Clock, CheckCircle, XCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default async function CereriMasiniPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user's car requests
  const { data: carRequests, error } = await supabase
    .from("car_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "În așteptare" },
      in_progress: { color: "bg-blue-100 text-blue-800", icon: Clock, label: "În progres" },
      quoted: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Ofertat" },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Finalizat" },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Anulat" },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cereri Mașini</h1>
            <p className="text-gray-600 mt-2">
              Gestionează cererile tale pentru importul de mașini
            </p>
          </div>
          <Button asChild>
            <Link href="/request-car">
              <Plus className="h-4 w-4 mr-2" />
              Cerere Nouă
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cereri</p>
                <p className="text-2xl font-bold text-gray-900">{carRequests?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">În așteptare</p>
                <p className="text-2xl font-bold text-gray-900">
                  {carRequests?.filter(req => req.status === 'pending').length || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Finalizate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {carRequests?.filter(req => req.status === 'completed').length || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ofertate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {carRequests?.filter(req => req.status === 'quoted').length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Car Requests List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {carRequests && carRequests.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {carRequests.map((request) => (
                <div key={request.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.brand} {request.model}
                        </h3>
                        {getStatusBadge(request.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">An:</span> {request.year || 'Nu specificat'}
                        </div>
                        <div>
                          <span className="font-medium">Buget maxim:</span> {request.max_budget ? `€${request.max_budget.toLocaleString()}` : 'Nu specificat'}
                        </div>
                        <div>
                          <span className="font-medium">Combustibil:</span> {request.fuel_type || 'Nu specificat'}
                        </div>
                      </div>
                      
                      {request.additional_requirements && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Cerințe suplimentare:</span> {request.additional_requirements}
                        </div>
                      )}
                      
                      <div className="mt-3 text-xs text-gray-500">
                        Creată pe {new Date(request.created_at).toLocaleDateString('ro-RO')}
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      <Button variant="outline" size="sm">
                        Vezi Detalii
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nicio cerere de mașină încă
              </h3>
              <p className="text-gray-600 mb-6">
                Începe prin a crea prima ta cerere pentru importul unei mașini.
              </p>
              <Button asChild>
                <Link href="/request-car">
                  <Plus className="h-4 w-4 mr-2" />
                  Creează Prima Cerere
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}