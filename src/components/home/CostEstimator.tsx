"use client"

import { useState } from "react"
import { Calculator } from "lucide-react"
// import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { trackCostCalculator } from "@/lib/umami"

export function CostEstimator() {
  const [carPrice, setCarPrice] = useState("")
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculateCosts = () => {
    const price = parseFloat(carPrice)
    if (isNaN(price) || price <= 0) {
      setError("Te rog introdu un preț valid")
      return
    }

    setError(null)
    
    // Rough estimation formula (these are example percentages)
    const importTax = price * 0.10 // 10% import tax
    const vat = price * 0.19 // 19% VAT
    const serviceFee = 500 // Fixed service fee
    const shipping = 800 // Estimated shipping
    const registration = 300 // Registration costs
    
    const total = price + importTax + vat + serviceFee + shipping + registration
    setEstimatedCost(total)
    
    // Track the cost calculation event
    trackCostCalculator.calculate({
      make: 'unknown',
      model: 'unknown', 
      price: price
    })
  }

  const saveEstimate = async () => {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured - cannot save estimate')
      return
    }

    if (!estimatedCost) return
    
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError("Trebuie să te conectezi pentru a salva estimarea")
        setLoading(false)
        return
      }

      const { error } = await supabase.from('cost_estimates').insert({
        user_id: user.id,
        car_price: parseFloat(carPrice),
        estimated_total: estimatedCost,
        created_at: new Date().toISOString()
      })

      if (error) {
        console.error('Error saving estimate:', error)
        setError("Nu am putut salva estimarea")
      } else {
        setError(null)
        alert("Estimarea a fost salvată!")
        
        // Track the save estimate event
        trackCostCalculator.saveEstimate({
          totalCost: estimatedCost,
          currency: 'EUR'
        })
      }
    } catch (err) {
      console.error('Error saving estimate:', err)
      setError("Nu am putut salva estimarea")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center mb-6">
        <Calculator className="h-6 w-6 text-blue-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">Calculator Costuri</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="car-price" className="block text-sm font-medium text-gray-700 mb-2">
            Prețul mașinii (EUR)
          </label>
          <input
            type="number"
            id="car-price"
            value={carPrice}
            onChange={(e) => setCarPrice(e.target.value)}
            placeholder="ex: 15000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-900"
          />
        </div>
        
        <Button 
          onClick={calculateCosts}
          className="w-full"
        >
          Calculează Costurile
        </Button>
        
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
        
        {estimatedCost && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Estimare Totală:</h4>
            <p className="text-2xl font-bold text-blue-600">
              €{estimatedCost.toLocaleString()}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              *Estimare aproximativă. Costurile finale pot varia.
            </p>
            
            <Button 
              onClick={saveEstimate}
              disabled={loading}
              variant="outline"
              className="mt-3 w-full"
            >
              {loading ? "Se salvează..." : "Salvează Estimarea"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}