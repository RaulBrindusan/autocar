import { requireAdmin } from "@/lib/auth-utils"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { AdminDocumentsList } from "@/components/admin/AdminDocumentsList"

export default async function AdminDocumentsPage() {
  // Require admin role to access this page
  await requireAdmin()

  return (
    <AdminLayout>
      <AdminDocumentsList />
    </AdminLayout>
  )
}