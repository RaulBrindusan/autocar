import { EnhancedAuthForm } from "@/components/auth/EnhancedAuthForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Automode - Înregistrare | Creează Cont Import Auto Europa",
  description: "Creați un cont Automode pentru a începe importul mașinii dvs. din Europa. Acces la calculator de costuri, urmărire comenzi și asistență completă.",
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <EnhancedAuthForm mode="signup" />
    </div>
  )
}