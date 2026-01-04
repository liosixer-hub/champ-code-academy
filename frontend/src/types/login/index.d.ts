import React from 'react';

/**
 * Login Application Component
 * Exposed as './LoginApp' in vite.config.ts
 */
export interface LoginAppProps {
  onBackClick?: () => void;
}

export declare const LoginApp: React.ComponentType<LoginAppProps>;

// Components
export * from './components';
