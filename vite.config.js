import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Keep supporting the existing REACT_APP_* env vars (in addition to VITE_*)
  envPrefix: ["VITE_", "REACT_APP_"],
  server: {
    port: 3001,
    proxy: {
      // Forward API requests to the backend during development (replaces CRA's "proxy" field)
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
  build: {
    // Keep CRA's output directory so deployment config (railway.toml) stays valid
    outDir: "build",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});
