"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/contexts/LanguageContext"
import { 
  Gift, 
  Car, 
  Calendar, 
  ExternalLink, 
  Check, 
  X, 
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import toast from "react-hot-toast"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Offer {
  id: string
  member_car_request_id: string
  link: string
  accepted: boolean | null
  sent_at: string
  responded_at: string | null
  member_car_requests: {
    id: string
    brand: string
    model: string
    year?: number
    fuel_type?: string
    transmission?: string
    max_budget: number
    budget_currency?: string
    contact_name: string
    contact_email: string
    contact_phone?: string
    status: string
    created_at: string
  }[]
}

export default function OfertePage() {
  const { t } = useLanguage()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [error, setError] = useState<string | null>(null)
  const [updatingOfferId, setUpdatingOfferId] = useState<string | null>(null)

  useEffect(() => {
    fetchUserAndOffers()
  }, [])

  const fetchUserAndOffers = async () => {
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        window.location.href = "/login"
        return
      }
      
      setUser(user)

      // Fetch offers directly using Supabase client
      const { data: offersData, error: offersError } = await supabase
        .from('offers')
        .select(`
          id,
          member_car_request_id,
          link,
          accepted,
          sent_at,
          responded_at,
          member_car_requests!inner (
            id,
            brand,
            model,
            year,
            fuel_type,
            transmission,
            max_budget,
            budget_currency,
            contact_name,
            contact_email,
            contact_phone,
            status,
            created_at,
            user_id
          )
        `)
        .eq('member_car_requests.user_id', user.id)
        .order('sent_at', { ascending: false })

      if (offersError) {
        console.error('Error fetching offers:', offersError)
        setError('Nu am putut încărca ofertele')
      } else {
        setOffers(offersData || [])
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('A apărut o eroare la încărcarea datelor')
    }
  }

  const handleOfferResponse = async (offerId: string, accepted: boolean) => {
    setUpdatingOfferId(offerId)
    
    try {
      const supabase = createClient()
      
      // Update the offer directly using Supabase client
      const { error } = await supabase
        .from('offers')
        .update({
          accepted,
          responded_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId)

      if (error) {
        console.error('Error updating offer:', error)
        toast.error("Nu am putut procesa răspunsul")
      } else {
        toast.success(accepted ? "Oferta a fost acceptată!" : "Oferta a fost refuzată!")
        
        // Update the offer in the state
        setOffers(prevOffers =>
          prevOffers.map(offer =>
            offer.id === offerId
              ? { ...offer, accepted, responded_at: new Date().toISOString() }
              : offer
          )
        )
      }
    } catch (error) {
      console.error("Error responding to offer:", error)
      toast.error("Eroare la procesarea răspunsului")
    } finally {
      setUpdatingOfferId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getOfferStatusColor = (offer: Offer) => {
    if (offer.accepted === null) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (offer.accepted === true) return 'bg-green-100 text-green-800 border-green-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const getOfferStatusText = (offer: Offer) => {
    if (offer.accepted === null) return 'În așteptare'
    if (offer.accepted === true) return 'Acceptată'
    return 'Refuzată'
  }

  const getOfferStatusIcon = (offer: Offer) => {
    if (offer.accepted === null) return <Clock className="h-4 w-4" />
    if (offer.accepted === true) return <Check className="h-4 w-4" />
    return <X className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Gift className="h-8 w-8 text-emerald-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Ofertele Mele</h1>
            </div>
            <p className="text-gray-600">
              Vizualizează și gestionează ofertele primite pentru cererile tale de mașini
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Oferte</p>
                  <p className="text-2xl font-bold text-gray-900">{offers.length}</p>
                </div>
                <Gift className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">În așteptare</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {offers.filter(o => o.accepted === null).length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Acceptate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {offers.filter(o => o.accepted === true).length}
                  </p>
                </div>
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Offers List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Lista Ofertelor ({offers.length})
              </h2>
            </div>

            {offers.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {offers.map((offer) => (
                  <div key={offer.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      {/* Car Info */}
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Car className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {offer.member_car_requests[0]?.brand} {offer.member_car_requests[0]?.model}
                            {offer.member_car_requests[0]?.year && ` ${offer.member_car_requests[0].year}`}
                          </h3>
                          <div className="flex items-center space-x-4 mt-1">
                            {offer.member_car_requests[0]?.fuel_type && (
                              <span className="text-sm text-gray-600">
                                {offer.member_car_requests[0].fuel_type}
                              </span>
                            )}
                            {offer.member_car_requests[0]?.transmission && (
                              <span className="text-sm text-gray-600">
                                {offer.member_car_requests[0].transmission}
                              </span>
                            )}
                            <span className="text-sm font-semibold text-green-600">
                              Buget: €{offer.member_car_requests[0]?.max_budget?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getOfferStatusColor(offer)}`}>
                          {getOfferStatusIcon(offer)}
                          <span className="ml-1">{getOfferStatusText(offer)}</span>
                        </span>
                      </div>
                    </div>

                    {/* Offer Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          Trimisă pe: {formatDate(offer.sent_at)}
                        </div>
                        {offer.responded_at && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            Răspuns pe: {formatDate(offer.responded_at)}
                          </div>
                        )}
                      </div>

                      {/* Offer Link */}
                      <div className="flex items-center justify-end space-x-3">
                        <Link
                          href={offer.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Vezi Oferta
                        </Link>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {offer.accepted === null && (
                      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                        <Button
                          onClick={() => handleOfferResponse(offer.id, false)}
                          disabled={updatingOfferId === offer.id}
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          {updatingOfferId === offer.id ? "Se procesează..." : "Refuză"}
                        </Button>
                        <Button
                          onClick={() => handleOfferResponse(offer.id, true)}
                          disabled={updatingOfferId === offer.id}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {updatingOfferId === offer.id ? "Se procesează..." : "Acceptă"}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="relative mx-auto mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
                    <Gift className="h-10 w-10 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nu ai oferte încă</h3>
                <p className="text-gray-500 mb-6">
                  Ofertele pentru cererile tale de mașini vor apărea aici.
                </p>
                <Link
                  href="/dashboard/cereri-masini"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Car className="h-4 w-4 mr-2" />
                  Creează o cerere
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}