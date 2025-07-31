import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CarSelectionForm } from "@/components/car-selection/CarSelectionForm"

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
    .from("member_car_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })


  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">


        {/* Car Selection Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Comandă Mașină Nouă</h2>
            <p className="text-gray-600 mt-1">Completează formularul pentru a crea o cerere nouă</p>
          </div>
          <div className="p-8">
            <CarSelectionForm />
          </div>
        </div>

        {/* Car Requests List */}
        {carRequests && carRequests.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="divide-y divide-gray-100">
              {carRequests.map((request) => (
                <div key={request.id} className="p-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.brand} {request.model}
                      </h3>
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
                    
                    {request.additional_notes && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Cerințe suplimentare:</span> {request.additional_notes}
                      </div>
                    )}
                    
                    <div className="mt-3 text-xs text-gray-500">
                      Creată pe {new Date(request.created_at).toLocaleDateString('ro-RO')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}