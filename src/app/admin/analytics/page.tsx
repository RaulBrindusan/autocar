// import { requireAdmin } from "@/lib/auth-utils"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard"

export const metadata = {
  title: "Analytics - Automode Admin",
  description: "Website analytics and performance metrics"
}

export default async function AnalyticsPage() {
  // Require admin role to access this page
  await requireAdmin()

  return (
    <AdminLayout>
      <AnalyticsDashboard />
    </AdminLayout>
  )
}