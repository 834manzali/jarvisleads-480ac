import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@/components': path.resolve(__dirname, './components'),
      '@/screens': path.resolve(__dirname, './screens'),
      '@/store': path.resolve(__dirname, './store'),
      '@/types': path.resolve(__dirname, './types'),
      '@/styles': path.resolve(__dirname, './styles'),
      '@/api': path.resolve(__dirname, './api'),
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})