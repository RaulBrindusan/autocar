import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CostCalculator } from "@/components/dashboard/CostCalculator"

export default async function DashboardCalculatorPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Calculator Costuri Import</h1>
          <p className="text-gray-600 mt-2">
            Calculează costurile exacte pentru importul mașinii tale din Europa
          </p>
        </div>

        {/* Calculator */}
        <CostCalculator />
      </div>
    </div>
  )
}