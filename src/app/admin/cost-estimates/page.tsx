import { requireAdmin } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { 
  Calculator, 
  Euro,
  Mail,
  Calendar,
  TrendingUp,
  BarChart3
} from "lucide-react"

export default async function CostEstimatesPage() {
  // Require admin role to access this page
  await requireAdmin()
  
  const supabase = await createClient()

  // Fetch all cost estimates
  const { data: costEstimates } = await supabase
    .from("cost_estimates")
    .select(`
      *,
      users(full_name, email)
    `)
    .order("created_at", { ascending: false })

  // Calculate stats
  const totalEstimates = costEstimates?.length || 0
  const totalValue = costEstimates?.reduce((sum, est) => sum + Number(est.car_value || 0), 0) || 0
  const averageValue = totalEstimates > 0 ? totalValue / totalEstimates : 0

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Estimări Costuri
          </h1>
          <p className="text-gray-600 mt-2">
            Toate calculele de costuri salvate de utilizatori
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Estimări</p>
                <p className="text-2xl font-bold text-gray-900">{totalEstimates}</p>
              </div>
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valoare Totală Mașini</p>
                <p className="text-2xl font-bold text-green-600">€{totalValue.toLocaleString()}</p>
              </div>
              <Euro className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valoare Medie</p>
                <p className="text-2xl font-bold text-purple-600">€{averageValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Această Lună</p>
                <p className="text-2xl font-bold text-orange-600">
                  {costEstimates?.filter(est => {
                    const estDate = new Date(est.created_at)
                    const now = new Date()
                    return estDate.getMonth() === now.getMonth() && estDate.getFullYear() === now.getFullYear()
                  }).length || 0}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Cost Estimates Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Toate Estimările</h2>
          </div>
          
          <div className="overflow-x-auto">
            <div className="space-y-4 p-6">
              {costEstimates?.map((estimate) => (
                <div key={estimate.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Cost Breakdown */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Calculator className="h-5 w-5 text-blue-600 mr-2" />
                        Detalii Costuri
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Valoare Mașină:</span>
                          <span className="text-sm font-bold text-gray-900">€{Number(estimate.car_value).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Taxe Import:</span>
                          <span className="text-sm font-bold text-gray-900">€{Number(estimate.import_fees).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Cost Transport:</span>
                          <span className="text-sm font-bold text-gray-900">€{Number(estimate.shipping_cost).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Taxe:</span>
                          <span className="text-sm font-bold text-gray-900">€{Number(estimate.taxes).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <span className="text-base font-bold text-blue-900">Cost Total:</span>
                          <span className="text-base font-bold text-blue-900">€{Number(estimate.total_cost).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* User & Date Info */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Informații Suplimentare</h4>
                      <div className="space-y-3">
                        {estimate.contact_email && (
                          <div className="flex items-center text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            <span className="text-sm">{estimate.contact_email}</span>
                          </div>
                        )}
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm">
                            Creat: {new Date(estimate.created_at).toLocaleDateString('ro-RO')} la {new Date(estimate.created_at).toLocaleTimeString('ro-RO')}
                          </span>
                        </div>
                        
                        {estimate.users && (
                          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm font-medium text-green-900">Utilizator Înregistrat:</p>
                            <p className="text-sm text-green-700">{estimate.users.full_name}</p>
                            <p className="text-sm text-green-700">{estimate.users.email}</p>
                          </div>
                        )}
                        
                        {!estimate.users && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm font-medium text-gray-700">Utilizator Anonim</p>
                            <p className="text-sm text-gray-600">Nu este conectat la un cont</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-12">
                  <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nu există estimări de costuri</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}