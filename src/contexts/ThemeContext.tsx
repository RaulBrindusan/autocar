"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

// Get time-based default theme for Romanian timezone
function getTimeBasedTheme(): Theme {
  const now = new Date()
  const romanianTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Bucharest"}))
  const hour = romanianTime.getHours()
  
  // Dark mode between 22:00 (10 PM) and 06:00 (6 AM)
  return (hour >= 22 || hour < 6) ? 'dark' : 'light'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize with time-based theme to prevent hydration mismatch
  const [theme, setTheme] = useState<Theme>(() => {
    // Always use time-based theme for now to debug the issue
    return getTimeBasedTheme()
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Force time-based theme on mount to override any localStorage
    const timeBasedTheme = getTimeBasedTheme()
    setTheme(timeBasedTheme)
    
    // Apply theme to DOM immediately
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(timeBasedTheme)
    localStorage.setItem('theme', timeBasedTheme)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const root = window.document.documentElement
    console.log('Applying theme:', theme)
    console.log('Classes before:', root.classList.toString())
    
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
    
    console.log('Classes after:', root.classList.toString())
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light'
      console.log('Theme toggle:', prevTheme, '->', newTheme)
      return newTheme
    })
  }

  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme: () => {} }}>
        {children}
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}