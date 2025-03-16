import { sentryVitePlugin } from "@sentry/vite-plugin";
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa";

export const manifestForPlugIn = {
  registerType: 'autoUpdate' as const,
  includeAssests: ['favicon.png', 'service-worker.js'],
  devOptions: {
    enabled: true,
    type: 'module',
  },
  manifest: {
    name: "Akevas",
    short_name: "Akevas",
    description: "Akevas",
    "start_url": "/index.html",
    "display": "standalone",
    icons: [{
      src: '/favicon.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'favicon'
    },
    {
      src: '/favicon.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'favicon'
    },
    {
      src: '/favicon.png',
      sizes: '180x180',
      type: 'image/png',
      purpose: 'apple touch icon',
    },
    {
      src: '/favicon.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable',
    }
    ],
    theme_color: '#171717',
    background_color: '#f0e7db',
    display: "standalone" as const,
    scope: '/',
    start_url: "/",
    orientation: 'portrait' as const
  }
}
export default defineConfig({
  plugins: [react(), sentryVitePlugin({
    org: "freelancer-tru",
    project: "javascript-react"
  }),VitePWA(manifestForPlugIn)],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    sourcemap: true
  }
})