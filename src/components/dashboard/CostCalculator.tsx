"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { useLanguage } from "@/contexts/LanguageContext"

export function CostCalculator() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<"fara-tva" | "cu-tva">("fara-tva")
  const [price, setPrice] = useState("")
  const [taxeOpenlane] = useState("450")
  const [transport, setTransport] = useState("")
  const [garantie] = useState("200")
  const [comision] = useState("500")

  const calculateTotal = () => {
    const priceNum = parseFloat(price) || 0
    const taxeNum = parseFloat(taxeOpenlane) || 0
    const vatNum = calculateVat()
    const transportNum = parseFloat(transport) || 0
    const garantieNum = parseFloat(garantie) || 0
    const comisionNum = parseFloat(comision) || 0
    
    return priceNum + taxeNum + vatNum + transportNum + garantieNum + comisionNum
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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">{t('calc.title')}</h2>
      
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
              {t('calc.tab.without_vat')}
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
              {t('calc.tab.with_vat')}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {activeTab === "fara-tva" && (
            <div className="space-y-4 pt-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-black mb-2">
                  {t('calc.price_label')}
                </label>
                <input
                  id="price"
                  type="number"
                  placeholder={t('calc.price_placeholder')}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-900 text-black"
                />
              </div>

              <div>
                <label htmlFor="taxe-openlane" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('calc.openlane_taxes')} (EUR)
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
                  {t('calc.vat')} (EUR)
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
                  {t('calc.transport_label')}
                </label>
                <input
                  id="transport"
                  type="number"
                  placeholder={t('calc.transport_placeholder')}
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-black text-black"
                />
              </div>

              <div>
                <label htmlFor="garantie" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('calc.warranty')} (EUR)
                </label>
                <input
                  id="garantie"
                  type="number"
                  value={garantie}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="comision" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('calc.commission')} (EUR)
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
                    <span className="text-lg font-semibold text-gray-900">{t('calc.total')}:</span>
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
                        <span className="text-sm font-medium text-gray-700">{t('calc.advance')}:</span>
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
                  {t('calc.price_label')}
                </label>
                <input
                  id="price-cu-tva"
                  type="number"
                  placeholder={t('calc.price_placeholder')}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-900 text-black"
                />
              </div>

              <div>
                <label htmlFor="taxe-openlane-cu-tva" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('calc.openlane_taxes')} (EUR)
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
                  placeholder="Introdu costul transportului"
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-black text-black"
                />
              </div>

              <div>
                <label htmlFor="garantie-cu-tva" className="block text-sm font-medium text-gray-700 mb-2">
                  Garanție (EUR)
                </label>
                <input
                  id="garantie-cu-tva"
                  type="number"
                  value={garantie}
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
                    <span className="text-lg font-semibold text-gray-900">{t('calc.total')}:</span>
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
                        <span className="text-sm font-medium text-gray-700">{t('calc.advance')}:</span>
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
    </div>
  )
}