"use client"

import Image from "next/image"
import { Car, Calendar, Gauge, MapPin, User, Hash, AlertTriangle } from "lucide-react"

interface CarData {
  title: string
  make: string
  model: string
  year: number
  price: string
  mileage: string
  condition: string
  vin: string
  images: string[]
  description: string
  location: string
  seller: string
}

interface CarDataDisplayProps {
  carData: CarData
}

export function CarDataDisplay({ carData }: CarDataDisplayProps) {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {carData.title}
            </h3>
            <p className="text-gray-600">
              {carData.make} {carData.model} • {carData.year}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{carData.price}</p>
            <p className="text-sm text-gray-500">Preț estimat</p>
          </div>
        </div>
      </div>

      {/* Images */}
      {carData.images && carData.images.length > 0 && (
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Imagini</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {carData.images.slice(0, 6).map((image, index) => (
              <div key={index} className="relative h-32 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={image}
                  alt={`${carData.title} - Imagine ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Hide broken images
                    (e.target as HTMLElement).style.display = 'none'
                  }}
                />
              </div>
            ))}
          </div>
          {carData.images.length > 6 && (
            <p className="text-sm text-gray-500 mt-2">
              +{carData.images.length - 6} imagini suplimentare
            </p>
          )}
        </div>
      )}

      {/* Details Grid */}
      <div className="p-6 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Detalii Tehnice</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Car className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Marca & Model</p>
              <p className="text-sm text-gray-600">{carData.make} {carData.model}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Anul fabricației</p>
              <p className="text-sm text-gray-600">{carData.year}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Gauge className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Kilometraj</p>
              <p className="text-sm text-gray-600">{carData.mileage}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Starea</p>
              <p className="text-sm text-gray-600">{carData.condition}</p>
            </div>
          </div>

          {carData.vin && (
            <div className="flex items-center space-x-3">
              <Hash className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">VIN</p>
                <p className="text-sm text-gray-600 font-mono">{carData.vin}</p>
              </div>
            </div>
          )}

          {carData.location && (
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Locația</p>
                <p className="text-sm text-gray-600">{carData.location}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {carData.description && (
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Descriere</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {carData.description}
          </p>
        </div>
      )}

      {/* Seller Info */}
      {carData.seller && (
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Vânzător</p>
              <p className="text-sm text-gray-600">{carData.seller}</p>
            </div>
          </div>
        </div>
      )}

      {/* Warning */}
      <div className="bg-yellow-50 border-t border-yellow-200 p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Notă importantă:</p>
            <p>
              Aceste date au fost extrase automat din anunțul furnizat. 
              Te rugăm să le verifici cu atenție înainte de a trimite cererea. 
              Vom valida toate informațiile în procesul de import.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}