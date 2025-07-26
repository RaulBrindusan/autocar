import { AdminSidebar } from "./AdminSidebar"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile spacing */}
        <div className="lg:hidden h-16" />
        
        {/* Content */}
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}