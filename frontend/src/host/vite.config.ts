import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import { log } from 'console';

const sharedUrl = process.env.BASE_URL_SHARED || 'http://localhost:5001';
const loginUrl = process.env.BASE_URL_LOGIN || 'http://localhost:5002';
const dashboardUrl = process.env.BASE_URL_DASHBOARD || 'http://localhost:5003';

log('Using shared URL:', sharedUrl);
log('Using login URL:', loginUrl);
log('Using dashboard URL:', dashboardUrl);

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [
    react(),
    federation({
      name: 'host',
      remotes: {
        login: loginUrl + '/assets/remoteEntry.js',
        dashboard: dashboardUrl + '/assets/remoteEntry.js',
        shared: sharedUrl + '/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'zustand']
    })
  ] as any[],  
  server: {
    port: 5000,
    strictPort: true, 
  },
  build: {
    target: 'esnext',
    minify: 'terser',
  }
});
