import { requireAdmin } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { ClientsGrid } from "@/components/admin/ClientsGrid"

export default async function ClientsPage() {
  // Require admin role to access this page
  await requireAdmin()
  
  const supabase = await createClient()

  // Fetch all clients using admin function
  const { data: clients } = await supabase.rpc('admin_get_clients', { limit_count: 100 })

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <ClientsGrid clients={clients || []} />
      </div>
    </AdminLayout>
  )
}