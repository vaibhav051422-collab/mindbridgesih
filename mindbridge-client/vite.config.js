import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Use '/' for Netlify deployment (not './' which is for GitHub Pages)
  base: "/",

  build: {
    // Increase warning limit if your bundle is big (optional)
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        // Better code-splitting for vendor libraries
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom"))
              return "react-vendor";
            return "vendor";
          }
        },
      },
    },
  },
});
