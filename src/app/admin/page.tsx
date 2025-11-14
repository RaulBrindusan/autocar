// import { requireAdmin } from "@/lib/auth-utils"
// import { createClient } from "@/lib/supabase/server"
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
    { data: totalMemberRequests },
    { data: totalOpenLaneSubmissions },
    { data: recentUsers },
    { data: recentCarRequests },
    { data: recentMemberRequests }
  ] = await Promise.all([
    supabase.rpc('admin_get_table_count', { table_name: 'users' }),
    supabase.rpc('admin_get_table_count', { table_name: 'car_requests' }),
    supabase.rpc('admin_get_table_count', { table_name: 'member_car_requests' }),
    supabase.rpc('admin_get_table_count', { table_name: 'openlane_submissions' }),
    supabase.rpc('admin_get_recent_users', { limit_count: 5 }),
    supabase.rpc('admin_get_recent_car_requests', { limit_count: 5 }),
    supabase.from('member_car_requests').select('*').order('created_at', { ascending: false }).limit(5)
  ])

  return (
    <AdminLayout>
      <AdminDashboard
        totalUsers={totalUsers || 0}
        totalCarRequests={totalCarRequests || 0}
        totalMemberRequests={totalMemberRequests || 0}
        totalOpenLaneSubmissions={totalOpenLaneSubmissions || 0}
        recentUsers={recentUsers || []}
        recentCarRequests={recentCarRequests || []}
        recentMemberRequests={recentMemberRequests || []}
      />
    </AdminLayout>
  )
}