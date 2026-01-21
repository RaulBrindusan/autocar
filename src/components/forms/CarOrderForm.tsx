'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/firebase'

interface FormData {
  // Step 1: Contact Info
  fullName: string
  email: string
  phone: string

  // Step 2: Car Preferences
  brand: string
  customBrand: string
  model: string
  yearMin: string
  yearMax: string
  fuelType: string
  transmission: string

  // Step 3: Budget & Details
  budgetMin: string
  budgetMax: string
  mileageMax: string
  color: string
  additionalRequirements: string

  // Step 4: Confirmation
  agreeToTerms: boolean
}

const initialFormData: FormData = {
  fullName: '',
  email: '',
  phone: '',
  brand: '',
  customBrand: '',
  model: '',
  yearMin: '',
  yearMax: '',
  fuelType: '',
  transmission: '',
  budgetMin: '',
  budgetMax: '',
  mileageMax: '',
  color: '',
  additionalRequirements: '',
  agreeToTerms: false,
}

const carBrands = [
  'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Porsche',
  'Volvo', 'Tesla', 'Land Rover', 'Jaguar', 'Lexus',
  'Toyota', 'Honda', 'Mazda', 'Nissan', 'Ford',
  'Peugeot', 'Renault', 'Citroen', 'Skoda', 'Seat',
  'Alfa Romeo', 'Fiat', 'Mini', 'Hyundai', 'Kia',
  'Altă marcă'
]

const fuelTypes = [
  'Benzină',
  'Diesel',
  'Hibrid',
  'Electric',
  'Hibrid Plug-in',
  'Indiferent'
]

