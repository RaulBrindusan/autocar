import { requireAdmin } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { AdminDashboard } from "@/components/admin/AdminDashboard"

export default async function AdminPage() {
  // Require admin role to access this page
  await requireAdmin()
  
  const supabase = await createClient()

  // Use admin functions to bypass RLS issues
  const [
    { data: totalUsers },
    { data: totalCarRequests },
    { data: totalCostEstimates },
    { data: totalOpenLaneSubmissions },
    { data: recentUsers },
    { data: recentCarRequests }
  ] = await Promise.all([
    supabase.rpc('admin_get_table_count', { table_name: 'users' }),
    supabase.rpc('admin_get_table_count', { table_name: 'car_requests' }),
    supabase.rpc('admin_get_table_count', { table_name: 'cost_estimates' }),
    supabase.rpc('admin_get_table_count', { table_name: 'openlane_submissions' }),
    supabase.rpc('admin_get_recent_users', { limit_count: 5 }),
    supabase.rpc('admin_get_recent_car_requests', { limit_count: 5 })
  ])

  return (
    <AdminLayout>
      <AdminDashboard
        totalUsers={totalUsers || 0}
        totalCarRequests={totalCarRequests || 0}
        totalCostEstimates={totalCostEstimates || 0}
        totalOpenLaneSubmissions={totalOpenLaneSubmissions || 0}
        recentUsers={recentUsers || []}
        recentCarRequests={recentCarRequests || []}
      />
    </AdminLayout>
  )
}