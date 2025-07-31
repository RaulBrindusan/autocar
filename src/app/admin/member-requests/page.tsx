import { requireAdmin } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { MemberRequestsGrid } from "@/components/admin/MemberRequestsGrid"

interface MemberCarRequest {
  id: string
  brand: string
  model: string
  year?: number
  fuel_type?: string
  transmission?: string
  max_mileage_km?: number
  max_budget: number
  required_features?: string[]
  additional_notes?: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  status: string
  created_at: string
  user_id: string
}

export default async function MemberRequestsPage() {
  // Require admin role to access this page
  await requireAdmin()
  
  const supabase = await createClient()

  // Fetch member car requests
  const { data: memberRequests, error } = await supabase
    .from("member_car_requests") 
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching member requests:", error)
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <MemberRequestsGrid memberRequests={memberRequests || []} />
      </div>
    </AdminLayout>
  )
}