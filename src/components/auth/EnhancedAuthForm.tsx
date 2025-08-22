"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { TurnstileWidget, useTurnstile } from "@/components/security/TurnstileWidget"
import { Mail, Lock, User, AlertCircle, Phone, Eye, EyeOff, Shield, CheckCircle, XCircle } from "lucide-react"
import { validatePasswordStrength, validateEmail, signupValidationSchema } from "@/lib/security-validation"
import { z } from "zod"
import toast from "react-hot-toast"

interface AuthFormProps {
  mode: "login" | "signup"
}

export function EnhancedAuthForm({ mode }: AuthFormProps) {
  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  
  // Security state
  const [honeypot, setHoneypot] = useState("") // Should remain empty
  const [formStartTime] = useState(Date.now())
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  
  // Validation state
  const [emailValidation, setEmailValidation] = useState<{isValid: boolean, issues: string[]}>({isValid: true, issues: []})
  const [passwordValidation, setPasswordValidation] = useState<{isValid: boolean, score: number, feedback: string[]}>({isValid: true, score: 0, feedback: []})
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  
  // Turnstile integration
  const turnstile = useTurnstile()
  
  const router = useRouter()
  const supabase = createClient()

  // Real-time email validation
  useEffect(() => {
    if (email && mode === "signup") {
      const validation = validateEmail(email)
      setEmailValidation(validation)
    }
  }, [email, mode])

  // Real-time password validation
  useEffect(() => {
    if (password && mode === "signup") {
      const validation = validatePasswordStrength(password)
      setPasswordValidation(validation)
    }
  }, [password, mode])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (mode === "signup") {
      // Check honeypot
      if (honeypot) {
        setError("Detectat comportament suspect. Vă rugăm să reîncărcați pagina.")
        return false
      }
      
      // Check form timing (minimum 3 seconds)
      const formTime = Date.now() - formStartTime
      if (formTime < 3000) {
        setError("Vă rugăm să completați formularul mai atent.")
        return false
      }
      
      // Validate required fields
      if (!fullName.trim()) errors.fullName = "Numele este obligatoriu"
      if (!email.trim()) errors.email = "Email-ul este obligatoriu"
      if (!password) errors.password = "Parola este obligatorie"
      if (!acceptTerms) errors.acceptTerms = "Trebuie să acceptați termenii și condițiile"
      if (!acceptPrivacy) errors.acceptPrivacy = "Trebuie să acceptați politica de confidențialitate"
      
      // Email validation
      if (email && !emailValidation.isValid) {
        errors.email = emailValidation.issues[0] || "Email invalid"
      }
      
      // Password validation
      if (password && !passwordValidation.isValid) {
        errors.password = passwordValidation.feedback[0] || "Parola nu respectă cerințele"
      }
      
      // Turnstile validation
      if (!turnstile.isVerified) {
        errors.turnstile = "Vă rugăm să completați verificarea de securitate"
      }
    } else {
      // Login validation
      if (!email.trim()) errors.email = "Email-ul este obligatoriu"
      if (!password) errors.password = "Parola este obligatorie"
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    
    // Validate form
    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      if (mode === "signup") {
        // Use our secure signup API
        const signupData = {
          email: email.trim(),
          password,
          fullName: fullName.trim(),
          phone: phone.trim() || undefined,
          website: honeypot, // Honeypot field
          formStartTime,
          acceptTerms,
          acceptPrivacy,
          turnstileToken: turnstile.token
        }

        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupData),
        })

        const result = await response.json()

        if (!response.ok) {
          // Handle specific error codes
          switch (result.code) {
            case 'RATE_LIMIT_IP':
            case 'RATE_LIMIT_EMAIL':
            case 'RATE_LIMIT_GLOBAL':
              setError(result.error)
              // Reset form after rate limit
              setTimeout(() => {
                setError(null)
                turnstile.reset()
              }, 5000)
              break
            case 'TURNSTILE_FAILED':
              setError(result.error)
              turnstile.reset()
              break
            case 'VALIDATION_ERROR':
              setError(result.error)
              if (result.details) {
                const newErrors: Record<string, string> = {}
                result.details.forEach((detail: any) => {
                  newErrors[detail.field] = detail.message
                })
                setFieldErrors(newErrors)
              }
              break
            case 'EMAIL_ALREADY_EXISTS':
              setFieldErrors({ email: result.error })
              break
            default:
              setError(result.error)
          }
          setLoading(false)
          return
        }

        setMessage(result.message)
        toast.success("Cont creat cu succes! Verificați emailul pentru confirmare.")
        
        // Redirect to login page after successful signup
        setTimeout(() => {
          router.push('/login')
        }, 3000)
        
      } else {
        // Login with existing Supabase method
        const { error, data } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        
        if (error) throw error
        
        // Check user role and redirect accordingly
        if (data.user) {
          try {
            const { data: roleResult, error: roleError } = await supabase
              .rpc('get_user_role', { user_id: data.user.id })
            
            if (roleError) {
              console.error('Role fetch error:', roleError)
              router.push("/dashboard")
            } else {
              const userRole = roleResult
              
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
        toast.success("Autentificare reușită!")
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      
      if (error.message?.includes('fetch')) {
        setError("Nu se poate conecta la serviciul de autentificare. Verificați conexiunea la internet.")
      } else if (error.message?.includes('Invalid login credentials')) {
        setError("Email sau parolă incorectă.")
      } else {
        setError(error.message || "A apărut o eroare. Vă rugăm să încercați din nou.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Password strength indicator
  const PasswordStrengthIndicator = () => {
    if (!password || mode !== "signup") return null
    
    const { score, isValid, feedback } = passwordValidation
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
    
    return (
      <div className="mt-2">
        <div className="flex space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded ${
                i < score ? colors[Math.min(score - 1, 4)] : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center text-xs">
          {isValid ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              <span>Parolă puternică</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <XCircle className="h-3 w-3 mr-1" />
              <span>{feedback[0] || "Parolă slabă"}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  const turnstileSiteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === "signup" ? "Creează Cont" : "Autentificare"}
          </h2>
          <p className="text-gray-600">
            {mode === "signup" 
              ? "Alătură-te comunității Automode" 
              : "Accesează-ți contul Automode"
            }
          </p>
        </div>


        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-700">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{message}</span>
            </div>
          </div>
        )}

        {/* Honeypot field (hidden) */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
          tabIndex={-1}
          autoComplete="off"
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === "signup" && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                Nume complet *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Numele și prenumele"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent text-gray-900 placeholder-gray-400 ${
                    fieldErrors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                />
              </div>
              {fieldErrors.fullName && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.fullName}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adresa@email.com"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent text-gray-900 placeholder-gray-400 ${
                  fieldErrors.email || (!emailValidation.isValid && email) ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
            {mode === "signup" && email && !emailValidation.isValid && (
              <p className="mt-1 text-sm text-red-600">{emailValidation.issues[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Parolă *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "Minim 8 caractere, litere mari/mici, cifre" : "Parola"}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent text-gray-900 placeholder-gray-400 ${
                  fieldErrors.password || (!passwordValidation.isValid && password && mode === "signup") ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
            )}
            <PasswordStrengthIndicator />
          </div>

          {mode === "signup" && (
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Telefon (opțional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0750462307"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
          )}

          {mode === "signup" && (
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className={`mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${
                    fieldErrors.acceptTerms ? 'border-red-300' : ''
                  }`}
                />
                <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-700">
                  Accept{" "}
                  <a href="/termeni-si-conditii" target="_blank" className="text-blue-600 hover:underline">
                    termenii și condițiile
                  </a>{" "}
                  *
                </label>
              </div>
              {fieldErrors.acceptTerms && (
                <p className="text-sm text-red-600">{fieldErrors.acceptTerms}</p>
              )}

              <div className="flex items-start">
                <input
                  id="acceptPrivacy"
                  type="checkbox"
                  checked={acceptPrivacy}
                  onChange={(e) => setAcceptPrivacy(e.target.checked)}
                  className={`mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${
                    fieldErrors.acceptPrivacy ? 'border-red-300' : ''
                  }`}
                />
                <label htmlFor="acceptPrivacy" className="ml-2 text-sm text-gray-700">
                  Accept{" "}
                  <a href="/politica-de-confidentialitate" target="_blank" className="text-blue-600 hover:underline">
                    politica de confidențialitate
                  </a>{" "}
                  *
                </label>
              </div>
              {fieldErrors.acceptPrivacy && (
                <p className="text-sm text-red-600">{fieldErrors.acceptPrivacy}</p>
              )}
            </div>
          )}

          {/* Cloudflare Turnstile for signup */}
          {mode === "signup" && turnstileSiteKey && (
            <div>
              <TurnstileWidget
                siteKey={turnstileSiteKey}
                onSuccess={turnstile.handleSuccess}
                onError={turnstile.handleError}
                onExpired={turnstile.handleExpired}
                theme="auto"
                size="normal"
                className="flex justify-center"
              />
              {fieldErrors.turnstile && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.turnstile}</p>
              )}
              {turnstile.error && (
                <p className="mt-2 text-sm text-red-600">{turnstile.error}</p>
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || (mode === "signup" && !turnstile.isVerified && !!turnstileSiteKey)}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {mode === "signup" ? "Se creează contul..." : "Se autentifică..."}
              </div>
            ) : (
              mode === "signup" ? "Creează Cont" : "Autentificare"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {mode === "signup" ? "Ai deja cont?" : "Nu ai cont?"}
            <a
              href={mode === "signup" ? "/login" : "/signup"}
              className="ml-2 text-blue-600 hover:underline font-semibold"
            >
              {mode === "signup" ? "Autentifică-te" : "Creează cont"}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}