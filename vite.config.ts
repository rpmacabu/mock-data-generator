import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Em produção (GitHub Pages) o site é servido em /mock-data-generator/;
  // em dev continua na raiz.
  base: command === "build" ? "/mock-data-generator/" : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))
