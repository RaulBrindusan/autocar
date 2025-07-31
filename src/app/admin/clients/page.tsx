import { requireAdmin } from "@/lib/auth-utils"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { ClientsGrid } from "@/components/admin/ClientsGrid"

export default async function ClientsPage() {
  // Require admin role to access this page
  await requireAdmin()

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <ClientsGrid />
      </div>
    </AdminLayout>
  )
}