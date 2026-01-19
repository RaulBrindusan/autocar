'use client'

import { CarOrderForm } from '@/components/forms/CarOrderForm'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { Car, Shield, Clock, CheckCircle, TrendingUp, Award } from 'lucide-react'

/**
 * Mașini la Comandă Page
 *
 * SEO-optimized page for custom car orders from Europe.
 * Includes multi-step form and comprehensive information about the service.
 */
export default function MasiniLaComandaPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs for SEO */}
        <Breadcrumbs className="mb-6" />

        {/* Hero Section with H1 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Mașini la Comandă din Europa
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Comandă mașina perfectă din Germania, Italia, Franța sau alte țări europene.
            Completează formularul și primește oferte personalizate în maximum 24 de ore.
          </p>
        </div>

        {/* Benefits Section - SEO Content */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Garanție 12 Luni
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Toate mașinile importate beneficiază de garanție completă de 12 luni pentru liniștea ta.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Verificare Completă
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Fiecare vehicul este verificat tehnic complet înainte de import, cu raport detaliat.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Livrare Rapidă
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Transport rapid și sigur din Europa, cu livrare la ușa ta în 7-14 zile lucrătoare.
              </p>
            </div>
          </div>

          {/* SEO-rich content section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              De Ce Să Alegi AutoMode Pentru Import Auto?
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>AutoMode</strong> este specialist în importul de automobile premium din Europa de peste 5 ani.
                Oferim servicii complete de import auto personalizat pentru clienții din România care doresc să
                achiziționeze mașini de calitate la prețuri competitive.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
                Procesul Nostru Simplu și Transparent
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-4">
                <li><strong>Completezi formularul</strong> cu preferințele tale pentru mașina dorită</li>
                <li><strong>Primești oferte personalizate</strong> în maximum 24 de ore de la echipa noastră</li>
                <li><strong>Selectezi oferta preferată</strong> și discuți detaliile cu consultantul tău dedicat</li>
                <li><strong>Ne ocupăm de tot</strong> - sursare, verificare tehnică, transport și înmatriculare</li>
                <li><strong>Primești mașina</strong> la ușa ta cu toate documentele în regulă</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
                Mărci Disponibile
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Importăm toate mărcile premium și populare din Europa: <strong>BMW, Mercedes-Benz, Audi, Volkswagen,
                Porsche, Volvo, Tesla, Land Rover, Lexus, Toyota</strong> și multe altele. Indiferent dacă dorești
                un SUV spacios, un sedan elegant sau un coupe sportiv, te ajutăm să găsești mașina perfectă.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
                Siguranță și Transparență
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Toate mașinile sunt verificate cu <strong>raport de istoric complet</strong> (Carfax, AutoCheck),
                inspecție tehnică profesională și garanție de 12 luni. Prețurile noastre sunt transparente, fără
                costuri ascunse - calculatorul nostru îți arată exact toate cheltuielile.
              </p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Începe Procesul de Comandă
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Completează formularul în 4 pași simpli și primește ofertele tale personalizate
            </p>
          </div>

          <CarOrderForm />
        </div>

        {/* Additional SEO content */}
        <div className="bg-blue-600 dark:bg-blue-700 rounded-xl p-8 text-white text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Ai Întrebări?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Echipa noastră este aici să te ajute cu orice nelămurire. Contactează-ne telefonic sau
            pe WhatsApp pentru consultanță gratuită.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:+40770852489"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              📞 0770 852 489
            </a>
            <a
              href="https://wa.me/40770852489?text=Salut!%20Vreau%20sa%20comand%20o%20masina%20din%20Europa"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>

        {/* FAQ Section for SEO */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Întrebări Frecvente
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Cât durează procesul de import?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                De la momentul plății avansului până la livrarea mașinii la tine acasă durează în medie 2-3 săptămâni.
                Acest termen include găsirea mașinii potrivite, verificarea tehnică, transport și înmatriculare.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Care este avansul necesar?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Solicităm un avans de 20% din prețul total pentru a începe procesul de sursare și verificare a mașinii.
                Restul sumei se plătește înainte de livrare, după ce ai văzut toate documentele și fotografiile mașinii.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Ce include garanția de 12 luni?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Garanția acoperă toate componentele mecanice și electrice majore: motor, transmisie, sistem de frânare,
                suspensie, sistem electric și electronică. Reparațiile se efectuează la service-uri autorizate în România.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Pot vedea mașina înainte să o cumpăr?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Da! Îți trimitem raport foto și video complet al mașinii, plus raportul de verificare tehnică.
                Dacă dorești, poți veni personal în Europa să o vezi, sau putem organiza o inspecție suplimentară
                prin serviciul nostru de verificare.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
