'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Car, Star, ArrowRight, CheckCircle, Globe, Phone, Mail, Shield, Clock, Award, Users, MessageCircle, Handshake, DollarSign, FileText, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from 'next/navigation'
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema"
import { FAQSchema } from "@/components/seo/FAQSchema"
import { CarOrderForm } from "@/components/forms/CarOrderForm"
import { onCarsSnapshot } from '@/lib/firebase/firestore'
import { Car as CarType } from '@/lib/types'

// Car Carousel Component
const CarCarousel = ({ images, alt, badge }: { images: string[], alt: string, badge: string }) => {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 3500) // Change image every 3.5 seconds

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="h-56 relative overflow-hidden">
      {images.map((image, index) => (
        <Image
          key={index}
          src={image}
          alt={alt}
          fill
          className={`object-cover group-hover:scale-105 transition-all duration-500 ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900 dark:text-white transition-colors">
        {badge}
      </div>
    </div>
  )
}

export default function Home() {
  const { t } = useLanguage()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [cars, setCars] = useState<CarType[]>([])
  const [carsLoading, setCarsLoading] = useState(true)

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard')
    }
  }, [user, loading, router])

  useEffect(() => {
    // Subscribe to real-time updates from cars collection
    const unsubscribe = onCarsSnapshot((carsData) => {
      // Show all cars (both Stoc and Consignatie) and limit to 3
      const limitedCars = carsData.slice(0, 3)
      setCars(limitedCars)
      setCarsLoading(false)

      // Preload car images for instant display
      limitedCars.forEach((car) => {
        if (car.imageUrl) {
          const link = document.createElement('link')
          link.rel = 'preload'
          link.as = 'image'
          link.href = car.imageUrl
          link.fetchPriority = 'high'
          document.head.appendChild(link)

          // Also create native Image object to trigger browser cache
          if (typeof window !== 'undefined') {
            const img = new window.Image()
            img.src = car.imageUrl
          }
        }
      })
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  // FAQ data for structured data
  const faqData = [
    {
      question: t('faq.q1.question'),
      answer: t('faq.q1.answer')
    },
    {
      question: t('faq.q2.question'),
      answer: t('faq.q2.answer')
    },
    {
      question: t('faq.q3.question'),
      answer: t('faq.q3.answer')
    },
    {
      question: t('faq.q4.question'),
      answer: t('faq.q4.answer')
    },
    {
      question: t('faq.q5.question'),
      answer: t('faq.q5.answer')
    }
  ]

  return (
    <div className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Structured Data for SEO */}
      <LocalBusinessSchema />
      <FAQSchema faqs={faqData} />

      {/* Hero Section */}
      <section className="relative overflow-hidden transition-colors" style={{ backgroundColor: 'var(--hero-bg)', color: 'var(--hero-text)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[90vh] py-12">
            {/* Content */}
            <div className="text-left lg:pr-12">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 text-sm font-medium rounded-full transition-colors" style={{ backgroundColor: 'var(--info-tip-bg)', color: 'var(--info-tip-text)' }}>
                  {t('hero.badge')}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight transition-colors" style={{ color: 'var(--hero-text)' }}>
                {t('hero.title')}
                <span className="block text-blue-600 mt-2">{t('hero.title.highlight')}</span>
              </h1>
              <p className="text-lg sm:text-xl mb-8 leading-relaxed max-w-xl transition-colors" style={{ color: 'var(--hero-subtext)' }}>
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-row gap-4 mb-8 items-center justify-center sm:justify-start">
                <Button asChild size="lg" className="text-base px-6 py-4 h-14 font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap">
                  <Link href="/masini-la-comanda">{t('hero.cta.primary')}</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base px-6 py-4 h-14 font-semibold border-gray-300 text-black bg-white hover:bg-gray-50 hover:text-black transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap">
                  <Link href="/calculator">{t('hero.cta.secondary')}</Link>
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-500 dark:text-gray-400 transition-colors">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span>{t('hero.features.no_hidden_costs')}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span>{t('hero.features.full_warranty')}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span>{t('hero.features.fast_delivery')}</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative lg:h-[600px] h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-3xl transition-colors"></div>
              <Image
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Mașină europeană premium importată de AutoMode - BMW, Mercedes, Audi"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-cover rounded-3xl shadow-2xl"
                priority
              />
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 max-w-xs transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Car className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{t('hero.expert')}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t('hero.expert.subtitle')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Cars Section */}
      {!carsLoading && cars.length > 0 && (
        <section className="py-24 transition-colors" style={{ backgroundColor: 'var(--section-bg-alt)' }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 transition-colors" style={{ color: 'var(--section-text)' }}>
                Mașini Disponibile
              </h2>
              <p className="text-lg max-w-2xl mx-auto transition-colors" style={{ color: 'var(--section-subtext)' }}>
                Descoperă mașinile premium din stocul nostru și cele în consignație
              </p>
            </div>

            <div
              className={`grid gap-8 mx-auto ${
                cars.length === 1
                  ? 'grid-cols-1 max-w-md'
                  : cars.length === 2
                  ? 'grid-cols-1 md:grid-cols-2 max-w-4xl'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {cars.map((car) => {
                const profit = parseFloat(car.profit || '0')
                const profitColor = profit >= 0 ? 'text-green-600' : 'text-red-600'

                return (
                  <div
                    key={car.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                  >
                    {/* Car Image */}
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      {car.imageUrl ? (
                        <Image
                          src={car.imageUrl}
                          alt={`${car.make} ${car.model}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          quality={85}
                          priority
                          loading="eager"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Car className="w-20 h-20 text-gray-400" />
                        </div>
                      )}
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Car Details */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {car.make} {car.model}
                      </h3>

                      <div className="space-y-2.5 mb-5">
                        <div className="flex items-center text-gray-600">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-sm">
                            <span className="font-semibold text-gray-900">An:</span> {car.year}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                          </div>
                          <span className="text-sm">
                            <span className="font-semibold text-gray-900">Kilometraj:</span> {car.km} km
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <span className="text-sm">
                            <span className="font-semibold text-gray-900">Combustibil:</span> {car.fuel}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                          </div>
                          <span className="text-sm">
                            <span className="font-semibold text-gray-900">Motor:</span> {car.engine}
                          </span>
                        </div>

                        {car.transmisie && (
                          <div className="flex items-center text-gray-600">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </div>
                            <span className="text-sm">
                              <span className="font-semibold text-gray-900">Transmisie:</span> {car.transmisie}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Price Section */}
                      <div className="border-t border-gray-100 pt-5 mt-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-500">Preț:</span>
                          <span className="text-3xl font-bold text-blue-600">
                            {parseInt(car.askingprice).toLocaleString()} €
                          </span>
                        </div>

                        {/* View Details Button */}
                        <Link href={`/stoc/${car.id}`}>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg group-hover:bg-blue-700">
                            Vezi Detalii
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="py-24 transition-colors" style={{ backgroundColor: 'var(--section-bg-alt)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 transition-colors" style={{ color: 'var(--section-text)' }}>
              {t('how_it_works.title')}
            </h2>
            <p className="text-lg max-w-2xl mx-auto transition-colors" style={{ color: 'var(--section-subtext)' }}>
              {t('how_it_works.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative">
              <div className="rounded-2xl p-8 shadow-sm border text-center relative transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3 transition-colors" style={{ color: 'var(--card-text)' }}>{t('how_it_works.step1.title')}</h3>
                <p className="transition-colors" style={{ color: 'var(--card-subtext)' }}>{t('how_it_works.step1.description')}</p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 -translate-y-1/2 transition-colors" style={{ backgroundColor: 'var(--connector-line)' }}></div>
            </div>

            <div className="relative">
              <div className="rounded-2xl p-8 shadow-sm border text-center relative transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3 transition-colors" style={{ color: 'var(--card-text)' }}>{t('how_it_works.step2.title')}</h3>
                <p className="transition-colors" style={{ color: 'var(--card-subtext)' }}>{t('how_it_works.step2.description')}</p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 -translate-y-1/2 transition-colors" style={{ backgroundColor: 'var(--connector-line)' }}></div>
            </div>

            <div className="relative">
              <div className="rounded-2xl p-8 shadow-sm border text-center relative transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3 transition-colors" style={{ color: 'var(--card-text)' }}>{t('how_it_works.step3.title')}</h3>
                <p className="transition-colors" style={{ color: 'var(--card-subtext)' }}>{t('how_it_works.step3.description')}</p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 -translate-y-1/2 transition-colors" style={{ backgroundColor: 'var(--connector-line)' }}></div>
            </div>

            <div className="relative">
              <div className="rounded-2xl p-8 shadow-sm border text-center relative transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-bold">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-3 transition-colors" style={{ color: 'var(--card-text)' }}>{t('how_it_works.step4.title')}</h3>
                <p className="transition-colors" style={{ color: 'var(--card-subtext)' }}>{t('how_it_works.step4.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Car Order Form Section */}
      <section className="py-24 transition-colors" style={{ backgroundColor: 'var(--section-bg-alt)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 transition-colors" style={{ color: 'var(--section-text)' }}>
              {t('hero.cta.primary')}
            </h2>
            <p className="text-lg max-w-2xl mx-auto transition-colors" style={{ color: 'var(--section-subtext)' }}>
              Completează formularul în 4 pași simpli și primește ofertele tale personalizate
            </p>
          </div>

          <CarOrderForm />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 relative overflow-hidden transition-colors" style={{ backgroundColor: 'var(--section-bg-alt)' }}>
        {/* Background decoration */}
        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-5">
          <svg viewBox="0 0 400 400" className="w-full h-full text-gray-200">
            <path d="M0 300 L50 250 L100 300 L150 200 L200 250 L250 150 L300 200 L350 100 L400 150 L400 400 L0 400 Z" fill="currentColor" />
          </svg>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left side - Content */}
            <div className="text-left">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight transition-colors" style={{ color: 'var(--section-text)' }}>
                {t('why_choose.title')}
              </h2>
              <p className="text-lg mb-12 leading-relaxed max-w-xl transition-colors" style={{ color: 'var(--section-subtext)' }}>
                {t('why_choose.subtitle')}
              </p>
              
              {/* Main Image */}
              <div className="rounded-2xl overflow-hidden shadow-xl border transition-colors" style={{ borderColor: 'var(--card-border)' }}>
                <Image
                  src="/image11.jpg"
                  alt="Echipa AutoMode - Specialiști în consultanță auto și import automobile din Europa"
                  width={500}
                  height={300}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                  className="w-full h-[300px] object-cover"
                />
              </div>
            </div>

            {/* Right side - Benefits Grid */}
            <div className="space-y-4">
              {/* 12 Month Warranty */}
              <div className="rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-300" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>{t('why_choose.warranty.title')}</h3>
                    <p className="leading-relaxed transition-colors" style={{ color: 'var(--card-subtext)' }}>
                      {t('why_choose.warranty.description')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Car Report */}
              <div className="rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-300" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>{t('why_choose.report.title')}</h3>
                    <p className="leading-relaxed transition-colors" style={{ color: 'var(--card-subtext)' }}>
                      {t('why_choose.report.description')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Car Delivery */}
              <div className="rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-300" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Car className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>{t('why_choose.delivery.title')}</h3>
                    <p className="leading-relaxed transition-colors" style={{ color: 'var(--card-subtext)' }}>
                      {t('why_choose.delivery.description')}
                    </p>
                  </div>
                </div>
              </div>

              {/* RAR Registration */}
              <div className="rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-300" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>{t('why_choose.registration.title')}</h3>
                    <p className="leading-relaxed transition-colors" style={{ color: 'var(--card-subtext)' }}>
                      {t('why_choose.registration.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-24 transition-colors" style={{ backgroundColor: 'var(--section-bg-alt)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 transition-colors" style={{ color: 'var(--section-text)' }}>
              {t('featured_cars.title')}
            </h2>
            <p className="text-lg max-w-2xl mx-auto transition-colors" style={{ color: 'var(--section-subtext)' }}>
              {t('featured_cars.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* BMW Seria 5 */}
            <div className="group rounded-2xl overflow-hidden shadow-sm border hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <CarCarousel 
                images={[
                  '/car1/car1.jpeg',
                  '/car1/car2.jpeg',
                  '/car1/2.jpeg',
                  '/car1/4.jpeg',
                  '/car1/5.jpeg',
                  '/car1/6.jpeg',
                  '/car1/7.jpeg',
                  '/car1/8.jpeg'
                ]}
                alt="BMW Seria 5 518d M Sport"
                badge={t('featured_cars.badge.premium')}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>BMW Seria 5 518d M Sport</h3>
                <p className="mb-4 transition-colors" style={{ color: 'var(--card-subtext)' }}>Diesel - Automatic - 136 hp - 72.212 km</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">€28,000</span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-md">{t('featured_cars.details_button')}</Button>
                </div>
              </div>
            </div>

            {/* Mercedes-Benz S Long */}
            <div className="group rounded-2xl overflow-hidden shadow-sm border hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <CarCarousel 
                images={[
                  '/car2/1.jpeg',
                  '/car2/2.jpeg',
                  '/car2/3.jpeg',
                  '/car2/4.jpeg',
                  '/car2/5.jpeg',
                  '/car2/6.jpeg',
                  '/car2/7.jpeg',
                  '/car2/8.jpeg'
                ]}
                alt="Mercedes-Benz S Long 580e AMG Line"
                badge={t('featured_cars.badge.luxury')}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>Mercedes-Benz S 580e AMG Line</h3>
                <p className="mb-4 transition-colors" style={{ color: 'var(--card-subtext)' }}>Hibrid - Automatic - 367 hp - 8.172 km</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">€110,000</span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-md">{t('featured_cars.details_button')}</Button>
                </div>
              </div>
            </div>

            {/* Audi RS3 */}
            <div className="group rounded-2xl overflow-hidden shadow-sm border hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <CarCarousel 
                images={[
                  '/car3/1.jpeg',
                  '/car3/2.jpeg',
                  '/car3/3.jpeg',
                  '/car3/4.jpeg',
                  '/car3/5.jpeg',
                  '/car3/6.jpeg',
                  '/car3/7.jpeg',
                  '/car3/8.jpeg'
                ]}
                alt="Audi RS3 2.5 Quattro"
                badge={t('featured_cars.badge.performance')}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 transition-colors" style={{ color: 'var(--card-text)' }}>Audi RS3 2.5 Quattro</h3>
                <p className="mb-4 transition-colors" style={{ color: 'var(--card-subtext)' }}>Benzina - Automatic - 400 hp - 25.189 km</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">€54,000</span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-md">{t('featured_cars.details_button')}</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Estimator Section */}
      <section id="cost-estimator" className="py-24 relative overflow-hidden transition-colors" style={{ backgroundColor: 'var(--cost-estimator-bg)' }}>
        {/* Background decoration */}
        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-5">
          <svg viewBox="0 0 400 400" className="w-full h-full text-gray-200">
            <path d="M0 300 L50 250 L100 300 L150 200 L200 250 L250 150 L300 200 L350 100 L400 150 L400 400 L0 400 Z" fill="currentColor" />
          </svg>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 transition-colors" style={{ color: 'var(--section-text)' }}>
              {t('cost_estimator.title')}
            </h2>
            <p className="text-lg mb-8 transition-colors" style={{ color: 'var(--section-subtext)' }}>
              {t('cost_estimator.subtitle')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-8 w-8 text-blue-600 mb-3" />
                <span className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>{t('cost_estimator.feature1')}</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-8 w-8 text-blue-600 mb-3" />
                <span className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>{t('cost_estimator.feature2')}</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-8 w-8 text-blue-600 mb-3" />
                <span className="font-medium transition-colors" style={{ color: 'var(--card-text)' }}>{t('cost_estimator.feature3')}</span>
              </div>
            </div>

            <div className="flex justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <Link href="/calculator">
                  {t('cost_estimator.cta')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Consignatie Section */}
      <section className="py-24 relative overflow-hidden transition-colors" style={{ backgroundColor: 'var(--section-bg-alt)' }}>        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-colors" style={{ backgroundColor: 'var(--info-tip-bg)' }}>
              <Handshake className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 transition-colors" style={{ color: 'var(--section-text)' }}>
              {t('consignatie.title')}
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed transition-colors" style={{ color: 'var(--section-subtext)' }}>
              {t('consignatie.subtitle')}
            </p>
            <p className="text-lg max-w-4xl mx-auto leading-relaxed mb-12 transition-colors" style={{ color: 'var(--section-subtext)' }}>
              {t('consignatie.description')}
            </p>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <a href="https://wa.me/40770852489?text=Salut!%20Vreau%20să%20pun%20mașina%20mea%20în%20consignația%20AutoMode.%20Vă%20rog%20să%20mă%20contactați%20pentru%20o%20evaluare." target="_blank" rel="noopener noreferrer">
                <Handshake className="mr-2 h-5 w-5" />
                {t('consignatie.cta')}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Warranty Section */}
      <section className="py-24 text-white relative overflow-hidden transition-colors" style={{ backgroundColor: 'var(--warranty-bg)' }}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              {t('warranty.title')}
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('warranty.subtitle')}
            </p>
          </div>


          {/* Warranty Details */}
          <div className="backdrop-blur-sm p-8 lg:p-12 rounded-3xl border mb-12 transition-colors" style={{ backgroundColor: 'var(--warranty-card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6 transition-colors" style={{ color: 'var(--warranty-card-text)' }}>{t('warranty.what_includes.title')}</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="transition-colors" style={{ color: 'var(--warranty-card-subtext)' }}>{t('warranty.what_includes.mechanical')}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="transition-colors" style={{ color: 'var(--warranty-card-subtext)' }}>{t('warranty.what_includes.electrical')}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="transition-colors" style={{ color: 'var(--warranty-card-subtext)' }}>{t('warranty.what_includes.safety')}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="transition-colors" style={{ color: 'var(--warranty-card-subtext)' }}>{t('warranty.what_includes.support')}</span>
                  </div>
                </div>
              </div>

              <div className="text-center lg:text-left">
                <div className="p-8 rounded-2xl text-white" style={{ backgroundColor: '#6080F3' }}>
                  <div className="text-4xl font-bold mb-2">12</div>
                  <div className="text-xl font-semibold mb-4">{t('warranty.months')}</div>
                  <div className="text-blue-100 mb-6">
                    {t('warranty.months_description')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              {t('warranty.questions.title')}
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              {t('warranty.questions.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-blue-600 py-4 px-8 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl w-60 shadow-lg hover:bg-white hover:text-blue-600">
                <Link href="/masini-la-comanda" className="text-blue-600 hover:text-blue-600 whitespace-nowrap">
                  <Shield className="mr-2 h-5 w-5" />
                  {t('warranty.cta.primary')}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white bg-white/10 hover:bg-white/20 py-4 px-8 font-semibold transition-all duration-300 hover:scale-105 w-60 whitespace-nowrap">
                <a href="https://wa.me/40770852489?text=Salut!%20Sunt%20interesat%20de%20o%20masina%20importata%20cu%20garantie%20de%2012%20luni.%20Imi%20puteti%20oferi%20mai%20multe%20detalii?" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {t('warranty.cta.secondary')}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-24 transition-colors" style={{ backgroundColor: 'var(--section-bg-alt)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 transition-colors" style={{ color: 'var(--section-text)' }}>
              {t('faq.title')}
            </h2>
            <p className="text-lg max-w-2xl mx-auto transition-colors" style={{ color: 'var(--section-subtext)' }}>
              {t('faq.subtitle')}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-8 rounded-2xl border shadow-sm transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <h3 className="text-xl font-semibold mb-3 transition-colors" style={{ color: 'var(--card-text)' }}>
                {t('faq.q1.question')}
              </h3>
              <p className="leading-relaxed transition-colors" style={{ color: 'var(--card-subtext)' }}>
                {t('faq.q1.answer')}
              </p>
            </div>

            <div className="p-8 rounded-2xl border shadow-sm transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <h3 className="text-xl font-semibold mb-3 transition-colors" style={{ color: 'var(--card-text)' }}>
                {t('faq.q2.question')}
              </h3>
              <p className="leading-relaxed transition-colors" style={{ color: 'var(--card-subtext)' }}>
                {t('faq.q2.answer')}
              </p>
            </div>

            <div className="p-8 rounded-2xl border shadow-sm transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <h3 className="text-xl font-semibold mb-3 transition-colors" style={{ color: 'var(--card-text)' }}>
                {t('faq.q3.question')}
              </h3>
              <p className="leading-relaxed transition-colors" style={{ color: 'var(--card-subtext)' }}>
                {t('faq.q3.answer')}
              </p>
            </div>

            <div className="p-8 rounded-2xl border shadow-sm transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <h3 className="text-xl font-semibold mb-3 transition-colors" style={{ color: 'var(--card-text)' }}>
                {t('faq.q4.question')}
              </h3>
              <p className="leading-relaxed transition-colors" style={{ color: 'var(--card-subtext)' }}>
                {t('faq.q4.answer')}
              </p>
            </div>

            <div className="p-8 rounded-2xl border shadow-sm transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <h3 className="text-xl font-semibold mb-3 transition-colors" style={{ color: 'var(--card-text)' }}>
                {t('faq.q5.question')}
              </h3>
              <p className="leading-relaxed transition-colors" style={{ color: 'var(--card-subtext)' }}>
                {t('faq.q5.answer')}
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="py-24 transition-colors" style={{ backgroundColor: 'var(--section-bg-alt)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 transition-colors" style={{ color: 'var(--section-text)' }}>
              {t('testimonials.title')}
            </h2>
            <p className="text-lg max-w-2xl mx-auto transition-colors" style={{ color: 'var(--section-subtext)' }}>
              {t('testimonials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border shadow-sm transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="mb-6 leading-relaxed transition-colors" style={{ color: 'var(--card-text)' }}>
                &ldquo;{t('testimonials.review1')}&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">AP</span>
                </div>
                <div>
                  <div className="font-semibold transition-colors" style={{ color: 'var(--card-text)' }}>Adrian Popescu</div>
                  <div className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>BMW X3, 2022</div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl border shadow-sm transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="mb-6 leading-relaxed transition-colors" style={{ color: 'var(--card-text)' }}>
                &ldquo;{t('testimonials.review2')}&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">MI</span>
                </div>
                <div>
                  <div className="font-semibold transition-colors" style={{ color: 'var(--card-text)' }}>Maria Ionescu</div>
                  <div className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>Audi A6, 2021</div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl border shadow-sm transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="mb-6 leading-relaxed transition-colors" style={{ color: 'var(--card-text)' }}>
                &ldquo;{t('testimonials.review3')}&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">CG</span>
                </div>
                <div>
                  <div className="font-semibold transition-colors" style={{ color: 'var(--card-text)' }}>Cătălin Gheorghe</div>
                  <div className="text-sm transition-colors" style={{ color: 'var(--card-subtext)' }}>Mercedes E-Class, 2023</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/40770852489?text=Salut!%20Am%20vazut%20site-ul%20AutoMode%20si%20sunt%20interesat%20de%20serviciile%20voastre."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        aria-label="Contactează-ne pe WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          {t('whatsapp.tooltip')}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-700"></div>
        </div>
      </a>
    </div>
  )
}
