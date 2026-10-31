import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Vite settings: React + Tailwind CSS v4 plugin.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
