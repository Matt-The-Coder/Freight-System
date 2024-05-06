import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), VitePWA({
    // add this to cache all the imports
    workbox: {
      globPatterns: ["**/*"],
    },
    // add this to cache all the
    // static assets in the public folder
    includeAssets: [
      "**/*",
    ]
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
})
