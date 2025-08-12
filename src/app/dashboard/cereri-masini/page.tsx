"use client"

import { createClient } from "@/lib/supabase/client"
import { CarSelectionForm } from "@/components/car-selection/CarSelectionForm"
import { useLanguage } from "@/contexts/LanguageContext"
import { useState, useEffect } from "react"

export default function CereriMasiniPage() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [carRequests, setCarRequests] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = "/login"
        return
      }

      setUser(user)

      // Fetch user's car requests
      const { data: requests, error } = await supabase
        .from("member_car_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (requests) {
        setCarRequests(requests)
      }
    }

    fetchData()
  }, [])


  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">


        {/* Car Selection Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">{t('car_requests.new_order')}</h2>
            <p className="text-gray-600 mt-1">{t('car_requests.form_description')}</p>
          </div>
          <div className="p-8">
            <CarSelectionForm />
          </div>
        </div>

        {/* Car Requests List */}
        {carRequests && carRequests.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="divide-y divide-gray-100">
              {carRequests.map((request) => (
                <div key={request.id} className="p-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.brand} {request.model}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">{t('car_requests.year')}:</span> {request.year || t('car_requests.not_specified')}
                      </div>
                      <div>
                        <span className="font-medium">{t('car_requests.max_budget')}:</span> {request.max_budget ? `€${request.max_budget.toLocaleString()}` : t('car_requests.not_specified')}
                      </div>
                      <div>
                        <span className="font-medium">{t('car_requests.fuel_type')}:</span> {request.fuel_type || t('car_requests.not_specified')}
                      </div>
                    </div>
                    
                    {request.additional_notes && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">{t('car_requests.additional_requirements')}:</span> {request.additional_notes}
                      </div>
                    )}
                    
                    <div className="mt-3 text-xs text-gray-500">
                      {t('car_requests.created_on')} {new Date(request.created_at).toLocaleDateString('ro-RO')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}