import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Jangan paparkan development server ke perangkat lain di jaringan lokal.
    host: '127.0.0.1',
    // Izinkan akses host tunnel seperti Cloudflare Tunnel (*.trycloudflare.com)
    allowedHosts: true,
    proxy: {
      '/graphql': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true
      }
    }
  }
});
