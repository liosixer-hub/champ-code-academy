import { create } from 'zustand'

export interface Lesson {
  id: string
  date: string
  type: 'Historic' | 'Upcoming' | 'Available' | 'Today'
  subject: string
  students: string[]
  tutor: string | null
  status: string
}

interface AppState {
  user: { name: string; email: string } | null
  isAuthenticated: boolean
  lessons: Lesson[]
  loading: boolean
  error: string | null
  setUser: (user: { name: string; email: string }) => void
  logout: () => void
  fetchLessons: () => Promise<void>
  takeLesson: (lessonId: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  lessons: [],
  loading: false,
  error: null,
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false, lessons: [] }),
  fetchLessons: async () => {
    set({ loading: true, error: null })
    try {
      // Mock data - replace with real API
      const mockLessons: Lesson[] = [
        {
          id: "L001",
          date: "2025-10-28T14:00:00Z",
          type: "Historic",
          subject: "Minecraft Game Design - Level 1",
          students: ["Ethan", "Ava"],
          tutor: "Sarah Tan",
          status: "Completed"
        },
        {
          id: "L002",
          date: "2025-11-02T09:00:00Z",
          type: "Historic",
          subject: "Roblox Coding Basics",
          students: ["Lucas"],
          tutor: "Sarah Tan",
          status: "Completed"
        },
        {
          id: "L003",
          date: "2025-11-05T16:00:00Z",
          type: "Historic",
          subject: "Python for Kids - Introduction",
          students: ["Chloe", "Aaron"],
          tutor: "Sarah Tan",
          status: "Completed"
        },
        {
          id: "L004",
          date: "2025-11-08T10:00:00Z",
          type: "Upcoming",
          subject: "Minecraft Redstone Logic",
          students: ["Emma", "Noah"],
          tutor: "Sarah Tan",
          status: "Confirmed"
        },
        {
          id: "L005",
          date: "2025-11-09T15:00:00Z",
          type: "Upcoming",
          subject: "Roblox Game Design - Level 2",
          students: ["Ryan", "Mia"],
          tutor: "Sarah Tan",
          status: "Confirmed"
        },
        {
          id: "L006",
          date: "2025-11-10T12:00:00Z",
          type: "Upcoming",
          subject: "Website Design for Beginners",
          students: ["Olivia"],
          tutor: "Sarah Tan",
          status: "Confirmed"
        },
        {
          id: "L007",
          date: "2025-11-12T11:00:00Z",
          type: "Available",
          subject: "Python for Kids - Game Projects",
          students: [],
          tutor: null,
          status: "Available"
        },
        {
          id: "L008",
          date: "2025-11-13T17:00:00Z",
          type: "Available",
          subject: "Roblox Game Design - Level 1",
          students: [],
          tutor: null,
          status: "Available"
        },
        {
          id: "L009",
          date: "2025-11-14T10:00:00Z",
          type: "Available",
          subject: "Minecraft AI Coding Adventure",
          students: [],
          tutor: null,
          status: "Available"
        },
        {
          id: "L010",
          date: "2025-11-15T09:00:00Z",
          type: "Upcoming",
          subject: "Python Automation for Kids",
          students: ["Elijah"],
          tutor: "Sarah Tan",
          status: "Confirmed"
        }
      ]
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      set({ lessons: mockLessons, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },
  takeLesson: (lessonId) => {
    const lessons = get().lessons.map(lesson =>
      lesson.id === lessonId
        ? { ...lesson, type: 'Upcoming' as const, tutor: get().user?.name || null, status: 'Confirmed' }
        : lesson
    )
    set({ lessons })
  }
}))

// Alias for useUserStore
export const useUserStore = useAppStore