import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/auth': 'http://localhost:8080',
      '/products': 'http://localhost:8080',
      '/orders': 'http://localhost:8080',
      '/reviews': 'http://localhost:8080',
    },
  },
})
