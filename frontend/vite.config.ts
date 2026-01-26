import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // Binding tất cả interfaces
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://192.168.1.112:8000',
        changeOrigin: true,
      },
    },
  },
});
