import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/life-dashboard/", // ЗАМЕНИТЕ НА НАЗВАНИЕ ВАШЕГО РЕПОЗИТОРИЯ!
  server: {
    port: 3000,
  },
});
