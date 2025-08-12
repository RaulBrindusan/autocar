"use client"

import { createClient } from "@/lib/supabase/client"
import { redirect } from "next/navigation"
import { Car, FileText, FileCheck } from "lucide-react"
import { BenefitsSection } from "@/components/dashboard/BenefitsSection"
import { ProgressTracker } from "@/components/dashboard/ProgressTracker"
import { OnboardingModal } from "@/components/dashboard/OnboardingModal"
import { NotificationSystem } from "@/components/dashboard/NotificationSystem"
import { IdDocumentUpload } from "@/components/dashboard/IdDocumentUpload"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { UserProfile } from "@/lib/auth-utils"
import type { CarRequest } from "@/components/dashboard/ProgressTracker"

export default function DashboardPage() {
  const { t } = useLanguage()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [carRequestsCount, setCarRequestsCount] = useState(0)
  const [contractsCount, setContractsCount] = useState(0)
  const [offersCount, setOffersCount] = useState(0)
  const [lastContract, setLastContract] = useState<any>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [carRequest, setCarRequest] = useState<CarRequest | null>(null)
  const [idDocumentUploaded, setIdDocumentUploaded] = useState<boolean>(false)

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

      // Fetch user profile data
      const { data: profileData } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()

      setProfile(profileData)

      // Check document status from R2 storage
      try {
        const documentResponse = await fetch('/api/user/document-status')
        if (documentResponse.ok) {
          const documentData = await documentResponse.json()
          setIdDocumentUploaded(documentData.hasDocument)
        } else {
          // Fallback to database value if API fails
          setIdDocumentUploaded(profileData?.id_document_uploaded || false)
        }
      } catch (err) {
        console.error('Error checking document status:', err)
        // Fallback to database value if API fails
        setIdDocumentUploaded(profileData?.id_document_uploaded || false)
      }

      // Fetch user's car requests count and latest request for timeline
      const { count: carCount } = await supabase
        .from("car_requests")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id)

      setCarRequestsCount(carCount || 0)

      // Fetch the latest car request with timeline data
      const { data: carRequestData } = await supabase
        .from("car_requests")
        .select("id, brand, model, timeline_stage, timeline_updated_at, auction_result, auction_decided_at, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      setCarRequest(carRequestData)

      // Fetch user's contracts count and last contract
      const { count: contractCount } = await supabase
        .from("contracte")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id)

      setContractsCount(contractCount || 0)

      // Fetch last contract activity
      const { data: lastContractData } = await supabase
        .from("contracte")
        .select("id, contract_number, nume_prenume, data, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      setLastContract(lastContractData)

      // Fetch user's offers count directly using Supabase
      try {
        const { count } = await supabase
          .from('offers')
          .select('id', { count: 'exact', head: true })
          .eq('member_car_requests.user_id', user.id)

        setOffersCount(count || 0)
      } catch (err) {
        console.error('Error fetching offers count:', err)
      }

      // Check if user needs onboarding
      const onboardingCompleted = localStorage.getItem('onboardingCompleted')
      if (!onboardingCompleted && profile) {
        // Check if user is truly new (created within last 24 hours)
        const userCreatedAt = new Date(user.created_at)
        const now = new Date()
        const hoursSinceCreation = (now.getTime() - userCreatedAt.getTime()) / (1000 * 60 * 60)
        
        if (hoursSinceCreation < 24) {
          setShowOnboarding(true)
        }
      }
    }

    fetchData()
  }, [])

  const handleUploadComplete = async () => {
    // Refresh document status after upload
    try {
      const documentResponse = await fetch('/api/user/document-status')
      if (documentResponse.ok) {
        const documentData = await documentResponse.json()
        setIdDocumentUploaded(documentData.hasDocument)
      } else {
        // Just set to true as upload was successful
        setIdDocumentUploaded(true)
      }
    } catch (err) {
      console.error('Error refreshing document status:', err)
      // Just set to true as upload was successful
      setIdDocumentUploaded(true)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('dashboard.welcome')}, {profile?.full_name || user?.email}!
              </h1>
              <p className="text-gray-600 mt-2">
                {t('dashboard.subtitle')}
              </p>
            </div>
            
            {/* Notifications */}
            <div className="flex items-center space-x-4">
              <NotificationSystem />
            </div>
          </div>

          {/* ID Document Upload - Show only if not uploaded */}
          {!idDocumentUploaded && user && (
            <IdDocumentUpload 
              userId={user.id}
              onUploadComplete={handleUploadComplete}
            />
          )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          <div className="group bg-white rounded-2xl p-8 shadow-xl border border-gray-100/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl shadow-lg">
                  <Car className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t('dashboard.stats.active_requests')}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{carRequestsCount || 0}</p>
              </div>
            </div>
          </div>

          <Link href="/dashboard/oferte">
            <div className="group bg-white rounded-2xl p-8 shadow-xl border border-gray-100/50 hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <div className="flex items-center">
                <div className="relative">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-xl shadow-lg">
                    <FileText className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t('dashboard.stats.offers_received')}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{offersCount}</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/contracte">
            <div className="group bg-white rounded-2xl p-8 shadow-xl border border-gray-100/50 hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <div className="flex items-center">
                <div className="relative">
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-xl shadow-lg">
                    <FileCheck className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t('dashboard.stats.contracts')}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{contractsCount || 0}</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Progress Tracker */}
        <ProgressTracker carRequest={carRequest} />

        {/* Benefits Section */}
        <BenefitsSection />

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="group bg-white rounded-2xl p-8 shadow-xl border border-gray-100/50 hover:shadow-2xl transition-all duration-300 order-2 lg:order-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">
                  {(profile?.full_name || user?.email?.split('@')[0] || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 ml-4">{t('dashboard.account_info')}</h2>
            </div>
            <div className="space-y-6">
              <div className="group/item">
                <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t('dashboard.account_info.name')}</label>
                <p className="text-slate-800 font-medium mt-1 group-hover/item:text-violet-600 transition-colors">
                  {profile?.full_name || t('dashboard.account_info.not_set')}
                </p>
              </div>
              <div className="group/item">
                <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t('dashboard.account_info.email')}</label>
                <p className="text-slate-800 font-medium mt-1 group-hover/item:text-violet-600 transition-colors break-all">
                  {user?.email}
                </p>
              </div>
              <div className="group/item">
                <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t('dashboard.account_info.phone')}</label>
                <p className="text-slate-800 font-medium mt-1 group-hover/item:text-violet-600 transition-colors">
                  {profile?.phone || t('dashboard.account_info.not_set')}
                </p>
              </div>
              <div className="group/item">
                <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t('dashboard.account_info.member_since')}</label>
                <p className="text-slate-800 font-medium mt-1 group-hover/item:text-violet-600 transition-colors">
                  {new Date(profile?.created_at || user?.created_at || new Date()).toLocaleDateString('ro-RO')}
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-xl border border-gray-100/50 hover:shadow-2xl transition-all duration-300 order-1 lg:order-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileCheck className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 ml-4">{t('dashboard.recent_activity')}</h2>
            </div>
            {lastContract ? (
              <div className="space-y-4">
                <Link href="/dashboard/contracte" className="block group/link">
                  <div className="relative p-6 rounded-xl bg-gradient-to-r from-slate-50/50 to-blue-50/30 border border-slate-200/50 group-hover/link:from-blue-50/50 group-hover/link:to-indigo-50/50 group-hover/link:border-blue-200/50 transition-all duration-300 shadow-sm group-hover/link:shadow-md">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-3 rounded-lg shadow-md group-hover/link:shadow-lg transition-all duration-300">
                        <FileCheck className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-slate-800 group-hover/link:text-indigo-600 transition-colors">
                            {t('dashboard.recent_activity.contract')} #{lastContract.contract_number}
                          </h3>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                            lastContract.status === 'semnat' 
                              ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white'
                              : lastContract.status === 'draft'
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                              : 'bg-gradient-to-r from-slate-400 to-gray-500 text-white'
                          }`}>
                            {lastContract.status === 'semnat' ? t('dashboard.recent_activity.status.signed') : 
                             lastContract.status === 'draft' ? t('dashboard.recent_activity.status.draft') : lastContract.status}
                          </span>
                        </div>
                        <p className="text-slate-600 font-medium mb-1">
                          {t('dashboard.recent_activity.client')}: {lastContract.nume_prenume}
                        </p>
                        <p className="text-slate-600 mb-1">
                          {t('dashboard.recent_activity.contract_date')}: {new Date(lastContract.data).toLocaleDateString('ro-RO')}
                        </p>
                        <p className="text-xs text-slate-400">
                          {t('dashboard.recent_activity.created')}: {new Date(lastContract.created_at).toLocaleDateString('ro-RO')}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="relative mx-auto mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-inner">
                    <FileText className="h-10 w-10 text-slate-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-400/60 to-indigo-500/60 rounded-full animate-bounce opacity-60"></div>
                </div>
                <p className="text-slate-600 font-semibold text-lg mb-2">{t('dashboard.recent_activity.no_activity')}</p>
                <p className="text-slate-400">
                  {t('dashboard.recent_activity.contracts_appear_here')}
                </p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        userName={profile?.full_name || user?.email?.split('@')[0]}
      />
    </div>
  )
}