"use client"

import { useState, useEffect } from "react"
import { Bell, CheckCircle, AlertCircle, Info, X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
  timestamp: string
  read: boolean
  actionUrl?: string
  actionText?: string
  persistent?: boolean // For important notifications that shouldn't auto-dismiss
}

interface NotificationSystemProps {
  notifications?: Notification[]
  onMarkAsRead?: (notificationId: string) => void
  onMarkAllAsRead?: () => void
  onNotificationClick?: (notification: Notification) => void
}

// Demo notifications for testing
const demoNotifications: Notification[] = [
  {
    id: '1',
    title: 'Mașină găsită!',
    message: 'Am găsit o BMW Seria 5 perfectă pentru cererea ta. Verifică detaliile și confirmă interesul.',
    type: 'success',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
    actionUrl: '/dashboard/cereri-masini',
    actionText: 'Vezi detalii',
    persistent: true
  },
  {
    id: '2',
    title: 'Progres actualizat',
    message: 'Cererea ta pentru Audi A6 a trecut în etapa de negociere. Estimăm finalizarea în 3-5 zile.',
    type: 'info',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    read: false,
  },
  {
    id: '3',
    title: 'Document nou disponibil',
    message: 'Contractul pentru BMW X3 este gata pentru semnare electronică.',
    type: 'info',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
    actionUrl: '/dashboard/contracte',
    actionText: 'Semnează contract'
  }
]

export function NotificationSystem({ 
  notifications = demoNotifications, 
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick
}: NotificationSystemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setLocalNotifications(notifications)
  }, [notifications])

  const unreadCount = localNotifications.filter(n => !n.read).length

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50'
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'error':
        return 'border-l-red-500 bg-red-50'
      default:
        return 'border-l-blue-500 bg-blue-50'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    if (!mounted) return ''
    
    const now = new Date()
    const date = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'acum'
    if (diffInMinutes < 60) return `acum ${diffInMinutes}m`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `acum ${diffInHours}h`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `acum ${diffInDays}z`
    
    return date.toLocaleDateString('ro-RO')
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id)
      setLocalNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      )
    }
    
    if (onNotificationClick) {
      onNotificationClick(notification)
    }
  }

  const handleMarkAllAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead()
    }
    setLocalNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const dismissNotification = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setLocalNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  if (!mounted) {
    return (
      <div className="relative">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-gray-100 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notificări
                  {unreadCount > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      ({unreadCount} noi)
                    </span>
                  )}
                </h3>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Marchează toate ca citite
                  </Button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {localNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Nu ai notificări noi
                  </h4>
                  <p className="text-gray-600">
                    Îți vom arăta aici actualizări despre cererile tale.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {localNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors relative group ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm font-semibold ${
                                !notification.read ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                                {!notification.read && (
                                  <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                                )}
                              </p>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-400">
                                  {formatTimeAgo(notification.timestamp)}
                                </span>
                                
                                {notification.actionUrl && notification.actionText && (
                                  <Link 
                                    href={notification.actionUrl}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {notification.actionText}
                                    <ExternalLink className="ml-1 h-3 w-3" />
                                  </Link>
                                )}
                              </div>
                            </div>
                            
                            {!notification.persistent && (
                              <button
                                onClick={(e) => dismissNotification(notification.id, e)}
                                className="ml-2 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {localNotifications.length > 0 && (
              <div className="p-3 bg-gray-50 border-t border-gray-100 rounded-b-xl">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-center text-gray-600 hover:text-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  Închide notificările
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}