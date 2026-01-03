import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

const sharedUrl = process.env.BASE_URL_SHARED || 'http://localhost:5001';
const port = new URL(sharedUrl).port;

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    federation({
      name: 'shared',
      filename: 'remoteEntry.js',
      exposes: {
        './components': './src/components/index.ts',
        './store': './src/store/store.ts',
        './SharedApp': './src/App.tsx',
      },
      shared: ['react', 'react-dom', 'react/jsx-runtime', 'zustand']
    })
  ] as any[],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  server: {
    port: parseInt(port),
    strictPort: true, 
  },
  preview: {
    port: parseInt(port),
    strictPort: true, 
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react'
  }
});