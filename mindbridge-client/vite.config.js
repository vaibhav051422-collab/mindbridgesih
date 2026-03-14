import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // In production builds, warn if Supabase env vars are missing
  if (mode === "production") {
    if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
      console.warn(
        "\n⚠️  WARNING: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set!\n" +
          "   The app will show a white page without these.\n" +
          "   Add them in Netlify → Site Settings → Environment Variables.\n",
      );
    }
  }

  return {
    plugins: [react()],

    // Use '/' for Netlify deployment
    base: "/",

    build: {
      chunkSizeWarningLimit: 1000,

      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              // Keep react and react-dom together to avoid circular dependency
              if (
                id.includes("/react/") ||
                id.includes("/react-dom/") ||
                id.includes("/react-router") ||
                id.includes("/scheduler/")
              ) {
                return "react-vendor";
              }
              // Charting library in its own chunk
              if (id.includes("recharts") || id.includes("d3-")) {
                return "charts-vendor";
              }
              // Everything else in vendor
              return "vendor";
            }
          },
        },
      },
    },
  };
});
