'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'

interface FormData {
  // Step 1: Contact Info
  fullName: string
  email: string
  phone: string

  // Step 2: Car Preferences
  brand: string
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
    setFormData(prev => ({ ...prev, [field]: value }))
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
      // TODO: Implement API call to submit form data
      // For now, just simulate submission
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('Form submitted:', formData)
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
        return formData.brand && formData.model && formData.yearMin
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Mulțumim pentru comandă!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Am primit cererea ta și echipa noastră te va contacta în curând cu oferte personalizate.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Ce urmează?</strong><br />
                În maximum 24 de ore vei primi un email cu cele mai bune oferte pentru mașina ta,
                adaptate exact preferințelor tale.
              </p>
            </div>
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step
                  )}
                </div>
                <span className="text-xs mt-2 text-gray-600 text-center hidden sm:block">
                  {step === 1 && 'Contact'}
                  {step === 2 && 'Preferințe'}
                  {step === 3 && 'Detalii'}
                  {step === 4 && 'Confirmare'}
                </span>
              </div>
              {step < 4 && (
                <div
                  className={`h-1 flex-1 mx-2 transition-colors ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {currentStep === 1 && 'Informații de Contact'}
              {currentStep === 2 && 'Preferințele Tale'}
              {currentStep === 3 && 'Buget și Detalii'}
              {currentStep === 4 && 'Confirmare Comandă'}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Contact Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nume Complet *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => updateFormData('fullName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ion Popescu"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ion.popescu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0712345678"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Car Preferences */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                    Marcă *
                  </label>
                  <select
                    id="brand"
                    required
                    value={formData.brand}
                    onChange={(e) => updateFormData('brand', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selectează marca</option>
                    {carBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                    Model *
                  </label>
                  <input
                    id="model"
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => updateFormData('model', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Seria 5, E-Class, A6"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="yearMin" className="block text-sm font-medium text-gray-700 mb-2">
                      An Fabricație (Minim) *
                    </label>
                    <select
                      id="yearMin"
                      required
                      value={formData.yearMin}
                      onChange={(e) => updateFormData('yearMin', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <label htmlFor="yearMax" className="block text-sm font-medium text-gray-700 mb-2">
                      An Fabricație (Maxim)
                    </label>
                    <select
                      id="yearMax"
                      value={formData.yearMax}
                      onChange={(e) => updateFormData('yearMax', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-2">
                      Tip Combustibil
                    </label>
                    <select
                      id="fuelType"
                      value={formData.fuelType}
                      onChange={(e) => updateFormData('fuelType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-2">
                      Transmisie
                    </label>
                    <select
                      id="transmission"
                      value={formData.transmission}
                      onChange={(e) => updateFormData('transmission', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <label htmlFor="budgetMin" className="block text-sm font-medium text-gray-700 mb-2">
                      Buget Minim (EUR) *
                    </label>
                    <input
                      id="budgetMin"
                      type="number"
                      required
                      min="0"
                      value={formData.budgetMin}
                      onChange={(e) => updateFormData('budgetMin', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="10000"
                    />
                  </div>

                  <div>
                    <label htmlFor="budgetMax" className="block text-sm font-medium text-gray-700 mb-2">
                      Buget Maxim (EUR) *
                    </label>
                    <input
                      id="budgetMax"
                      type="number"
                      required
                      min="0"
                      value={formData.budgetMax}
                      onChange={(e) => updateFormData('budgetMax', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="25000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mileageMax" className="block text-sm font-medium text-gray-700 mb-2">
                    Kilometraj Maxim (km)
                  </label>
                  <input
                    id="mileageMax"
                    type="number"
                    min="0"
                    value={formData.mileageMax}
                    onChange={(e) => updateFormData('mileageMax', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="150000"
                  />
                </div>

                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                    Culoare Preferată
                  </label>
                  <input
                    id="color"
                    type="text"
                    value={formData.color}
                    onChange={(e) => updateFormData('color', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Negru, Alb, Gri"
                  />
                </div>

                <div>
                  <label htmlFor="additionalRequirements" className="block text-sm font-medium text-gray-700 mb-2">
                    Cerințe Suplimentare
                  </label>
                  <textarea
                    id="additionalRequirements"
                    rows={4}
                    value={formData.additionalRequirements}
                    onChange={(e) => updateFormData('additionalRequirements', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Menționează orice alte cerințe sau preferințe (ex: pachet sport, interior piele, sistem audio premium, etc.)"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">Verifică Datele Tale:</h3>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Nume:</p>
                        <p className="font-medium">{formData.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email:</p>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Telefon:</p>
                      <p className="font-medium">{formData.phone}</p>
                    </div>

                    <hr className="my-4" />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Marcă:</p>
                        <p className="font-medium">{formData.brand}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Model:</p>
                        <p className="font-medium">{formData.model}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">An:</p>
                        <p className="font-medium">
                          {formData.yearMin}{formData.yearMax && ` - ${formData.yearMax}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Buget:</p>
                        <p className="font-medium">
                          €{formData.budgetMin} - €{formData.budgetMax}
                        </p>
                      </div>
                    </div>

                    {formData.fuelType && (
                      <div>
                        <p className="text-sm text-gray-600">Combustibil:</p>
                        <p className="font-medium">{formData.fuelType}</p>
                      </div>
                    )}

                    {formData.transmission && (
                      <div>
                        <p className="text-sm text-gray-600">Transmisie:</p>
                        <p className="font-medium">{formData.transmission}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    id="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => updateFormData('agreeToTerms', e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
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
            <div className="flex justify-between pt-6 border-t">
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
