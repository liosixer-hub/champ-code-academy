import React from 'react'
import { useThemeStore } from '../store'

function Header() {
  const { theme } = useThemeStore()

  React.useEffect(() => {
    const htmlElement = document.documentElement
    if (theme === 'dark') {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <header className="bg-white dark:bg-slate-950 shadow transition-colors">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Champ Code Academy</h1>
      </div>
    </header>
  )
}

export default Header