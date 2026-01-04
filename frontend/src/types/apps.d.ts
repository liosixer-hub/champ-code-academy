/**
 * Apps Module Federation Type Declarations
 * Declares types for remote modules loaded via Module Federation
 * 
 * These declarations map the module federation import paths to the actual component types.
 * The paths must match the exposes configuration in each app's vite.config.ts:
 * - dashboard/DashboardApp (from './DashboardApp': './src/App.tsx')
 * - home/HomeApp (from './HomeApp': './src/App.tsx')
 * - login/LoginApp (from './LoginApp': './src/App.tsx')
 */

import React from 'react';

// Re-export app components
export * from './dashboard';
export * from './home';
export * from './login';

// Remote Module Federation declarations
// Path format: {remote_name}/{exposes_path}
// Must match the exposes configuration in vite.config.ts

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

