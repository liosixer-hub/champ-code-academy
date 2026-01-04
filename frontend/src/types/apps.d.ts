/**
 * Apps Module Federation Type Declarations
 * Declares types for remote modules loaded via Module Federation
 * 
 * These declarations map the module federation import paths (e.g., 'login/LoginApp')
 * to the actual component types defined in the apps.
 * This enables type checking for module federation imports in host applications.
 */

import React from 'react';

// Re-export app components
export * from './dashboard';
export * from './home';
export * from './login';

// Remote Module Federation declarations
declare module 'login/index' {
  import React from 'react';
  interface LoginAppProps {
    onBackClick?: () => void;
  }
  export const App: React.ComponentType<LoginAppProps>;
  const LoginApp: React.ComponentType<LoginAppProps>;
  export default LoginApp;
}

declare module 'dashboard/index' {
  import React from 'react';
  export const App: React.ComponentType<{}>;
  const DashboardApp: React.ComponentType<{}>;
  export default DashboardApp;
}

declare module 'home/index' {
  import React from 'react';
  interface HomeAppProps {
    onLoginClick?: () => void;
  }
  export const App: React.ComponentType<HomeAppProps>;
  const HomeApp: React.ComponentType<HomeAppProps>;
  export default HomeApp;
}

// Legacy declarations (for backward compatibility)
declare module 'login/LoginApp' {
  export interface LoginAppProps {
    onBackClick?: () => void;
  }
  
  export const LoginApp: React.ComponentType<LoginAppProps>;
  export default LoginApp;
}

declare module 'dashboard/DashboardApp' {
  export const DashboardApp: React.ComponentType<{}>;
  export default DashboardApp;
}

declare module 'home/HomeApp' {
  export interface HomeAppProps {
    onLoginClick?: () => void;
  }
  
  export const HomeApp: React.ComponentType<HomeAppProps>;
  export default HomeApp;
}

