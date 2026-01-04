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

declare module 'dashboard/DashboardApp' {
  import React from 'react';
  
  export const DashboardApp: React.ComponentType<{}>;
  export default DashboardApp;
}

declare module 'home/HomeApp' {
  import React from 'react';
  
  export interface HomeAppProps {
    onLoginClick?: () => void;
  }
  
  export const HomeApp: React.ComponentType<HomeAppProps>;
  export default HomeApp;
}

declare module 'login/LoginApp' {
  import React from 'react';
  
  export interface LoginAppProps {
    onBackClick?: () => void;
  }
  
  export const LoginApp: React.ComponentType<LoginAppProps>;
  export default LoginApp;
}

