import { create } from 'zustand'
import { useUserStore } from './userStore'
import { useCommonStore } from './commonStore'
import type { Lesson } from '../entity'

interface LessonState {
  lessons: Lesson[]
  fetchLessons: () => Promise<void>
  takeLesson: (lessonId: string) => Promise<void>
}

export const useLessonStore = create<LessonState>((set) => ({
  lessons: [],
  fetchLessons: async () => {
    const commonStore = useCommonStore.getState()
    commonStore.setLoading(true)
    commonStore.setError(null)
    try {
      const baseUrl = import.meta.env.BASE_URL;
      const response = await fetch(`${baseUrl}api/lessons`);
      if (!response.ok) {
        throw new Error(`Failed to fetch lessons: ${response.statusText}`);
      }
      const data = await response.json();
      set({ lessons: data });
    } catch (error) {
      console.error('Fetch lessons error:', error);
      commonStore.setError('Failed to fetch lessons');
    } finally {
      commonStore.setLoading(false)
    }
  },
  takeLesson: async (lessonId: string) => {
    try {
      const baseUrl = import.meta.env.BASE_URL;
      const response = await fetch(`${baseUrl}api/lessons/${lessonId}/take`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.lesson) {
          set((state) => ({
            lessons: state.lessons.map(l => l.id === lessonId ? result.lesson : l)
          }));
        }
      } else {
        console.error('Failed to take lesson');
      }
    } catch (error) {
      console.error('Take lesson error:', error);
    }
  }
}))
