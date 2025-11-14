'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, User, ChevronDown } from 'lucide-react'
// import { createClient } from '@/lib/supabase/client'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: string
}

interface UserSearchDropdownProps {
  value: string
  onUserSelect: (user: UserProfile) => void
  onInputChange: (value: string) => void
  placeholder?: string
  error?: string
}

export function UserSearchDropdown({ 
  value, 
  onUserSelect, 
  onInputChange, 
  placeholder = "Caută utilizator...",
  error 
}: UserSearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [users, setUsers] = useState<UserProfile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  // Fetch users with 'user' role
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'user')
          .order('full_name', { ascending: true, nullsFirst: false })

        if (error) {
          console.error('Error fetching users:', error)
        } else {
          setUsers(data || [])
          setFilteredUsers(data || [])
        }
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [supabase])

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users)
      return
    }

    const filtered = users.filter(user => {
      const fullName = user.full_name?.toLowerCase() || ''
      const email = user.email.toLowerCase()
      const search = searchTerm.toLowerCase()
      
      return fullName.includes(search) || email.includes(search)
    })
    
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setSearchTerm(inputValue)
    onInputChange(inputValue)
    setIsOpen(true)
  }

  const handleUserSelect = (user: UserProfile) => {
    onUserSelect(user)
    setSearchTerm(user.full_name || user.email)
    setIsOpen(false)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const displayValue = value || searchTerm

  return (
    <div ref={dropdownRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={`w-full px-3 py-2 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {error && (
        <p className="text-red-600 text-sm mt-1">{error}</p>
      )}

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              Se încarcă utilizatorii...
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {user.full_name || 'Nume necompletat'}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="text-xs text-gray-400 truncate">
                        {user.phone}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              {searchTerm ? 'Nu s-au găsit utilizatori.' : 'Nu există utilizatori înregistrați.'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}