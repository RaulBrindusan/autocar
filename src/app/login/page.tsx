import { AuthForm } from "@/components/auth/AuthForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Automode - Autentificare | Login Import Auto Europa",
  description: "Autentificați-vă în contul Automode pentru a accesa serviciile de import auto din Europa. Gestionați cererile și urmăriți progresul importului.",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm mode="login" />
    </div>
  )
}