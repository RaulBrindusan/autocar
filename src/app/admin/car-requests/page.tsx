import { requireAdmin } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { CarRequestsGrid } from "@/components/admin/CarRequestsGrid"

export default async function CarRequestsPage() {
  // Require admin role to access this page
  await requireAdmin()
  
  const supabase = await createClient()

  // Fetch all car requests using admin function
  const { data: carRequests } = await supabase.rpc('admin_get_recent_car_requests', { limit_count: 100 })

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <CarRequestsGrid carRequests={carRequests || []} />
      </div>
    </AdminLayout>
  )
}