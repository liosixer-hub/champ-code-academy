import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

const sharedUrl = process.env.BASE_URL_SHARED || 'http://localhost:5001';
const homeUrl = process.env.BASE_URL_HOME || 'http://localhost:5004';
const port = new URL(homeUrl).port;

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'home',
      filename: 'remoteEntry.js',
      exposes: {
        './HomeApp': './src/App.tsx',
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