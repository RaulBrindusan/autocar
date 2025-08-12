"use client"

import { useState, useEffect } from "react"
import { Search, Eye, Handshake, ShoppingCart, Truck, Package, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export interface ImportStage {
  id: string
  name: string
  status: 'completed' | 'current' | 'upcoming' | 'delayed'
  icon: React.ComponentType<{ className?: string }>
  estimatedDate?: string
  actualDate?: string
  description?: string
}

export interface CarRequest {
  id: string
  brand: string
  model: string
  timeline_stage: string
  timeline_updated_at?: string
  auction_result?: 'win' | 'lose' | null
  auction_decided_at?: string
  created_at: string
}

interface ProgressTrackerProps {
  carRequest?: CarRequest
  stages?: ImportStage[]
}

// Helper function for string interpolation
const interpolate = (template: string, values: Record<string, string | number>): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return values[key]?.toString() || match
  })
}

const getDefaultStages = (t: (key: string) => string): ImportStage[] => [
  {
    id: 'requested',
    name: t('progress.stages.requested'),
    status: 'completed',
    icon: Search,
    description: t('progress.stages.requested_desc'),
    actualDate: new Date().toISOString()
  },
  {
    id: 'searching',
    name: t('progress.stages.searching'),
    status: 'current',
    icon: Eye,
    description: t('progress.stages.searching_desc'),
    estimatedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // +3 days
  },
  {
    id: 'found',
    name: t('progress.stages.found'),
    status: 'upcoming',
    icon: CheckCircle,
    description: t('progress.stages.found_desc'),
    estimatedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // +7 days
  },
  {
    id: 'auction_time',
    name: t('progress.stages.auction_time'),
    status: 'upcoming',
    icon: Handshake,
    description: t('progress.stages.auction_time_desc'),
    estimatedDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() // +10 days
  },
  {
    id: 'purchased',
    name: t('progress.stages.purchased'),
    status: 'upcoming',
    icon: ShoppingCart,
    description: t('progress.stages.purchased_desc'),
    estimatedDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // +14 days
  },
  {
    id: 'in_transit',
    name: t('progress.stages.in_transit'),
    status: 'upcoming',
    icon: Truck,
    description: t('progress.stages.in_transit_desc'),
    estimatedDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString() // +21 days
  },
  {
    id: 'delivered',
    name: t('progress.stages.delivered'),
    status: 'upcoming',
    icon: Package,
    description: t('progress.stages.delivered_desc'),
    estimatedDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString() // +28 days
  }
]

