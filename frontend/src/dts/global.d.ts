// ============================================
// 自动生成的远程模块类型声明文件
// ============================================
// 注意: 此文件通过 scripts/generate-dts.js 自动生成
// 请勿手动编辑

// shared 应用暴露的模块
declare module 'shared/Button' {
  import type React from 'react';
  interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
  }
  const component: React.ComponentType<ComponentProps>;
  export default component;
}

declare module 'shared/Header' {
  import type React from 'react';
  interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
  }
  const component: React.ComponentType<ComponentProps>;
  export default component;
}

declare module 'shared/store' {
  export interface Lesson {
    id: string;
    date: string;
    type: 'Historic' | 'Upcoming' | 'Available' | 'Today';
    subject: string;
    students: string[];
    tutor: string | null;
    status: string;
  }

  export interface AppState {
    user: { name: string; email: string } | null;
    isAuthenticated: boolean;
    lessons: Lesson[];
    loading: boolean;
    error: string | null;
    setUser: (user: { name: string; email: string }) => void;
    logout: () => void;
    fetchLessons: () => Promise<void>;
    takeLesson: (lessonId: string) => void;
  }

  export const useAppStore: () => AppState;
  export const useUserStore: () => any;
}

declare module 'shared/SharedApp' {
  import type React from 'react';
  interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
  }
  const component: React.ComponentType<ComponentProps>;
  export default component;
}

// login 应用暴露的模块
declare module 'login/LoginApp' {
  import type React from 'react';
  interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
    onBackClick?: () => void;
  }
  const component: React.ComponentType<ComponentProps>;
  export default component;
}

// dashboard 应用暴露的模块
declare module 'dashboard/DashboardApp' {
  import type React from 'react';
  interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
  }
  const component: React.ComponentType<ComponentProps>;
  export default component;
}

// home 应用暴露的模块
declare module 'home/HomeApp' {
  import type React from 'react';
  interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
    onLoginClick?: () => void;
  }
  const component: React.ComponentType<ComponentProps>;
  export default component;
}


// ============================================
// 通用 Wildcard 声明
// ============================================

declare module 'shared/*' {
  import type React from 'react';
  interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
  }
  const component: React.ComponentType<ComponentProps>;
  export default component;
}

declare module 'login/*' {
  import type React from 'react';
  interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
  }
  const component: React.ComponentType<ComponentProps>;
  export default component;
}

declare module 'dashboard/*' {
  import type React from 'react';
  interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
  }
  const component: React.ComponentType<ComponentProps>;
  export default component;
}

declare module 'home/*' {
  import type React from 'react';
  interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
  }
  const component: React.ComponentType<ComponentProps>;
  export default component;
}
