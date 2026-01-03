import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // ✅ Fix asset paths when deploying to subfolders (e.g. GitHub Pages)
  base: './', // Change to '/your-repo-name/' if using GitHub Pages

  build: {
    // ✅ Increase warning limit if your bundle is big (optional)
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        // ✅ Better code-splitting for vendor libraries
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor'
            return 'vendor'
          }
        }
      }
    }
  }
})
