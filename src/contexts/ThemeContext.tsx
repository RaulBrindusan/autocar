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
  const [theme, setTheme] = useState<Theme>('light') // Default to light mode
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as Theme
    console.log('Initial theme load:', savedTheme)
    
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      // Use saved theme if exists
      setTheme(savedTheme)
    } else {
      // Use time-based default theme
      const timeBasedTheme = getTimeBasedTheme()
      setTheme(timeBasedTheme)
      console.log('Using time-based default theme:', timeBasedTheme)
      localStorage.setItem('theme', timeBasedTheme)
    }
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
      <ThemeContext.Provider value={{ theme: 'light', toggleTheme: () => {} }}>
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