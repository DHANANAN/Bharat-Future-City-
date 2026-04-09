import React, { createContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'dark' 
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme
    try {
      const stored = localStorage.getItem('theme') as Theme | null
      if (stored && (stored === 'light' || stored === 'dark')) {
        return stored
      }
    } catch (e) {
      // localStorage not available
    }
    return defaultTheme
  })

  useEffect(() => {
    // Apply theme immediately
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    
    try {
      localStorage.setItem('theme', theme)
    } catch (e) {
      // localStorage not available
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
