'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  alt: string
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]))

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!images || images.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-96 bg-gray-200 flex items-center justify-center">
          <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    const nextIdx = (currentIndex + 1) % images.length
    setCurrentIndex(nextIdx)
    preloadAdjacentImages(nextIdx)
  }

  const previousImage = () => {
    const prevIdx = (currentIndex - 1 + images.length) % images.length
    setCurrentIndex(prevIdx)
    preloadAdjacentImages(prevIdx)
  }

  const preloadAdjacentImages = (index: number) => {
    const toPreload = [
      index,
      (index + 1) % images.length,
      (index - 1 + images.length) % images.length,
      (index + 2) % images.length,
    ]
    setLoadedImages(prev => {
      const newSet = new Set(prev)
      toPreload.forEach(idx => newSet.add(idx))
      return newSet
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') previousImage()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'Escape') setIsOpen(false)
  }

  const handleOpenLightbox = () => {
    setIsOpen(true)
    const allIndices = Array.from({ length: images.length }, (_, i) => i)
    setLoadedImages(new Set(allIndices))
  }

  return (
    <>
      {/* Main Image */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer" onClick={handleOpenLightbox}>
        <div className="relative w-full">
          <Image
            src={images[0]}
            alt={alt}
            width={800}
            height={600}
            className="w-full h-auto block"
            priority={true}
            quality={75}
            loading="eager"
            fetchPriority="high"
            placeholder="blur"
            blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
          />
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              +{images.length - 1} poze
            </div>
          )}
        </div>
      </div>

      {/* Preload images in background for faster lightbox */}
      {images.slice(1, 4).map((img, idx) => (
        <link key={idx} rel="prefetch" as="image" href={img} />
      ))}

      {/* Lightbox */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex flex-col items-center justify-center mb-0"
          onClick={() => setIsOpen(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          style={{ touchAction: 'none' }}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Închide galeria"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-lg font-medium z-10">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                previousImage()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Imaginea anterioară"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-full flex items-center justify-center px-16"
            style={{ height: images.length > 1 ? 'calc(100% - 112px)' : '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentIndex]}
              alt={`${alt} - Imaginea ${currentIndex + 1}`}
              width={1200}
              height={900}
              className="object-contain w-full h-full"
              quality={85}
              priority={true}
              loading="eager"
              placeholder="blur"
              blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
            />
          </div>

          {/* Hidden preload images */}
          {images.map((img, idx) => {
            if (idx === currentIndex) return null
            return (
              <div key={idx} className="hidden">
                <Image
                  src={img}
                  alt={`Preîncărcare ${idx}`}
                  width={1200}
                  height={900}
                  priority={true}
                  loading="eager"
                />
              </div>
            )
          })}

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Imaginea următoare"
            >
              <ChevronRight className="w-12 h-12" />
            </button>
          )}

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div
              className="absolute bottom-0 left-0 right-0 h-28 flex items-center px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex gap-2 overflow-x-auto overflow-y-hidden w-full pb-2 [&::-webkit-scrollbar]:hidden pt-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentIndex(index)
                      preloadAdjacentImages(index)
                    }}
                    className={`relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentIndex ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    style={{ width: 72, height: 72 }}
                  >
                    <Image
                      src={image}
                      alt={`Miniatură ${index + 1}`}
                      width={72}
                      height={72}
                      className="object-cover w-full h-full"
                      quality={50}
                      loading={index < 6 ? "eager" : "lazy"}
                      placeholder="blur"
                      blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
