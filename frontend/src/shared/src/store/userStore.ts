import { create } from 'zustand'

interface UserState {
  user: { name: string; email: string } | null
  isAuthenticated: boolean
  setUser: (user: { name: string; email: string }) => void
  logout: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))