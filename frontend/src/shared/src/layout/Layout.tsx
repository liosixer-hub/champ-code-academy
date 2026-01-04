import React from 'react'
import Header from '../components/Header'
import { ThemeProvider } from '../providers'
import { useThemeStore } from '../store'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-background text-foreground transition-colors">
        <Header />
        <button
          onClick={toggleTheme}
          className="fixed bottom-4 right-4 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-lg z-50"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        {children}
      </div>
    </ThemeProvider>
  )
}

export default Layout

