'use client'

import { Button } from "@/components/ui/Button"
import { useLanguage } from "@/contexts/LanguageContext"
import { Globe, ArrowRight, CheckCircle, Star, TrendingUp } from "lucide-react"
import Link from "next/link"


const benefits = [
  {
    key: 'better_prices',
    icon: TrendingUp,
    color: 'text-green-600'
  },
  {
    key: 'huge_selection',
    icon: Globe,
    color: 'text-blue-600'
  },
  {
    key: 'direct_access',
    icon: Star,
    color: 'text-yellow-600'
  }
]

export const InternationalAuctions = () => {
  const { t } = useLanguage()

  return (
    <section className="py-16 transition-colors" style={{ backgroundColor: 'var(--section-bg-alt)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 transition-colors" style={{ color: 'var(--section-text)' }}>
            {t('international_auctions.title')}
          </h2>
          <p className="text-lg max-w-3xl mx-auto transition-colors" style={{ color: 'var(--section-subtext)' }}>
            {t('international_auctions.subtitle')}
          </p>
        </div>

        {/* Platforms Section - Horizontal Layout */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-center mb-8 transition-colors" style={{ color: 'var(--section-text)' }}>
            {t('international_auctions.platforms.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* OpenLane with EU Flag */}
            <div className="relative p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              {/* EU Flag Badge */}
              <div className="absolute top-3 right-3">
                <svg className="w-10 h-7" viewBox="0 0 60 40">
                  <rect width="60" height="40" fill="#003399"/>
                  <g fill="#FFCC00">
                    <circle cx="30" cy="8" r="1.5"/>
                    <circle cx="35.5" cy="9.5" r="1.5"/>
                    <circle cx="39.5" cy="14" r="1.5"/>
                    <circle cx="40" cy="20" r="1.5"/>
                    <circle cx="39.5" cy="26" r="1.5"/>
                    <circle cx="35.5" cy="30.5" r="1.5"/>
                    <circle cx="30" cy="32" r="1.5"/>
                    <circle cx="24.5" cy="30.5" r="1.5"/>
                    <circle cx="20.5" cy="26" r="1.5"/>
                    <circle cx="20" cy="20" r="1.5"/>
                    <circle cx="20.5" cy="14" r="1.5"/>
                    <circle cx="24.5" cy="9.5" r="1.5"/>
                  </g>
                </svg>
              </div>
              <div className="text-blue-600 font-bold text-xl mb-2">OpenLane.eu</div>
              <p className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>
                Platformă europeană de licitații auto
              </p>
            </div>

            {/* IAAI with USA Flag */}
            <div className="relative p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              {/* USA Flag Badge */}
              <div className="absolute top-3 right-3">
                <svg className="w-10 h-7" viewBox="0 0 60 30">
                  <rect width="60" height="30" fill="#B22234"/>
                  <rect width="60" height="2.31" y="2.31" fill="white"/>
                  <rect width="60" height="2.31" y="6.92" fill="white"/>
                  <rect width="60" height="2.31" y="11.54" fill="white"/>
                  <rect width="60" height="2.31" y="16.15" fill="white"/>
                  <rect width="60" height="2.31" y="20.77" fill="white"/>
                  <rect width="60" height="2.31" y="25.38" fill="white"/>
                  <rect width="24" height="15" fill="#3C3B6E"/>
                </svg>
              </div>
              <div className="text-green-600 font-bold text-xl mb-2">IAAI.com</div>
              <p className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>
                Insurance Auto Auctions - SUA
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section - Horizontal Row */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-center mb-8 transition-colors" style={{ color: 'var(--section-text)' }}>
            {t('international_auctions.benefits.title')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit.key} className="flex flex-col items-center text-center p-4 rounded-xl border shadow-sm transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mb-3">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <div className="font-medium text-sm transition-colors" style={{ color: 'var(--card-text)' }}>
                  {t(`international_auctions.benefits.${benefit.key}`)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <a href="https://www.openlane.eu/en/home" target="_blank" rel="noopener noreferrer">
              {t('international_auctions.cta')} <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}