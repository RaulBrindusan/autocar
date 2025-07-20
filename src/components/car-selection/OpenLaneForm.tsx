"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/Button"
import { Link2, ExternalLink, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { CarDataDisplay } from "./CarDataDisplay"

const openLaneSchema = z.object({
  url: z.string()
    .url("Te rugăm să introduci un URL valid")
    .refine((url) => url.includes("openlane") || url.includes("copart"), {
      message: "URL-ul trebuie să fie de la OpenLane sau Copart"
    }),
  additionalNotes: z.string().optional()
})

type OpenLaneData = z.infer<typeof openLaneSchema>

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

interface ApiResponse {
  success: boolean
  carData?: CarData
  warning?: string
  error?: string
}

export function OpenLaneForm() {
  const [carData, setCarData] = useState<CarData | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionError, setExtractionError] = useState<string | null>(null)
  const [warningMessage, setWarningMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<OpenLaneData>({
    resolver: zodResolver(openLaneSchema)
  })

  const urlValue = watch("url")

  const extractCarData = async (url: string) => {
    try {
      setIsExtracting(true)
      setExtractionError(null)
      setWarningMessage(null)
      setCarData(null)

      const response = await fetch('/api/scrape-openlane', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      })

      const data: ApiResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract car data')
      }

      if (data.success && data.carData) {
        setCarData(data.carData)
        if (data.warning) {
          setWarningMessage(data.warning)
        }
      } else {
        throw new Error(data.error || 'Failed to extract car data')
      }
    } catch (error) {
      console.error('Error extracting car data:', error)
      setExtractionError(error instanceof Error ? error.message : 'A apărut o eroare la extragerea datelor')
    } finally {
      setIsExtracting(false)
    }
  }

  const onSubmit = async (data: OpenLaneData) => {
    try {
      if (carData) {
        // Submit the car data along with the form data
        console.log('Submitting car request:', { ...data, carData })
        // TODO: Send to backend
        alert('Cererea ta a fost trimisă cu succes! Te vom contacta în curând.')
      } else {
        // Just extract the data first
        await extractCarData(data.url)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('A apărut o eroare. Te rugăm să încerci din nou.')
    }
  }

  return (
    <div>
      <div className="text-center mb-8">
        <Link2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Trimite Link OpenLane
        </h2>
        <p className="text-gray-600">
          Lipește link-ul de la OpenLane sau Copart pentru extragerea automată a datelor
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Cum funcționează:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Copiază link-ul anunțului de pe OpenLane sau Copart</li>
              <li>Lipește-l în câmpul de mai jos</li>
              <li>Apasă &ldquo;Extrage Date&rdquo; pentru a prelua informațiile automat</li>
              <li>Verifică datele și trimite cererea</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link OpenLane/Copart *
          </label>
          <div className="relative">
            <input
              type="url"
              {...register('url')}
              placeholder="https://openlane.com/listing/..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-700 text-black"
            />
            <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.url && (
            <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>
          )}
        </div>

        {/* Extract Data Button */}
        {urlValue && !carData && (
          <Button
            type="button"
            onClick={() => extractCarData(urlValue)}
            disabled={isExtracting || !!errors.url}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            {isExtracting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Se extrag datele...
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4 mr-2" />
                Extrage Date din Link
              </>
            )}
          </Button>
        )}

        {/* Extraction Error */}
        {extractionError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Eroare la extragerea datelor:</p>
                <p>{extractionError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Warning Message */}
        {warningMessage && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Atenție - Date Demo:</p>
                <p>{warningMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {carData && !warningMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <p className="font-medium">Datele au fost extrase cu succes!</p>
                <p>Verifică informațiile de mai jos și trimite cererea.</p>
              </div>
            </div>
          </div>
        )}

        {/* Display Extracted Car Data */}
        {carData && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <CarDataDisplay carData={carData} />
          </div>
        )}

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note Adiționale (opțional)
          </label>
          <textarea
            {...register('additionalNotes')}
            placeholder="Întrebări specifice, cerințe speciale pentru această mașină..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-700 text-black"
          />
        </div>

      </form>
    </div>
  )
}