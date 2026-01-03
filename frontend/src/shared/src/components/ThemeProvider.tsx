import React, { useEffect } from 'react'
import { useThemeStore } from '../store'

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useThemeStore()

  useEffect(() => {
    const htmlElement = document.documentElement
    if (theme === 'dark') {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
  }, [theme])

  return <>{children}</>
}

export default ThemeProvider
