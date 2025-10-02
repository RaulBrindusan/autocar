"use client"

import { useState } from "react"
import Link from "next/link"
import { usePageTitle } from "@/hooks/usePageTitle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

export default function CalculatorPage() {
  usePageTitle("Calculator Import Auto | Calculează Costurile de Import")
  
  const [activeTab, setActiveTab] = useState<"fara-tva" | "cu-tva">("fara-tva")
  const [price, setPrice] = useState("")
  const [taxeOpenlane] = useState("450")
  const [transport] = useState("800")
  const [comision] = useState("500")

  const calculateTotal = () => {
    const priceNum = parseFloat(price) || 0
    const taxeNum = parseFloat(taxeOpenlane) || 0
    const vatNum = calculateVat()
    const transportNum = parseFloat(transport) || 0
    const comisionNum = parseFloat(comision) || 0

    return priceNum + taxeNum + vatNum + transportNum + comisionNum
  }

  const calculateVat = () => {
    const priceNum = parseFloat(price) || 0
    const taxeNum = parseFloat(taxeOpenlane) || 0
    return (priceNum + taxeNum) * 0.21
  }

  const calculateAdvance = () => {
    const priceNum = parseFloat(price) || 0
    return priceNum * 0.2
  }

  const total = calculateTotal()
  const advance = calculateAdvance()
  const calculatedVat = calculateVat()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Calculator Cost</h1>
          <p className="mt-2 text-gray-600">Calculează costurile pentru importul mașinii tale</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 border border-gray-200">
              <Button
                variant="ghost"
                onClick={() => setActiveTab("fara-tva")}
                className={`flex-1 border ${
                  activeTab === "fara-tva"
                    ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                    : "text-gray-700 border-transparent hover:bg-gray-50"
                }`}
              >
                Fără TVA
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab("cu-tva")}
                className={`flex-1 border ${
                  activeTab === "cu-tva"
                    ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                    : "text-gray-700 border-transparent hover:bg-gray-50"
                }`}
              >
                Cu TVA
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {activeTab === "fara-tva" && (
              <div className="space-y-4 pt-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-black mb-2">
                    Preț (EUR)
                  </label>
                  <input
                    id="price"
                    type="number"
                    placeholder="Introdu prețul"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-900 text-black"
                  />
                </div>

                <div>
                  <label htmlFor="taxe-openlane" className="block text-sm font-medium text-gray-700 mb-2">
                    Taxe OpenLane (EUR)
                  </label>
                  <input
                    id="taxe-openlane"
                    type="number"
                    value={taxeOpenlane}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Prețul este aproximativ deoarece diferă pentru fiecare țară
                  </p>
                </div>

                <div>
                  <label htmlFor="vat" className="block text-sm font-medium text-gray-700 mb-2">
                    TVA 21% (EUR)
                  </label>
                  <input
                    id="vat"
                    type="number"
                    value={calculatedVat.toFixed(2)}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-blue-50 text-blue-700 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    TVA se calculează pe baza prețului + taxe OpenLane (21%)
                  </p>
                </div>

                <div>
                  <label htmlFor="transport" className="block text-sm font-medium text-gray-700 mb-2">
                    Transport (EUR)
                  </label>
                  <input
                    id="transport"
                    type="number"
                    value={transport}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="comision" className="block text-sm font-medium text-gray-700 mb-2">
                    Comision (EUR)
                  </label>
                  <input
                    id="comision"
                    type="number"
                    value={comision}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div className="border-t pt-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-blue-600">
                        {price ? total.toFixed(2) : "0.00"} EUR
                      </span>
                    </div>
                    
                    {price && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Notă:</strong> Dacă doriți să continuați, avansul nostru este de 20% din prima sumă.
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Avans necesar (20%):</span>
                          <span className="text-lg font-bold text-orange-600">{advance.toFixed(2)} EUR</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "cu-tva" && (
              <div className="space-y-4 pt-4">
                <div>
                  <label htmlFor="price-cu-tva" className="block text-sm font-medium text-black mb-2">
                    Preț (EUR)
                  </label>
                  <input
                    id="price-cu-tva"
                    type="number"
                    placeholder="Introdu prețul"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-900 text-black"
                  />
                </div>

                <div>
                  <label htmlFor="taxe-openlane-cu-tva" className="block text-sm font-medium text-gray-700 mb-2">
                    Taxe OpenLane (EUR)
                  </label>
                  <input
                    id="taxe-openlane-cu-tva"
                    type="number"
                    value={taxeOpenlane}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Prețul este aproximativ deoarece diferă pentru fiecare țară
                  </p>
                </div>

                <div>
                  <label htmlFor="transport-cu-tva" className="block text-sm font-medium text-gray-700 mb-2">
                    Transport (EUR)
                  </label>
                  <input
                    id="transport-cu-tva"
                    type="number"
                    value={transport}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="comision-cu-tva" className="block text-sm font-medium text-gray-700 mb-2">
                    Comision (EUR)
                  </label>
                  <input
                    id="comision-cu-tva"
                    type="number"
                    value={comision}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div className="border-t pt-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-blue-600">
                        {price ? (total - calculatedVat).toFixed(2) : "0.00"} EUR
                      </span>
                    </div>
                    
                    {price && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Notă:</strong> Dacă doriți să continuați, avansul nostru este de 20% din prima sumă.
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Avans necesar (20%):</span>
                          <span className="text-lg font-bold text-orange-600">{advance.toFixed(2)} EUR</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Call to Action Section */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center shadow-xl">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-3">Gata să Îți Cumperi Mașina de Vis?</h3>
              <p className="text-blue-100 leading-relaxed">
                Acum că știi costurile exacte, creează-ți un cont gratuit și începe procesul de comandă. 
                Echipa noastră te va ghida pas cu pas spre mașina perfectă.
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button asChild size="lg" className="bg-gray-50 text-blue-700 hover:bg-gray-100 hover:text-blue-800 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <Link href="/signup">
                  Creează Cont Gratuit
                </Link>
              </Button>
            </div>
            
            <div className="mt-6 text-sm text-blue-200">
              ✓ Cont gratuit • ✓ Fără obligații • ✓ Suport personalizat
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}