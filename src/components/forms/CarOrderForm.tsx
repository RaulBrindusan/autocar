'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/firebase'
import { useLanguage } from '@/contexts/LanguageContext'

interface FormData {
  fullName: string
  email: string
  phone: string
  brand: string
  customBrand: string
  model: string
  yearMin: string
  yearMax: string
  fuelType: string
  transmission: string
  budgetMin: string
  budgetMax: string
  mileageMax: string
  color: string
  additionalRequirements: string
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
]

// Internal value used for validation — kept in Romanian for Firestore consistency
const OTHER_BRAND = 'Altă marcă'

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

export function CarOrderForm() {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const totalSteps = 4

  // Fuel & transmission options — value stored in Firestore stays Romanian, label is translated
  const fuelOptions = [
    { value: 'Benzină',       label: t('car_order_form.fuel.benzina') },
    { value: 'Diesel',        label: t('car_order_form.fuel.diesel') },
    { value: 'Hibrid',        label: t('car_order_form.fuel.hibrid') },
    { value: 'Electric',      label: t('car_order_form.fuel.electric') },
    { value: 'Hibrid Plug-in',label: t('car_order_form.fuel.hibrid_plugin') },
    { value: 'Indiferent',    label: t('car_order_form.fuel.any') },
  ]

  const transmissionOptions = [
    { value: 'Automată',   label: t('car_order_form.transmission.automatic') },
    { value: 'Manuală',    label: t('car_order_form.transmission.manual') },
    { value: 'Indiferent', label: t('car_order_form.transmission.any') },
  ]

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    const safeValue = typeof value === 'string' ? (value ?? '') : value
    setFormData(prev => ({ ...prev, [field]: safeValue }))
  }

  const formatNumber = (value: string): string => {
    if (!value) return ''
    const num = value.replace(/\./g, '')
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const unformatNumber = (value: string): string => value.replace(/\./g, '')

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
      const finalBrand = formData.brand === OTHER_BRAND ? formData.customBrand : formData.brand

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

      const carRequestsRef = collection(db, 'car_requests')
      await addDoc(carRequestsRef, requestData)

      try {
        await fetch('/api/resend/car-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        })
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError)
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(t('car_order_form.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.email && formData.phone
      case 2:
        const brandValid = formData.brand !== OTHER_BRAND ? formData.brand : formData.customBrand
        return brandValid && formData.model && formData.yearMin
      case 3:
        return formData.budgetMin && formData.budgetMax
      case 4:
        return formData.agreeToTerms
      default:
        return false
    }
  }

  const stepLabels = [
    t('car_order_form.step1.label'),
    t('car_order_form.step2.label'),
    t('car_order_form.step3.label'),
    t('car_order_form.step4.label'),
  ]

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4 transition-colors" style={{ color: 'var(--card-text)' }}>
              {t('car_order_form.success.title')}
            </h2>
            <p className="text-lg mb-6 transition-colors" style={{ color: 'var(--card-subtext)' }}>
              {t('car_order_form.success.message')}
            </p>
            <Button onClick={() => window.location.href = '/'} size="lg">
              {t('car_order_form.success.back_home')}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const inputStyle = {
    backgroundColor: 'var(--input-bg)',
    borderColor: 'var(--input-border)',
    color: 'var(--input-text)',
  }

  const labelStyle = { color: 'var(--card-text)' }

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
                    color: step <= currentStep ? '#ffffff' : 'var(--step-inactive-text)',
                  }}
                >
                  {step < currentStep ? <CheckCircle className="w-6 h-6" /> : step}
                </div>
                <span
                  className="text-xs mt-2 text-center hidden sm:block transition-colors"
                  style={labelStyle}
                >
                  {stepLabels[step - 1]}
                </span>
              </div>
              {step < 4 && (
                <div
                  className="h-1 flex-1 mx-2 transition-colors"
                  style={{ backgroundColor: step < currentStep ? '#2563eb' : 'var(--step-inactive-bg)' }}
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
                  <label htmlFor="fullName" className="block text-sm font-medium mb-2 transition-colors" style={labelStyle}>
                    {t('car_order_form.full_name_label')}
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => updateFormData('fullName', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    style={inputStyle}
                    placeholder="Ion Popescu"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 transition-colors" style={labelStyle}>
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    style={inputStyle}
                    placeholder="ion.popescu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2 transition-colors" style={labelStyle}>
                    {t('car_order_form.phone_label')}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    style={inputStyle}
                    placeholder="0712345678"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Car Preferences */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium mb-2 transition-colors" style={labelStyle}>
                    {t('car_order_form.brand_label')}
                  </label>
                  <select
                    id="brand"
                    required
                    value={formData.brand}
                    onChange={(e) => updateFormData('brand', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    style={inputStyle}
                  >
                    <option value="">{t('car_order_form.brand_placeholder')}</option>
                    {carBrands.map((brand) => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                    <option value={OTHER_BRAND}>{t('car_order_form.other_brand')}</option>
                  </select>
                </div>

                {formData.brand === OTHER_BRAND && (
                  <div>
                    <label htmlFor="customBrand" className="block text-sm font-medium mb-2 transition-colors" style={labelStyle}>
                      {t('car_order_form.custom_brand_label')}
                    </label>
                    <input
                      id="customBrand"
                      type="text"
                      required
                      value={formData.customBrand}
                      onChange={(e) => updateFormData('customBrand', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={inputStyle}
                      placeholder={t('car_order_form.custom_brand_placeholder')}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="model" className="block text-sm font-medium mb-2 transition-colors" style={labelStyle}>
                    {t('car_order_form.model_label')}
                  </label>
                  <input
                    id="model"
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => updateFormData('model', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    style={inputStyle}
                    placeholder={t('car_order_form.model_placeholder')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="yearMin" className="block text-sm font-medium mb-2 transition-colors" style={labelStyle}>
                      {t('car_order_form.year_min_label')}
                    </label>
                    <select
                      id="yearMin"
                      required
                      value={formData.yearMin}
                      onChange={(e) => updateFormData('yearMin', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={inputStyle}
                    >
                      <option value="">{t('car_order_form.year_placeholder')}</option>
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="yearMax" className="block text-sm font-medium mb-2 transition-colors" style={labelStyle}>
                      {t('car_order_form.year_max_label')}
                    </label>
                    <select
                      id="yearMax"
                      value={formData.yearMax}
                      onChange={(e) => updateFormData('yearMax', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={inputStyle}
                    >
                      <option value="">{t('car_order_form.year_placeholder')}</option>
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fuelType" className="block text-sm font-medium mb-2 transition-colors" style={labelStyle}>
                      {t('car_order_form.fuel_label')}
                    </label>
                    <select
                      id="fuelType"
                      value={formData.fuelType}
                      onChange={(e) => updateFormData('fuelType', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={inputStyle}
                    >
                      <option value="">{t('car_order_form.fuel_placeholder')}</option>
                      {fuelOptions.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="transmission" className="block text-sm font-medium mb-2 transition-colors" style={labelStyle}>
                      {t('car_order_form.transmission_label')}
                    </label>
                    <select
                      id="transmission"
                      value={formData.transmission}
                      onChange={(e) => updateFormData('transmission', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={inputStyle}
                    >
                      <option value="">{t('car_order_form.transmission_placeholder')}</option>
                      {transmissionOptions.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
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
                    <label htmlFor="budgetMin" className="block text-sm font-medium mb-2 transition-colors" style={labelStyle}>
                      {t('car_order_form.budget_min_label')}
                    </label>
                    <input
                      id="budgetMin"
                      type="text"
                      required
                      value={formatNumber(formData.budgetMin)}
                      onChange={(e) => {
                        const unformatted = unformatNumber(e.target.value)
                        if (/^\d*$/.test(unformatted)) updateFormData('budgetMin', unformatted)
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={inputStyle}
                      placeholder="10.000"
                    />
                  </div>

                  <div>
                    <label htmlFor="budgetMax" className="block text-sm font-medium mb-2 transition-colors" style={labelStyle}>
                      {t('car_order_form.budget_max_label')}
                    </label>
                    <input
                      id="budgetMax"
                      type="text"
                      required
                      value={formatNumber(formData.budgetMax)}
                      onChange={(e) => {
                        const unformatted = unformatNumber(e.target.value)
                        if (/^\d*$/.test(unformatted)) updateFormData('budgetMax', unformatted)
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={inputStyle}
                      placeholder="25.000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mileageMax" className="block text-sm font-medium mb-2 transition-colors" style={labelStyle}>
                    {t('car_order_form.mileage_label')}
                  </label>
                  <input
                    id="mileageMax"
                    type="text"
                    value={formatNumber(formData.mileageMax)}
                    onChange={(e) => {
                      const unformatted = unformatNumber(e.target.value)
                      if (/^\d*$/.test(unformatted)) updateFormData('mileageMax', unformatted)
                    }}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    style={inputStyle}
                    placeholder="150.000"
                  />
                </div>

                <div>
                  <label htmlFor="color" className="block text-sm font-medium mb-2 transition-colors" style={labelStyle}>
                    {t('car_order_form.color_label')}
                  </label>
                  <input
                    id="color"
                    type="text"
                    value={formData.color}
                    onChange={(e) => updateFormData('color', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    style={inputStyle}
                    placeholder={t('car_order_form.color_placeholder')}
                  />
                </div>

                <div>
                  <label htmlFor="additionalRequirements" className="block text-sm font-medium mb-2 transition-colors" style={labelStyle}>
                    {t('car_order_form.requirements_label')}
                  </label>
                  <textarea
                    id="additionalRequirements"
                    rows={4}
                    value={formData.additionalRequirements}
                    onChange={(e) => updateFormData('additionalRequirements', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    style={inputStyle}
                    placeholder={t('car_order_form.requirements_placeholder')}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="rounded-lg p-6 space-y-4 transition-colors" style={{ backgroundColor: 'var(--summary-bg)' }}>
                  <h3 className="font-semibold text-lg mb-4 transition-colors" style={{ color: 'var(--card-text)' }}>
                    {t('car_order_form.review_title')}
                  </h3>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>{t('car_order_form.review.name')}</p>
                        <p className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>{formData.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>{t('car_order_form.review.email')}</p>
                        <p className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>{formData.email}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>{t('car_order_form.review.phone')}</p>
                      <p className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>{formData.phone}</p>
                    </div>

                    <hr className="my-4 transition-colors" style={{ borderColor: 'var(--card-border)' }} />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>{t('car_order_form.review.brand')}</p>
                        <p className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>
                          {formData.brand === OTHER_BRAND ? formData.customBrand : formData.brand}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>{t('car_order_form.review.model')}</p>
                        <p className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>{formData.model}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>{t('car_order_form.review.year')}</p>
                        <p className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>
                          {formData.yearMin}{formData.yearMax && ` - ${formData.yearMax}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>{t('car_order_form.review.budget')}</p>
                        <p className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>
                          €{formatNumber(formData.budgetMin)} - €{formatNumber(formData.budgetMax)}
                        </p>
                      </div>
                    </div>

                    {formData.fuelType && (
                      <div>
                        <p className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>{t('car_order_form.review.fuel')}</p>
                        <p className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>
                          {fuelOptions.find(o => o.value === formData.fuelType)?.label ?? formData.fuelType}
                        </p>
                      </div>
                    )}

                    {formData.transmission && (
                      <div>
                        <p className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>{t('car_order_form.review.transmission')}</p>
                        <p className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>
                          {transmissionOptions.find(o => o.value === formData.transmission)?.label ?? formData.transmission}
                        </p>
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
                    style={{ borderColor: 'var(--input-border)', backgroundColor: 'var(--input-bg)' }}
                  />
                  <label htmlFor="agreeToTerms" className="text-sm transition-colors" style={{ color: 'var(--card-text)' }}>
                    {t('car_order_form.terms_prefix')}
                    <a href="/politica-de-confidentialitate" className="text-blue-600 hover:underline" target="_blank">
                      {t('car_order_form.terms_link')}
                    </a>
                    {t('car_order_form.terms_suffix')}
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
                {t('car_order_form.back')}
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {t('car_order_form.continue')}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!isStepValid() || isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? t('car_order_form.submitting') : t('car_order_form.submit')}
                </Button>
              )}
            </div>

          </CardContent>
        </Card>
      </form>
    </div>
  )
}
