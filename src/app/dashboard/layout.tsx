import { UserSidebar } from '@/components/ui/UserSidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserSidebar>
      {children}
    </UserSidebar>
  )
}