import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Make Vercel happy — output folder will be "build" instead of "dist"
    outDir: 'build',

    // Raise or remove the warning limit
    chunkSizeWarningLimit: 1000,

    // Optional: split vendor libs into separate chunks
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom']
        }
      }
    }
  }
})
