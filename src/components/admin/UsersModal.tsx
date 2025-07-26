'use client'

import { useState, useEffect } from 'react'
import { X, User, Mail, Phone, Shield, Save, Trash2, Edit, Plus, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { z } from 'zod'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
  car_requests_count?: number
  cost_estimates_count?: number
  openlane_submissions_count?: number
}

interface UsersModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'view' | 'create' | 'edit'
  user: User | null
  onUserUpdated: () => void
}

// Validation schema
const userSchema = z.object({
  email: z.string().email('Email invalid'),
  full_name: z.string().min(1, 'Numele este obligatoriu'),
  phone: z.string().optional(),
  role: z.enum(['user', 'admin'])
})

type UserFormData = z.infer<typeof userSchema>

export function UsersModal({ isOpen, onClose, mode, user, onUserUpdated }: UsersModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    full_name: '',
    phone: '',
    role: 'user'
  })
  const [formErrors, setFormErrors] = useState<Partial<UserFormData>>({})

  const supabase = createClient()

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (mode === 'view' && user) {
        setFormData({
          email: user.email,
          full_name: user.full_name || '',
          phone: user.phone || '',
          role: user.role
        })
        setIsEditing(false)
      } else if (mode === 'edit' && user) {
        setFormData({
          email: user.email,
          full_name: user.full_name || '',
          phone: user.phone || '',
          role: user.role
        })
        setIsEditing(true)
      } else if (mode === 'create') {
        setFormData({
          email: '',
          full_name: '',
          phone: '',
          role: 'user'
        })
        setIsEditing(true)
      }
      setError(null)
      setFormErrors({})
    }
  }, [isOpen, mode, user])

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false)
      setError(null)
      setFormErrors({})
    }
  }, [isOpen])

  const validateForm = (): boolean => {
    try {
      userSchema.parse(formData)
      setFormErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<UserFormData> = {}
        error.issues.forEach((err) => {
          if (err.path) {
            errors[err.path[0] as keyof UserFormData] = err.message
          }
        })
        setFormErrors(errors)
      }
      return false
    }
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (mode === 'create') {
        // For create mode, we need to generate a new UUID for the user
        const newUserId = crypto.randomUUID()
        
        const { error } = await supabase.rpc('admin_create_user', {
          user_id_param: newUserId,
          email_param: formData.email,
          full_name_param: formData.full_name || null,
          phone_param: formData.phone || null,
          role_param: formData.role
        })

        if (error) throw error

        toast.success('Utilizatorul a fost creat cu succes!')
      } else if (mode === 'edit' && user) {
        const { error } = await supabase.rpc('admin_update_user', {
          user_id_param: user.id,
          new_email: formData.email !== user.email ? formData.email : null,
          new_full_name: formData.full_name !== user.full_name ? formData.full_name : null,
          new_phone: formData.phone !== user.phone ? formData.phone : null,
          new_role: formData.role !== user.role ? formData.role : null
        })

        if (error) throw error

        toast.success('Utilizatorul a fost actualizat cu succes!')
      }

      onUserUpdated()
      onClose()
    } catch (err) {
      console.error('Error saving user:', err)
      setError(err instanceof Error ? err.message : 'A apărut o eroare')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!user || mode === 'create') return

    if (!confirm('Ești sigur că vrei să ștergi acest utilizator? Această acțiune nu poate fi anulată.')) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.rpc('admin_delete_user', {
        user_id_param: user.id
      })

      if (error) throw error

      toast.success('Utilizatorul a fost șters cu succes!')
      onUserUpdated()
      onClose()
    } catch (err) {
      console.error('Error deleting user:', err)
      setError(err instanceof Error ? err.message : 'A apărut o eroare')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'user': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator'
      case 'user': return 'Utilizator'
      default: return role
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'create' ? 'Utilizator Nou' : 
                 mode === 'edit' ? 'Editează Utilizator' : 
                 user?.full_name || user?.email || 'Utilizator'}
              </h2>
              {mode === 'view' && user && (
                <p className="text-sm text-gray-500">
                  Creat la {formatDate(user.created_at)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {mode === 'view' && !isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="h-4 w-4" />
                <span>Editează</span>
              </Button>
            )}
            {mode !== 'create' && isEditing && (
              <Button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                <span>Șterge</span>
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informații de bază</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email *
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="email@example.com"
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-900">{user?.email}</p>
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="h-4 w-4 inline mr-1" />
                    Nume complet *
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nume și prenume"
                      />
                      {formErrors.full_name && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.full_name}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-900">{user?.full_name || 'Nespecificat'}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Telefon
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+40 720 123 456"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.phone || 'Nespecificat'}</p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Rol *
                  </label>
                  {isEditing ? (
                    <div>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value as 'user' | 'admin'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="user">Utilizator</option>
                        <option value="admin">Administrator</option>
                      </select>
                      {formErrors.role && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>
                      )}
                    </div>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user?.role || 'user')}`}>
                      {getRoleText(user?.role || 'user')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics (only in view mode for existing users) */}
            {mode === 'view' && user && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Statistici</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{user.car_requests_count || 0}</p>
                    <p className="text-sm text-blue-600">Cereri mașini</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{user.cost_estimates_count || 0}</p>
                    <p className="text-sm text-green-600">Estimări costuri</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{user.openlane_submissions_count || 0}</p>
                    <p className="text-sm text-purple-600">Submisii OpenLane</p>
                  </div>
                </div>
              </div>
            )}

            {/* Timestamps (only in view mode for existing users) */}
            {mode === 'view' && user && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informații sistem</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Data creării
                    </label>
                    <p className="text-gray-900">{formatDate(user.created_at)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Ultima actualizare
                    </label>
                    <p className="text-gray-900">{formatDate(user.updated_at)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {isEditing && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <Button
              onClick={() => {
                if (mode === 'view') {
                  setIsEditing(false)
                  // Reset form data to original user data
                  if (user) {
                    setFormData({
                      email: user.email,
                      full_name: user.full_name || '',
                      phone: user.phone || '',
                      role: user.role
                    })
                  }
                } else {
                  onClose()
                }
              }}
              variant="outline"
              disabled={isLoading}
            >
              Anulează
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Se salvează...' : 'Salvează'}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}