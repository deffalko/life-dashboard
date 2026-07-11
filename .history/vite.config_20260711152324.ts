import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/life-dashboard/",
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          redux: ["@reduxjs/toolkit", "react-redux"],
          router: ["react-router-dom"],
        },
      },
    },
  },
});
