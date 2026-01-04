import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light', // 初始主题始终为 light
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme: 'light' | 'dark') => set({ theme }),
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme }),
      // 强制初始值为 light
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setTheme('light');
        }
      },
    }
  )
)