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
  const [theme, setTheme] = useState<Theme>(() => getTimeBasedTheme())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Always use time-based theme (no localStorage persistence)
    const timeBasedTheme = getTimeBasedTheme()
    setTheme(timeBasedTheme)

    // Apply theme to DOM immediately
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(timeBasedTheme)

    // Clear any old localStorage theme value
    localStorage.removeItem('theme')
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
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