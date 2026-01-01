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
  interface StoreState {
    [key: string]: unknown;
  }
  export const useAppStore: () => StoreState;
  export const useUserStore: () => StoreState;
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
