// import { requireAdmin } from "@/lib/auth-utils"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { UsersGrid } from "@/components/admin/UsersGrid"

export default async function UsersPage() {
  // Require admin role to access this page
  await requireAdmin()

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Utilizatori
          </h1>
          <p className="text-gray-600 mt-2">
            Gestionează toți utilizatorii platformei
          </p>
        </div>

        {/* Users Grid with CRUD functionality */}
        <UsersGrid />
      </div>
    </AdminLayout>
  )
}