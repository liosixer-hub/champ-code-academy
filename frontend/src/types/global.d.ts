/**
 * Global type declarations for Module Federation
 */

declare module 'shared/providers' {
  import React from 'react';
  
  export const ThemeProvider: React.ComponentType<{
    children: React.ReactNode;
    theme: 'light' | 'dark';
  }>;
}

declare module 'shared/entity' {
  export interface Lesson {
    id: string;
    date: string;
    type: 'Historic' | 'Upcoming' | 'Available' | 'Today';
    subject: string;
    students: string[];
    tutor: string | null;
    status: string;
  }
  export interface User {
    name: string;
    email: string;
  }
}

declare module 'shared/store' {
  import type { User, Lesson } from 'shared/entity';
  export const useThemeStore: import('zustand').UseBoundStore<import('zustand').StoreApi<{
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
  }>>;
  export const useLessonStore: import('zustand').UseBoundStore<import('zustand').StoreApi<{
    lessons: Lesson[];
    fetchLessons: () => Promise<void>;
    takeLesson: (lessonId: string) => void;
  }>>;
  export const useCommonStore: import('zustand').UseBoundStore<import('zustand').StoreApi<{
    loading: boolean;
    error: string | null;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  }>>;
  export const useUserStore: import('zustand').UseBoundStore<import('zustand').StoreApi<{
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    logout: () => void;
  }>>;
}

declare module 'shared/components' {
  import React from 'react';
  export const Button: React.ComponentType<any>;
  export const Header: React.ComponentType<any>;
  export const LessonCard: React.ComponentType<any>;
  export const LessonSection: React.ComponentType<any>;
  export const MessageBox: React.ComponentType<any>;
  export const ToolTip: React.ComponentType<any>;
  export const DatePicker: React.ComponentType<any>;
  export const Toast: React.ComponentType<any>;
}

declare module 'shared/layout' {
  import React from 'react';
  export const Layout: React.ComponentType<{ children: React.ReactNode }>;
}

declare module 'shared/SharedApp' {
  import React from 'react';
  export const SharedApp: React.ComponentType<{}>;
  export default SharedApp;
}

declare module 'dashboard/DashboardApp' {
  import React from 'react';
  
  export const DashboardApp: React.ComponentType<{}>;
  export default DashboardApp;
}

declare module 'login/LoginApp' {
  import React from 'react';
  
  export interface LoginAppProps {
    onBackClick?: () => void;
  }
  
  export const LoginApp: React.ComponentType<LoginAppProps>;
  export default LoginApp;
}

