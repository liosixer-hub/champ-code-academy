/**
 * Providers Declaration File
 */

import React from 'react';

export declare const ThemeProvider: React.ComponentType<{
  children: React.ReactNode;
  theme: 'light' | 'dark';
}>;