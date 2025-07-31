"use client"

import { Trash2, X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface DeleteConfirmModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

export function DeleteConfirmModal({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title, 
  message, 
  confirmText = "Da, Șterge",
  cancelText = "Anulează"
}: DeleteConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {title}
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
            {message}
          </p>
          
          <div className="flex space-x-3 justify-end">
            <Button
              onClick={onCancel}
              variant="outline"
              className="px-6"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 px-6"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}