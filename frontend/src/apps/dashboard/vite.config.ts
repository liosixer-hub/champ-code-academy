import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

const sharedUrl = process.env.BASE_URL_SHARED || 'http://localhost:5001';
const dashboardUrl = process.env.BASE_URL_DASHBOARD || 'http://localhost:5003';
const port = new URL(dashboardUrl).port;

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    federation({
      name: 'dashboard',
      filename: 'remoteEntry.js',
      exposes: {
        './DashboardApp': './src/App.tsx',
        './index': './src/index.ts',
      },
      remotes: {
        shared: sharedUrl + '/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react/jsx-runtime', 'zustand']
    })
  ] as any[],
  server: {
    port: parseInt(port),
    strictPort: true, 
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  preview: {
    port: parseInt(port),
    strictPort: true, 
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../shared/src')
    }
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react'
  }
});