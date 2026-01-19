'use client'

import { CarOrderForm } from '@/components/forms/CarOrderForm'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'

/**
 * Mașini la Comandă Page
 *
 * SEO-optimized page for custom car orders from Europe.
 * Includes multi-step form and comprehensive information about the service.
 */
export default function MasiniLaComandaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs for SEO */}
        <Breadcrumbs className="mb-6" />

        {/* Main Form */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Începe Procesul de Comandă
            </h2>
            <p className="text-gray-600">
              Completează formularul în 4 pași simpli și primește ofertele tale personalizate
            </p>
          </div>

          <CarOrderForm />
        </div>

        {/* Additional SEO content */}
        <div className="bg-blue-600 rounded-xl p-8 text-white text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Ai Întrebări?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Echipa noastră este aici să te ajute cu orice nelămurire. Contactează-ne
            pe WhatsApp pentru consultanță gratuită.
          </p>
          <div className="flex justify-center">
            <a
              href="https://wa.me/40770852489?text=Salut!%20Vreau%20sa%20comand%20o%20masina%20din%20Europa"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* FAQ Section for SEO */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Întrebări Frecvente
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cât durează procesul de import?
              </h3>
              <p className="text-gray-600">
                De la momentul plății avansului până la livrarea mașinii la tine acasă durează în medie 2-3 săptămâni.
                Acest termen include găsirea mașinii potrivite, verificarea tehnică, și transport.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Care este avansul necesar?
              </h3>
              <p className="text-gray-600">
                Solicităm un avans de 20% din prețul total pentru a începe procesul de licitare a mașinii.
                Restul sumei se plătește după câștigarea licitației în termen de 48 de ore.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ce include garanția de 12 luni?
              </h3>
              <p className="text-gray-600">
                Garanția acoperă toate componentele mecanice și electrice majore: motor, transmisie, sistem de frânare,
                suspensie, sistem electric și electronică.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Pot vedea mașina înainte să o cumpăr?
              </h3>
              <p className="text-gray-600">
                Da! Îți trimitem raport foto și video complet al mașinii, plus raportul de verificare tehnică.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
