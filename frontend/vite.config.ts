import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Base path mà FE gọi (mặc định /api)
  const apiBase = env.VITE_API_BASE_URL || '/api'

  // Backend target cho dev proxy (lấy từ env, fallback)
  const apiTarget = env.VITE_API_TARGET || 'http://localhost:8000'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: true,         // = 0.0.0.0
      port: 3000,
      strictPort: true,

      // Fix lỗi "host not allowed" khi chạy dev/preview với domain public
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        'webar-furniture-frontend.onrender.com',
      ],

      proxy: {
        [apiBase]: {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          // Nếu backend KHÔNG có prefix /api thì bật rewrite:
          // rewrite: (p) => p.replace(new RegExp(`^${apiBase}`), ''),
        },
      },
    },

    // nếu bạn có dùng `vite preview` để test build
    preview: {
      host: true,
      port: 4173,
      strictPort: true,
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        'webar-furniture-frontend.onrender.com',
      ],
    },
  }
})