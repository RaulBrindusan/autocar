'use client'

import { CarOrderForm } from '@/components/forms/CarOrderForm'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'

export default function MasiniLaComandaPage() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const isDark = theme === 'dark'

  const faqs = [
    { q: t('masini_comanda.faq.q1.question'), a: t('masini_comanda.faq.q1.answer') },
    { q: t('masini_comanda.faq.q2.question'), a: t('masini_comanda.faq.q2.answer') },
    { q: t('masini_comanda.faq.q3.question'), a: t('masini_comanda.faq.q3.answer') },
    { q: t('masini_comanda.faq.q4.question'), a: t('masini_comanda.faq.q4.answer') },
  ]

  return (
    <div
      className="min-h-screen py-8 transition-colors"
      style={{ backgroundColor: isDark ? '#111827' : '#f9fafb' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs className="mb-6" />

        {/* Main Form */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2
              className="text-3xl font-bold mb-4 transition-colors"
              style={{ color: isDark ? '#ffffff' : '#111827' }}
            >
              {t('masini_comanda.title')}
            </h2>
            <p className="transition-colors" style={{ color: isDark ? '#d1d5db' : '#6b7280' }}>
              {t('masini_comanda.subtitle')}
            </p>
          </div>

          <CarOrderForm />
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 rounded-xl p-8 text-white text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">{t('masini_comanda.cta.title')}</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            {t('masini_comanda.cta.text')}
          </p>
          <div className="flex justify-center">
            <a
              href="https://wa.me/40770852489?text=Salut!%20Vreau%20sa%20comand%20o%20masina%20din%20Europa"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              {t('masini_comanda.cta.button')}
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div
          className="rounded-xl p-8 shadow-sm border transition-colors"
          style={{
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderColor: isDark ? '#374151' : '#e5e7eb',
          }}
        >
          <h2
            className="text-2xl font-bold mb-6 transition-colors"
            style={{ color: isDark ? '#ffffff' : '#111827' }}
          >
            {t('masini_comanda.faq.title')}
          </h2>
          <div className="space-y-6">
            {faqs.map(({ q, a }) => (
              <div key={q}>
                <h3
                  className="text-lg font-semibold mb-2 transition-colors"
                  style={{ color: isDark ? '#ffffff' : '#111827' }}
                >
                  {q}
                </h3>
                <p className="transition-colors" style={{ color: isDark ? '#d1d5db' : '#6b7280' }}>
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
