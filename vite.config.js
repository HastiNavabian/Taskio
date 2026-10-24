/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // The service worker updates itself and takes control of open tabs
      // as soon as a new version is deployed.
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Taskio",
        short_name: "Taskio",
        description: "A Trello-style task board with drag and drop.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#f4f5f7",
        theme_color: "#4f6df5",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      // Only the app shell (HTML, JS, CSS, icons) is cached.
      // Requests to Supabase are NOT cached, so tasks are always fresh.
      workbox: {
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
  },
});
