'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getCar } from '@/lib/firebase/firestore'
import { getImagesFromFolderCached, getDownloadUrlFromPath } from '@/lib/firebase/storage'
import { Car } from '@/lib/types'
import { ImageGallery } from '@/components/ui/ImageGallery'

export default function CarDetailPage() {
  const router = useRouter()
  const params = useParams()
  const carId = params.id as string

  const [car, setCar] = useState<Car | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [reportUrl, setReportUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [initialLoad, setInitialLoad] = useState(true)
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
      setIsMobile(mobile)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        // Fetch car details first (fast)
        const { car: carData, error: carError } = await getCar(carId)
        if (carError || !carData) {
          setError('Mașina nu a fost găsită')
          setInitialLoad(false)
          return
        }
        setCar(carData)
        setInitialLoad(false)

        // IMMEDIATE: Show primary image instantly if available
        if (carData.imageUrl) {
          setImages([carData.imageUrl])
        }

        // BACKGROUND: Load gallery images after primary image is set
        setTimeout(async () => {
          let galleryImages: string[] = []

          // Use stored images array if available, otherwise fetch from folder with caching
          if (carData.images && carData.images.length > 0) {
            // Fast path: Use pre-stored image URLs from Firestore
            galleryImages = carData.images
          } else {
            // Fallback: Fetch from storage folder with session caching
            const folderImages = await getImagesFromFolderCached(`selling/${carId}`)
            if (folderImages.length > 0) {
              galleryImages = folderImages
            }
          }

          // Ensure primary image is always first, then add other images
          if (galleryImages.length > 0) {
            const finalImages: string[] = []

            // Always put primary image first if it exists
            if (carData.imageUrl) {
              finalImages.push(carData.imageUrl)

              // Add other images, avoiding duplicates
              galleryImages.forEach(img => {
                if (img !== carData.imageUrl && !finalImages.includes(img)) {
                  finalImages.push(img)
                }
              })
            } else {
              // No primary image, just use gallery images
              finalImages.push(...galleryImages)
            }

            setImages(finalImages)

            // PREFETCH: Preload all gallery images in background for instant lightbox
            finalImages.forEach(imgUrl => {
              const link = document.createElement('link')
              link.rel = 'prefetch'
              link.as = 'image'
              link.href = imgUrl
              document.head.appendChild(link)

              // Also create Image object to trigger browser cache
              const img = new Image()
              img.src = imgUrl
            })
          }
        }, 0)

        // BACKGROUND: Fetch report URL (non-blocking)
        if (carData.reportCV) {
          getDownloadUrlFromPath(carData.reportCV).then(url => {
            if (url) setReportUrl(url)
          })
        }
      } catch (err) {
        setError('A apărut o eroare la încărcarea datelor')
        setInitialLoad(false)
      }
    }

    fetchCarData()
  }, [carId])

  // Only show error state after initial load completes
  if (error && !initialLoad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
          <button
            onClick={() => router.push('/stoc')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Înapoi la Stoc
          </button>
        </div>
      </div>
    )
  }

  if (!car) return null

  return (
    <>
      {/* Preload primary image for instant display */}
      {images.length > 0 && (
        <link rel="preload" as="image" href={images[0]} fetchPriority="high" />
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Back Button */}
            <button
              onClick={() => router.push('/stoc')}
              className="mb-6 flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Înapoi la Stoc
            </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Image Gallery */}
            <div className="space-y-4">
              <ImageGallery images={images} alt={`${car.make} ${car.model}`} />

              {/* Report Button */}
              {reportUrl && (
                <button
                  onClick={() => setShowPdfViewer(true)}
                  className="block w-full bg-green-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Vezi Raportul CarVertical
                </button>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  {car.make} {car.model}
                </h1>

                {/* Specifications */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600 font-medium">An:</span>
                    <span className="text-gray-900">{car.year}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600 font-medium">Kilometri:</span>
                    <span className="text-gray-900">{car.km} km</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600 font-medium">Combustibil:</span>
                    <span className="text-gray-900">{car.fuel}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600 font-medium">Motor:</span>
                    <span className="text-gray-900">{car.engine}</span>
                  </div>
                  {car.transmisie && (
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-gray-600 font-medium">Transmisie:</span>
                      <span className="text-gray-900">{car.transmisie}</span>
                    </div>
                  )}
                  {car.echipare && (
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-gray-600 font-medium">Echipare:</span>
                      <span className="text-gray-900">{car.echipare}</span>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-gray-700 font-semibold">Preț:</span>
                    <span className="text-3xl text-blue-600 font-bold">{parseInt(car.askingprice).toLocaleString()} €</span>
                  </div>
                </div>

                {/* Contact Button */}
                <a
                  href={`https://wa.me/40770852489?text=Salut!%20Sunt%20interesat%20de%20${encodeURIComponent(car.make + ' ' + car.model)}.%20Pot%20primi%20mai%20multe%20detalii?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 block w-full bg-blue-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Contactează-ne: 0770852489
                </a>
              </div>
            </div>
          </div>

          {/* Dotări Section */}
          {car.dotari && (
            <div className="mt-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dotări</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {car.dotari.split('-').filter(item => item.trim()).map((item, index) => (
                    <div key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">{item.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {showPdfViewer && reportUrl && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full h-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-800 text-white flex-shrink-0">
              <h3 className="text-sm sm:text-lg font-semibold flex items-center truncate mr-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden sm:inline">Raport CarVertical - {car.make} {car.model}</span>
                <span className="sm:hidden">Raport CV</span>
              </h3>
              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                <a
                  href={reportUrl}
                  download
                  className="px-2 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden sm:inline">Descarcă</span>
                </a>
                <button
                  onClick={() => setShowPdfViewer(false)}
                  className="text-white hover:text-gray-300 transition-colors p-1 sm:p-2"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* PDF Viewer Content */}
            <div className="flex-1 overflow-auto bg-gray-100">
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(reportUrl)}&embedded=true`}
                className="w-full h-full border-0 bg-white"
                title="Raport CarVertical"
                style={{ minHeight: '600px' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
