"use client"

import { useState, useEffect } from "react"
import { Shield, Award, Truck, FileCheck, X } from "lucide-react"

export function BenefitsSection() {
  const [isVisible, setIsVisible] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedVisibility = localStorage.getItem('benefitsVisible')
    if (savedVisibility !== null) {
      setIsVisible(savedVisibility === 'true')
    }
  }, [])

  const handleHide = () => {
    setIsVisible(false)
    localStorage.setItem('benefitsVisible', 'false')
  }

  const handleShow = () => {
    setIsVisible(true)
    localStorage.setItem('benefitsVisible', 'true')
  }

  if (!mounted) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 text-center flex-1">
            Beneficiile Serviciilor Automode
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Loading placeholder */}
          <div className="animate-pulse">
            <div className="bg-gray-200 w-16 h-16 rounded-full mx-auto mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-3 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!isVisible) {
    return (
      <div className="mb-8 flex justify-end">
        <button
          onClick={handleShow}
          className="text-sm text-blue-600 hover:text-blue-800 underline transition-colors"
        >
          Afișează beneficii
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 text-center flex-1">
          Beneficiile Serviciilor Automode
        </h2>
        <button
          onClick={handleHide}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Garanție 12 Luni</h3>
          <p className="text-sm text-gray-600">
            Toate vehiculele importate beneficiază de garanție completă de 12 luni pentru siguranța ta.
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Dealeri Verificați</h3>
          <p className="text-sm text-gray-600">
            Colaborăm doar cu dealeri de încredere din Europa, verificați și autorizați oficial.
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Livrare la Domiciliu</h3>
          <p className="text-sm text-gray-600">
            Vehiculul tău va fi livrat direct la adresa dorită, fără costuri suplimentare de transport.
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileCheck className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Înmatriculare RAR</h3>
          <p className="text-sm text-gray-600">
            Ne ocupăm de toată documentația și procesul de înmatriculare la RAR pentru tine.
          </p>
        </div>
      </div>
    </div>
  )
}