const transmissionTypes = [
  'Automată',
  'Manuală',
  'Indiferent'
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

export function CarOrderForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const totalSteps = 4

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    // Ensure string values are never undefined/null
    const safeValue = typeof value === 'string' ? (value ?? '') : value
    setFormData(prev => ({ ...prev, [field]: safeValue }))
  }

  // Format number with thousand separators (10000 -> 10.000)
  const formatNumber = (value: string): string => {
    if (!value) return ''
    const num = value.replace(/\./g, '')
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  // Remove formatting from number (10.000 -> 10000)
  const unformatNumber = (value: string): string => {
    return value.replace(/\./g, '')
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare data for submission
      const finalBrand = formData.brand === 'Altă marcă' ? formData.customBrand : formData.brand

      const requestData = {
        contact_name: formData.fullName,
        contact_email: formData.email,
        contact_phone: formData.phone,
        brand: finalBrand,
        model: formData.model,
        year: parseInt(formData.yearMin),
        max_budget: parseFloat(formData.budgetMax),
        preferred_color: formData.color || null,
        fuel_type: formData.fuelType || null,
        transmission: formData.transmission || null,
        mileage_max: formData.mileageMax ? parseInt(formData.mileageMax) : null,
        additional_requirements: formData.additionalRequirements || null,
        status: 'pending',
        timestamp: serverTimestamp(),
      }

      // Save directly to Firestore
      const carRequestsRef = collection(db, 'car_requests')
      await addDoc(carRequestsRef, requestData)

      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('A apărut o eroare. Vă rugăm să încercați din nou.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.email && formData.phone
      case 2:
        const brandValid = formData.brand !== 'Altă marcă'
          ? formData.brand
          : formData.customBrand
        return brandValid && formData.model && formData.yearMin
      case 3:
        return formData.budgetMin && formData.budgetMax
      case 4:
        return formData.agreeToTerms
      default:
        return false
    }
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4 transition-colors" style={{ color: 'var(--card-text)' }}>
              Mulțumim pentru comandă!
            </h2>
            <p className="text-lg mb-6 transition-colors" style={{ color: 'var(--card-subtext)' }}>
              Am primit cererea ta și echipa noastră te va contacta în curând cu oferte personalizate.
            </p>
            <Button onClick={() => window.location.href = '/'} size="lg">
              Înapoi la Pagina Principală
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors"
                  style={{
                    backgroundColor: step <= currentStep ? '#2563eb' : 'var(--step-inactive-bg)',
                    color: step <= currentStep ? '#ffffff' : 'var(--step-inactive-text)'
                  }}
                >
                  {step < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step
                  )}
                </div>
                <span
                  className="text-xs mt-2 text-center hidden sm:block transition-colors"
                  style={{ color: 'var(--card-text)' }}
                >
                  {step === 1 && 'Contact'}
                  {step === 2 && 'Preferințe'}
                  {step === 3 && 'Detalii'}
                  {step === 4 && 'Confirmare'}
                </span>
              </div>
              {step < 4 && (
                <div
                  className="h-1 flex-1 mx-2 transition-colors"
                  style={{
                    backgroundColor: step < currentStep ? '#2563eb' : 'var(--step-inactive-bg)'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="space-y-6 pt-6">
            {/* Step 1: Contact Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>
                    Nume Complet *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => updateFormData('fullName', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--input-text)'
                    }}
                    placeholder="Ion Popescu"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--input-text)'
                    }}
                    placeholder="ion.popescu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>
                    Telefon *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--input-text)'
                    }}
                    placeholder="0712345678"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Car Preferences */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>
                    Marcă *
                  </label>
                  <select
                    id="brand"
                    required
                    value={formData.brand}
                    onChange={(e) => updateFormData('brand', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--input-text)'
                    }}
                  >
                    <option value="">Selectează marca</option>
                    {carBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.brand === 'Altă marcă' && (
                  <div>
                    <label htmlFor="customBrand" className="block text-sm font-medium mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>
                      Specifică Marca *
                    </label>
                    <input
                      id="customBrand"
                      type="text"
                      required
                      value={formData.customBrand}
                      onChange={(e) => updateFormData('customBrand', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        borderColor: 'var(--input-border)',
                        color: 'var(--input-text)'
                      }}
                      placeholder="Ex: Dacia, Subaru, Mitsubishi"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="model" className="block text-sm font-medium mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>
                    Model *
                  </label>
                  <input
                    id="model"
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => updateFormData('model', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--input-text)'
                    }}
                    placeholder="Ex: Seria 5, E-Class, A6"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="yearMin" className="block text-sm font-medium mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>
                      An Fabricație (Minim) *
                    </label>
                    <select
                      id="yearMin"
                      required
                      value={formData.yearMin}
                      onChange={(e) => updateFormData('yearMin', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        borderColor: 'var(--input-border)',
                        color: 'var(--input-text)'
                      }}
                    >
                      <option value="">Selectează anul</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="yearMax" className="block text-sm font-medium mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>
                      An Fabricație (Maxim)
                    </label>
                    <select
                      id="yearMax"
                      value={formData.yearMax}
                      onChange={(e) => updateFormData('yearMax', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        borderColor: 'var(--input-border)',
                        color: 'var(--input-text)'
                      }}
                    >
                      <option value="">Selectează anul</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fuelType" className="block text-sm font-medium mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>
                      Tip Combustibil
                    </label>
                    <select
                      id="fuelType"
                      value={formData.fuelType}
                      onChange={(e) => updateFormData('fuelType', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        borderColor: 'var(--input-border)',
                        color: 'var(--input-text)'
                      }}
                    >
                      <option value="">Selectează tipul</option>
                      {fuelTypes.map((fuel) => (
                        <option key={fuel} value={fuel}>
                          {fuel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="transmission" className="block text-sm font-medium mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>
                      Transmisie
                    </label>
                    <select
                      id="transmission"
                      value={formData.transmission}
                      onChange={(e) => updateFormData('transmission', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        borderColor: 'var(--input-border)',
                        color: 'var(--input-text)'
                      }}
                    >
                      <option value="">Selectează tipul</option>
                      {transmissionTypes.map((trans) => (
                        <option key={trans} value={trans}>
                          {trans}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Budget & Details */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="budgetMin" className="block text-sm font-medium mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>
                      Buget Minim (EUR) *
                    </label>
                    <input
                      id="budgetMin"
                      type="text"
                      required
                      value={formatNumber(formData.budgetMin)}
                      onChange={(e) => {
                        const unformatted = unformatNumber(e.target.value)
                        if (/^\d*$/.test(unformatted)) {
                          updateFormData('budgetMin', unformatted)
                        }
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        borderColor: 'var(--input-border)',
                        color: 'var(--input-text)'
                      }}
                      placeholder="10.000"
                    />
                  </div>

                  <div>
                    <label htmlFor="budgetMax" className="block text-sm font-medium mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>
                      Buget Maxim (EUR) *
                    </label>
                    <input
                      id="budgetMax"
                      type="text"
                      required
                      value={formatNumber(formData.budgetMax)}
                      onChange={(e) => {
                        const unformatted = unformatNumber(e.target.value)
                        if (/^\d*$/.test(unformatted)) {
                          updateFormData('budgetMax', unformatted)
                        }
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        borderColor: 'var(--input-border)',
                        color: 'var(--input-text)'
                      }}
                      placeholder="25.000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mileageMax" className="block text-sm font-medium mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>
                    Kilometraj Maxim (km)
                  </label>
                  <input
                    id="mileageMax"
                    type="text"
                    value={formatNumber(formData.mileageMax)}
                    onChange={(e) => {
                      const unformatted = unformatNumber(e.target.value)
                      if (/^\d*$/.test(unformatted)) {
                        updateFormData('mileageMax', unformatted)
                      }
                    }}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--input-text)'
                    }}
                    placeholder="150.000"
                  />
                </div>

                <div>
                  <label htmlFor="color" className="block text-sm font-medium mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>
                    Culoare Preferată
                  </label>
                  <input
                    id="color"
                    type="text"
                    value={formData.color}
                    onChange={(e) => updateFormData('color', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--input-text)'
                    }}
                    placeholder="Ex: Negru, Alb, Gri"
                  />
                </div>

                <div>
                  <label htmlFor="additionalRequirements" className="block text-sm font-medium mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>
                    Cerințe Suplimentare
                  </label>
                  <textarea
                    id="additionalRequirements"
                    rows={4}
                    value={formData.additionalRequirements}
                    onChange={(e) => updateFormData('additionalRequirements', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--input-text)'
                    }}
                    placeholder="Menționează orice alte cerințe sau preferințe (ex: pachet sport, interior piele, sistem audio premium, etc.)"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="rounded-lg p-6 space-y-4 transition-colors" style={{ backgroundColor: 'var(--summary-bg)' }}>
                  <h3 className="font-semibold text-lg mb-4 transition-colors" style={{ color: 'var(--card-text)' }}>Verifică Datele Tale:</h3>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>Nume:</p>
                        <p className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>{formData.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>Email:</p>
                        <p className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>{formData.email}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>Telefon:</p>
                      <p className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>{formData.phone}</p>
                    </div>

                    <hr className="my-4 transition-colors" style={{ borderColor: 'var(--card-border)' }} />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>Marcă:</p>
                        <p className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>
                          {formData.brand === 'Altă marcă' ? formData.customBrand : formData.brand}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>Model:</p>
                        <p className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>{formData.model}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>An:</p>
                        <p className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>
                          {formData.yearMin}{formData.yearMax && ` - ${formData.yearMax}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>Buget:</p>
                        <p className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>
                          €{formatNumber(formData.budgetMin)} - €{formatNumber(formData.budgetMax)}
                        </p>
                      </div>
                    </div>

                    {formData.fuelType && (
                      <div>
                        <p className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>Combustibil:</p>
                        <p className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>{formData.fuelType}</p>
                      </div>
                    )}

                    {formData.transmission && (
                      <div>
                        <p className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>Transmisie:</p>
                        <p className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>{formData.transmission}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    id="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => updateFormData('agreeToTerms', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 flex-shrink-0 transition-colors"
                    style={{
                      borderColor: 'var(--input-border)',
                      backgroundColor: 'var(--input-bg)'
                    }}
                  />
                  <label htmlFor="agreeToTerms" className="text-sm transition-colors" style={{ color: 'var(--card-text)' }}>
                    Accept{' '}
                    <a href="/politica-de-confidentialitate" className="text-blue-600 hover:underline" target="_blank">
                      Politica de Confidențialitate
                    </a>{' '}
                    și sunt de acord ca AutoMode să mă contacteze cu oferte personalizate pentru mașina dorită.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t transition-colors" style={{ borderColor: 'var(--card-border)' }}>
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Înapoi
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Continuă
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!isStepValid() || isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? 'Se trimite...' : 'Trimite Comanda'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
