"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Mail, Lock, User, AlertCircle, Phone } from "lucide-react"

interface AuthFormProps {
  mode: "login" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError("Serviciul de autentificare nu este configurat corect.")
      setLoading(false)
      return
    }

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: fullName,
              phone: phone,
            },
          },
        })
        
        if (error) throw error
        
        setMessage("Te rugăm să verifici emailul pentru a-ți confirma contul.")
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        
        // Check user role and redirect accordingly
        if (data.user) {
          try {
            // Use the RLS-bypassing function to get user role
            const { data: roleResult, error: roleError } = await supabase
              .rpc('get_user_role', { user_id: data.user.id })
            
            if (roleError) {
              console.error('Role fetch error:', roleError)
              router.push("/dashboard")
            } else {
              const userRole = roleResult
              console.log('User role:', userRole)
              
              if (userRole === 'admin') {
                router.push("/admin")
              } else {
                router.push("/dashboard")
              }
            }
          } catch (roleError) {
            console.error('Error checking user role:', roleError)
            router.push("/dashboard")
          }
        } else {
          router.push("/dashboard")
        }
        
        router.refresh()
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      
      // Handle specific error types
      if (error.message?.includes('fetch')) {
        setError("Nu se poate conecta la serviciul de autentificare. Verifică conexiunea la internet.")
      } else if (error.message?.includes('Invalid API key')) {
        setError("Cheie API invalidă. Contactează administratorul.")
      } else {
        setError(error.message || "A apărut o eroare neașteptată.")
      }
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-blue-700/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            {mode === "signup" ? (
              <User className="h-8 w-8 text-blue-700" />
            ) : (
              <Lock className="h-8 w-8 text-blue-700" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === "signup" ? "Creează Cont" : "Conectează-te"}
          </h1>
          <p className="text-gray-600">
            {mode === "signup" 
              ? "Alătură-te comunității Automode" 
              : "Intră în contul tău Automode"
            }
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === "signup" && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Nume Complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ion Popescu"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="numele@exemplu.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent text-gray-900 placeholder-gray-400"
                required
              />
            </div>
          </div>

          {mode === "signup" && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0750462307"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Parolă
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parola ta"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent text-gray-900 placeholder-gray-400"
                required
                minLength={6}
              />
            </div>
            {mode === "login" && (
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => router.push("/forgot-password")}
                  className="text-sm text-blue-700 hover:text-blue-800 font-medium"
                >
                  Ai uitat parola?
                </button>
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? "Se încarcă..." : mode === "signup" ? "Creează Cont" : "Conectează-te"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {mode === "signup" ? "Ai deja cont? " : "Nu ai cont? "}
            <button
              onClick={() => router.push(mode === "signup" ? "/login" : "/signup")}
              className="text-blue-700 hover:text-blue-800 font-medium"
            >
              {mode === "signup" ? "Conectează-te" : "Creează cont"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}