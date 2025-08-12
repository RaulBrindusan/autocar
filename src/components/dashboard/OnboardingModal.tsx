"use client"

import { useState, useEffect } from "react"
import { X, ArrowRight, ArrowLeft, Car, Calculator, FileText, CheckCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  action?: {
    text: string
    href?: string
    onClick?: () => void
  }
  image?: string
}

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  userName?: string
}

export function OnboardingModal({ isOpen, onClose, userName }: OnboardingModalProps) {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: `Bun venit${userName ? `, ${userName}` : ''}!`,
      description: 'Îți mulțumim că ai ales AutoMode pentru importul mașinii tale din Europa. Te vom ghida prin toate caracteristicile platformei.',
      icon: Star,
      image: '/design1.png'
    },
    {
      id: 'car_requests',
      title: 'Comandă Mașina Dorită',
      description: 'Completează un formular simplu cu preferințele tale și noi vom căuta mașina perfectă în întreaga rețea europeană.',
      icon: Car,
      action: {
        text: 'Comandă Prima Mașină',
        href: '/dashboard/cereri-masini'
      },
      image: '/design2.png'
    },
    {
      id: 'calculator',
      title: 'Calculator Costuri',
      description: 'Calculează exact toate costurile de import: preț mașină, taxe, transport și comisioane. Cu sau fără TVA.',
      icon: Calculator,
      action: {
        text: 'Deschide Calculatorul',
        href: '/dashboard/calculator'
      }
    },
    {
      id: 'progress_tracking',
      title: 'Urmărește Progresul',
      description: 'Monitorizează în timp real progresul importului: căutare → găsire → negociere → cumpărare → transport → livrare.',
      icon: CheckCircle
    },
    {
      id: 'contracts',
      title: 'Contracte Digitale',
      description: 'Toate contractele tale sunt disponibile digital. Poți să le vezi, să le semnezi electronic și să le descarci oricând.',
      icon: FileText,
      action: {
        text: 'Vezi Contractele',
        href: '/dashboard/contracte'
      }
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    // Mark onboarding as completed
    localStorage.setItem('onboardingCompleted', 'true')
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const handleSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true')
    onClose()
  }

  const currentStepData = steps[currentStep]
  const Icon = currentStepData?.icon

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative min-h-full flex items-center justify-center p-4">
        <div 
          className={`relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Header */}
          <div className="relative">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={handleClose}
                className="p-2 bg-white/80 hover:bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
            {/* Left side - Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="text-center lg:text-left">
                {/* Step indicator */}
                <div className="flex items-center justify-center lg:justify-start mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                {/* Title and description */}
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  {currentStepData.title}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {currentStepData.description}
                </p>

                {/* Action button */}
                {currentStepData.action && (
                  <div className="mb-8">
                    {currentStepData.action.href ? (
                      <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                        <Link href={currentStepData.action.href} onClick={handleClose}>
                          {currentStepData.action.text}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button 
                        size="lg" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={currentStepData.action.onClick}
                      >
                        {currentStepData.action.text}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}

                {/* Step counter */}
                <div className="text-sm text-gray-500">
                  Pasul {currentStep + 1} din {steps.length}
                </div>
              </div>
            </div>

            {/* Right side - Visual */}
            <div className="hidden lg:block bg-gradient-to-br from-blue-50 to-indigo-100 relative">
              {currentStepData.image ? (
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <img 
                    src={currentStepData.image} 
                    alt={currentStepData.title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center">
                    <Icon className="h-24 w-24 text-blue-600/30" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <button
                  onClick={handleSkip}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                >
                  Omite ghidarea
                </button>
              </div>

              {/* Step indicators */}
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentStep 
                        ? 'bg-blue-600 w-6' 
                        : index <= currentStep 
                        ? 'bg-blue-300' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Înapoi
                </Button>
                
                {currentStep === steps.length - 1 ? (
                  <Button onClick={handleClose} className="bg-green-600 hover:bg-green-700">
                    Să începem!
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Următorul
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}