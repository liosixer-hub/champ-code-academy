import React from 'react';

/**
 * Home Application Component
 * Exposed as './HomeApp' in vite.config.ts
 */
export interface HomeAppProps {
  onLoginClick?: () => void;
}

export declare const HomeApp: React.ComponentType<HomeAppProps>;

