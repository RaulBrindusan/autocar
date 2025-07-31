"use client"

import { LogOut, X } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface LogoutConfirmModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function LogoutConfirmModal({ isOpen, onConfirm, onCancel }: LogoutConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <LogOut className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Confirmare Deconectare
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Sigur vrei să te deconectezi? Vei fi redirecționat către pagina principală.
          </p>
          
          <div className="flex space-x-3 justify-end">
            <Button
              onClick={onCancel}
              variant="outline"
              className="px-6"
            >
              Nu
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 px-6"
            >
              Da, Deconectează-mă
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}