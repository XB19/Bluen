import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const backend = process.env.VITE_BACKEND_URL || 'http://localhost:8080'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': backend,
      '/uploads': backend,
    },
  },
  preview: {
    proxy: {
      '/api': backend,
      '/uploads': backend,
    },
  },
})
