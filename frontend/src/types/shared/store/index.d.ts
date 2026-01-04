/**
 * Store Hooks Declaration File
 */

import type { User, Lesson } from '../entity';

export declare const useThemeStore: import('zustand').UseBoundStore<import('zustand').StoreApi<{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}>>;

export declare const useLessonStore: import('zustand').UseBoundStore<import('zustand').StoreApi<{
  lessons: Lesson[];
  fetchLessons: () => Promise<void>;
  takeLesson: (lessonId: string) => void;
}>>;

export declare const useCommonStore: import('zustand').UseBoundStore<import('zustand').StoreApi<{
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}>>;

export declare const useUserStore: import('zustand').UseBoundStore<import('zustand').StoreApi<{
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}>>;