export function ProgressTracker({ carRequest }: ProgressTrackerProps) {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // If no car request, don't show timeline
  if (!carRequest) {
    return null
  }

  if (!mounted) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  // Define all possible stages and their progression logic
  const allStages: Record<string, ImportStage> = {
    requested: {
      id: 'requested',
      name: t('progress.stages.requested'),
      status: 'completed',
      icon: Search,
      description: t('progress.stages.requested_desc'),
      actualDate: carRequest.created_at
    },
    searching: {
      id: 'searching',
      name: t('progress.stages.searching'),
      status: 'current',
      icon: Eye,
      description: t('progress.stages.searching_desc')
    },
    found: {
      id: 'found',
      name: t('progress.stages.found'),
      status: 'current',
      icon: CheckCircle,
      description: t('progress.stages.found_desc')
    },
    auction_time: {
      id: 'auction_time',
      name: t('progress.stages.auction_time'),
      status: 'current',
      icon: Handshake,
      description: t('progress.stages.auction_time_desc')
    },
    auction_won: {
      id: 'auction_won',
      name: t('progress.stages.auction_won'),
      status: 'current',
      icon: CheckCircle,
      description: t('progress.stages.auction_won_desc')
    },
    auction_lost: {
      id: 'auction_lost',
      name: t('progress.stages.auction_lost'),
      status: 'delayed',
      icon: AlertCircle,
      description: t('progress.stages.auction_lost_desc')
    },
    purchased: {
      id: 'purchased',
      name: t('progress.stages.purchased'),
      status: 'current',
      icon: ShoppingCart,
      description: t('progress.stages.purchased_desc')
    },
    purchase_failed: {
      id: 'purchase_failed',
      name: t('progress.stages.purchase_failed'),
      status: 'delayed',
      icon: AlertCircle,
      description: t('progress.stages.purchase_failed_desc')
    },
    in_transit: {
      id: 'in_transit',
      name: t('progress.stages.in_transit'),
      status: 'current',
      icon: Truck,
      description: t('progress.stages.in_transit_desc')
    },
    delivered: {
      id: 'delivered',
      name: t('progress.stages.delivered'),
      status: 'completed',
      icon: Package,
      description: t('progress.stages.delivered_desc')
    }
  }

  // Get current stage and determine next stage
  const currentStage = allStages[carRequest.timeline_stage]
  
  // Determine next visible stage based on current stage
  const getNextStage = (): ImportStage | null => {
    switch (carRequest.timeline_stage) {
      case 'requested':
        return { ...allStages.searching, status: 'upcoming' }
      case 'searching':
        return { ...allStages.found, status: 'upcoming' }
      case 'found':
        return { ...allStages.auction_time, status: 'upcoming' }
      case 'auction_time':
        return carRequest.auction_result === 'win' 
          ? { ...allStages.purchased, status: 'upcoming' }
          : carRequest.auction_result === 'lose'
          ? { ...allStages.auction_lost, status: 'upcoming' }
          : { ...allStages.auction_time, status: 'upcoming' }
      case 'auction_won':
        return { ...allStages.purchased, status: 'upcoming' }
      case 'auction_lost':
        return { ...allStages.searching, status: 'upcoming' }
      case 'purchased':
        return { ...allStages.in_transit, status: 'upcoming' }
      case 'purchase_failed':
        return { ...allStages.searching, status: 'upcoming' }
      case 'in_transit':
        return { ...allStages.delivered, status: 'upcoming' }
      case 'delivered':
        return null // Final stage
      default:
        return { ...allStages.searching, status: 'upcoming' }
    }
  }

  const nextStage = getNextStage()
  const visibleStages = [currentStage, nextStage].filter(Boolean)

  const getStageColor = (status: ImportStage['status']) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-green-100',
          icon: 'text-green-600',
          border: 'border-green-300'
        }
      case 'current':
        return {
          bg: 'bg-blue-100',
          icon: 'text-blue-600',
          border: 'border-blue-300'
        }
      case 'delayed':
        return {
          bg: 'bg-red-100',
          icon: 'text-red-600',
          border: 'border-red-300'
        }
      default: // upcoming
        return {
          bg: 'bg-gray-100',
          icon: 'text-gray-400',
          border: 'border-gray-200'
        }
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('ro-RO', { 
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    })
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('progress.title')} - {carRequest.brand} {carRequest.model}
        </h2>
        
        {/* Horizontal Timeline */}
        <div className="relative">
          {/* Connecting line */}
          {nextStage && (
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 -translate-y-0.5"></div>
          )}
          
          <div className="flex justify-between items-start">
            {visibleStages.map((stage, index) => {
              const colors = getStageColor(stage.status)
              const Icon = stage.icon

              return (
                <div key={stage.id} className="flex flex-col items-center max-w-xs">
                  {/* Icon circle */}
                  <div className={`
                    relative z-10 w-10 h-10 rounded-full border-2 ${colors.bg} ${colors.border}
                    flex items-center justify-center flex-shrink-0
                    transition-all duration-300
                  `}>
                    {stage.status === 'completed' ? (
                      <CheckCircle className={`h-5 w-5 ${colors.icon}`} />
                    ) : stage.status === 'delayed' ? (
                      <AlertCircle className={`h-5 w-5 ${colors.icon}`} />
                    ) : stage.status === 'current' ? (
                      <div className={`w-3 h-3 rounded-full bg-blue-600 animate-pulse`} />
                    ) : (
                      <Icon className={`h-5 w-5 ${colors.icon}`} />
                    )}
                  </div>

                  {/* Stage info */}
                  <div className="mt-4 text-center">
                    <h3 className={`font-semibold text-sm mb-2 ${
                      stage.status === 'completed' ? 'text-green-900' :
                      stage.status === 'current' ? 'text-blue-900' :
                      stage.status === 'delayed' ? 'text-red-900' :
                      'text-gray-600'
                    }`}>
                      {stage.name}
                    </h3>
                    
                    {stage.description && (
                      <p className="text-gray-600 text-xs mb-2 leading-relaxed">
                        {stage.description}
                      </p>
                    )}
                    
                    {/* Status badge */}
                    {stage.status === 'current' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Clock className="w-3 h-3 mr-1" />
                        {t('progress.status.in_progress')}
                      </span>
                    )}
                    {stage.status === 'delayed' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {t('progress.status.delayed')}
                      </span>
                    )}
                    {stage.status === 'completed' && stage.actualDate && (
                      <div className="text-xs text-green-600 font-medium">
                        {formatDate(stage.actualDate)}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Current stage details */}
      {currentStage && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                {interpolate(t('progress.current_stage'), { stage: currentStage.name })}
              </h4>
              <p className="text-sm text-blue-700 mb-2">
                {currentStage.description}
              </p>
              <p className="text-xs text-blue-600">
                {t('progress.notification_text')}
              </p>
              {carRequest.timeline_updated_at && (
                <p className="text-xs text-gray-500 mt-2">
                  {t('progress.last_updated')}: {formatDate(carRequest.timeline_updated_at)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}