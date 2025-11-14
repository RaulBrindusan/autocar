import { Shield } from "lucide-react"

export default function AdminAccountPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Cont Administrator
        </h1>
        <p className="text-gray-600 mb-8">
          Această pagină este în curs de migrare către Firebase.
        </p>
        <a
          href="/admin"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Shield className="h-5 w-5 mr-2" />
          Înapoi la Panou Admin
        </a>
      </div>
    </div>
  )
}
