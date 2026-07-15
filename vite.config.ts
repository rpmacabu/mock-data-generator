import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

import pkg from "./package.json" with { type: "json" }

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Em produção (GitHub Pages) o site é servido em /mock-data-generator/;
  // em dev continua na raiz.
  base: command === "build" ? "/mock-data-generator/" : "/",
  // Expõe a versão do package.json como constante global no código.
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))
