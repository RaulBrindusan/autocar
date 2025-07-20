import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100 text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Eroare de Autentificare
          </h1>
          <p className="text-gray-600 mb-6">
            A apărut o problemă cu linkul de confirmare. Te rugăm să încerci din nou sau să contactezi suportul.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/login">Întoarce-te la Login</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Acasă</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}