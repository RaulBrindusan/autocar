"use client"

// import { createClient } from "@/lib/supabase/client"
import { CostCalculator } from "@/components/dashboard/CostCalculator"
import { useLanguage } from "@/contexts/LanguageContext"
import { useEffect, useState } from "react"

export default function DashboardCalculatorPage() {
  const { t } = useLanguage()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = "/login"
        return
      }

      setIsAuthenticated(true)
    }

    checkAuth()
  }, [])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('calculator.title')}</h1>
          <p className="text-gray-600 mt-2">
            {t('calculator.subtitle')}
          </p>
        </div>

        {/* Calculator */}
        <CostCalculator />
      </div>
    </div>
  )
}