"use client"

import { useState } from "react"
import { User, Shield, Mail, Phone, Calendar, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import type { UserProfile } from "@/lib/auth-utils"

interface AdminAccountSectionProps {
  adminProfile: UserProfile
}

export function AdminAccountSection({ adminProfile }: AdminAccountSectionProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <>
      {/* Admin Account Button */}
      <Button 
        variant="outline" 
        className="h-auto p-4 flex-col relative"
        onClick={() => setShowDetails(true)}
      >
        <div className="bg-red-100 p-2 rounded-lg mb-2">
          <Shield className="h-6 w-6 text-red-600" />
        </div>
        <span className="text-sm font-medium">Cont Administrator</span>
        <span className="text-xs text-gray-500 mt-1">Vezi detalii</span>
      </Button>

      {/* Admin Account Modal/Overlay */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Cont Administrator</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(false)}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Admin Profile Picture */}
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {adminProfile.full_name || "Administrator"}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-2">
                  <Shield className="h-3 w-3 mr-1" />
                  Administrator
                </span>
              </div>

              {/* Admin Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-900">{adminProfile.email}</p>
                  </div>
                </div>

                {adminProfile.phone && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Telefon</p>
                      <p className="text-sm text-gray-900">{adminProfile.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Administrator din</p>
                    <p className="text-sm text-gray-900">
                      {new Date(adminProfile.created_at).toLocaleDateString('ro-RO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">ID Utilizator</p>
                    <p className="text-xs text-gray-600 font-mono">{adminProfile.id}</p>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Acțiuni Administrative</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Editează Profil Admin
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Schimbă Parolă
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowDetails(false)}>
                Închide
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}