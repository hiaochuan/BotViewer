import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './',
  server: {
    port: 5173,
    hmr: process.env.NO_HMR !== 'true',
  },
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: true,
  },
})
