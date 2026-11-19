import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'prompt',

      manifest: {
        name: 'SmartStock Inventory Management System',
        short_name: 'SmartStock',
        description: 'SmartStock Inventory Management System',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'any',
start_url: '/',
scope: '/',

icons: [
  {
    src: '/pwa-192x192.png',
    sizes: '192x192',
    type: 'image/png',
  },
  {
    src: '/pwa-512x512.png',
    sizes: '512x512',
    type: 'image/png',
  },
],
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,png,woff2}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})