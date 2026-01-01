import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

const sharedUrl = process.env.BASE_URL_SHARED || 'http://localhost:5001';
const loginUrl = process.env.BASE_URL_LOGIN || 'http://localhost:5002';
const port = new URL(loginUrl).port;

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'login',
      filename: 'remoteEntry.js',
      exposes: {
        './LoginApp': './src/App.tsx',
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