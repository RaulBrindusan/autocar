"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Calculator, Euro, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

export function CostEstimator() {
  const [carValue, setCarValue] = useState("")
  const [estimate, setEstimate] = useState<{
    importFees: number
    shipping: number
    taxes: number
    total: number
  } | null>(null)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const calculateEstimate = async () => {
    const value = parseFloat(carValue)
    if (!value || value <= 0) return

    // Estimation formulas (simplified)
    const importFees = value * 0.025 // 2.5%
    const shipping = Math.min(2500, Math.max(1500, value * 0.015)) // $1500-2500
    const taxes = value * 0.1 // 10% estimated taxes
    const total = value + importFees + shipping + taxes

    const estimateData = {
      importFees: Math.round(importFees),
      shipping: Math.round(shipping),
      taxes: Math.round(taxes),
      total: Math.round(total)
    }

    setEstimate(estimateData)

    // Save to database
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      await supabase.from('cost_estimates').insert({
        user_id: user?.id || null,
        car_value: value,
        import_fees: estimateData.importFees,
        shipping_cost: estimateData.shipping,
        taxes: estimateData.taxes,
        total_cost: estimateData.total
      })
    } catch (error) {
      console.error('Error saving estimate:', error)
    } finally {
      setSaving(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-700/10 p-3 rounded-lg">
          <Calculator className="h-6 w-6 text-blue-700" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-black">Calculator Costuri</h3>
          <p className="text-blue-700">Obține o estimare instantanee pentru importul mașinii tale</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="carValue" className="block text-sm font-medium text-black mb-2">
            Valoarea Mașinii (EUR)
          </label>
          <div className="relative">
            <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-700 h-5 w-5" />
            <input
              type="number"
              id="carValue"
              value={carValue}
              onChange={(e) => setCarValue(e.target.value)}
              placeholder="50000"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent text-black placeholder-gray-400"
            />
          </div>
        </div>

        <Button 
          onClick={calculateEstimate}
          disabled={!carValue || parseFloat(carValue) <= 0 || saving}
          className="w-full"
        >
          {saving ? "Se salvează..." : "Calculează Estimarea"}
        </Button>

        {estimate && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="h-5 w-5 text-blue-700" />
              <h4 className="font-semibold text-black">Detaliere Costuri</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-black">Valoarea Mașinii</span>
                <span className="font-medium text-black">{formatCurrency(parseFloat(carValue))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Taxe Import</span>
                <span className="font-medium text-black">{formatCurrency(estimate.importFees)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Transport</span>
                <span className="font-medium text-black">{formatCurrency(estimate.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Taxe & Vamă</span>
                <span className="font-medium text-black">{formatCurrency(estimate.taxes)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-black">Estimare Totală</span>
                  <span className="text-lg font-bold text-blue-700">{formatCurrency(estimate.total)}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-700/5 p-4 rounded-lg">
              <p className="text-sm text-black">
                * Aceasta este o estimare calculată. Costurile finale pot varia în funcție de detaliile specifice ale vehiculului, 
                cursurile de schimb actuale și serviciile suplimentare.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}