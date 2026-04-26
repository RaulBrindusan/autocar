'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { onCarsSnapshot } from '@/lib/firebase/firestore'
import { Car } from '@/lib/types'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'

export default function StocPage() {
  const router = useRouter()
  const [cars, setCars] = useState<Car[]>([])
  const [initialLoad, setInitialLoad] = useState(true)
  const { theme } = useTheme()
  const { t } = useLanguage()
  const isDark = theme === 'dark'

  useEffect(() => {
    const unsubscribe = onCarsSnapshot((carsData) => {
      setCars(carsData)
      setInitialLoad(false)
    })
    return () => unsubscribe()
  }, [])

  const handleCarClick = (car: Car) => {
    const url = car.imageUrl
      ? `/stoc/${car.id}?img=${encodeURIComponent(car.imageUrl)}`
      : `/stoc/${car.id}`
    router.push(url)
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 transition-colors"
      style={{ background: isDark ? '#111827' : undefined }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 transition-colors"
            style={{ color: isDark ? '#ffffff' : '#111827' }}
          >
            {t('stoc.title')}
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto transition-colors"
            style={{ color: isDark ? '#d1d5db' : '#6b7280' }}
          >
            {t('stoc.subtitle')}
          </p>
        </div>

        {/* Cars Grid or Empty State */}
        {cars.length === 0 && !initialLoad ? (
          <div className="text-center py-20">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-colors"
              style={{ backgroundColor: isDark ? '#1f2937' : '#f3f4f6' }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: isDark ? '#9ca3af' : '#9ca3af' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3
              className="text-xl font-semibold mb-2 transition-colors"
              style={{ color: isDark ? '#ffffff' : '#111827' }}
            >
              {t('stoc.empty.title')}
            </h3>
            <p
              className="transition-colors"
              style={{ color: isDark ? '#d1d5db' : '#6b7280' }}
            >
              {t('stoc.empty.subtitle')}
            </p>
          </div>
        ) : cars.length > 0 ? (
          <div
            className={`grid gap-8 mx-auto ${
              cars.length === 1
                ? 'grid-cols-1 max-w-md'
                : cars.length === 2
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {cars.map((car) => (
              <div
                key={car.id}
                onClick={() => handleCarClick(car)}
                className="rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff' }}
              >
                {/* Car Image */}
                <div
                  className="relative h-48 transition-colors"
                  style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb' }}
                >
                  {car.imageUrl ? (
                    <Image
                      src={car.imageUrl}
                      alt={`${car.make} ${car.model}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality={75}
                      loading="eager"
                      priority={cars.indexOf(car) < 6}
                      placeholder="blur"
                      blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <svg
                        className="w-16 h-16"
                        style={{ color: isDark ? '#6b7280' : '#9ca3af' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Car Info */}
                <div className="p-6">
                  <h3
                    className="text-xl font-bold mb-2 transition-colors"
                    style={{ color: isDark ? '#ffffff' : '#111827' }}
                  >
                    {car.make} {car.model}
                  </h3>

                  <div className="space-y-2 mb-4">
                    {[
                      { icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: t('stoc.spec.year'), value: car.year },
                      { icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', label: t('stoc.spec.km'), value: `${car.km} km` },
                      { icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: t('stoc.spec.fuel'), value: car.fuel },
                      { icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4', label: t('stoc.spec.engine'), value: car.engine },
                    ].map(({ icon, label, value }) => (
                      <div
                        key={label}
                        className="flex items-center text-sm transition-colors"
                        style={{ color: isDark ? '#d1d5db' : '#6b7280' }}
                      >
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                        </svg>
                        <span className="font-medium">{label}:</span>
                        <span className="ml-1">{value}</span>
                      </div>
                    ))}

                    {car.transmisie && (
                      <div
                        className="flex items-center text-sm transition-colors"
                        style={{ color: isDark ? '#d1d5db' : '#6b7280' }}
                      >
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="font-medium">{t('stoc.spec.transmission')}:</span>
                        <span className="ml-1">{car.transmisie}</span>
                      </div>
                    )}
                    {car.echipare && (
                      <div
                        className="flex items-center text-sm transition-colors"
                        style={{ color: isDark ? '#d1d5db' : '#6b7280' }}
                      >
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{t('stoc.spec.equipment')}:</span>
                        <span className="ml-1">{car.echipare}</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div
                    className="border-t pt-4 transition-colors"
                    style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-medium transition-colors"
                        style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                      >
                        {t('stoc.price')}:
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {parseInt(car.askingprice).toLocaleString()} €
                      </span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    {t('stoc.view_details')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Banner */}
        {!initialLoad && (
          <div className="mt-16 rounded-2xl bg-blue-600 px-8 py-10 text-center text-white">
            <p className="text-xl font-semibold mb-4">
              {t('stoc.banner.text')}
            </p>
            <a
              href="https://wa.me/40770852489?text=Salut!%20Am%20v%C4%83zut%20stocul%20AutoMode%20și%20sunt%20interesat%20să%20comand%20o%20mașină."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              {t('stoc.banner.cta')}
            </a>
          </div>
        )}

      </div>
    </div>
  )
}
