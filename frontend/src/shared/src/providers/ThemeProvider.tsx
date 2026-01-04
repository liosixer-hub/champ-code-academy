import React, { useEffect } from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
  theme: 'light' | 'dark'
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, theme }) => {

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
