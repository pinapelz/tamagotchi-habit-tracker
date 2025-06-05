import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
        VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Tamagotchi Habits',
        short_name: 'Habits',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#e79c2d',
        icons: [
          {
            src: '/public/slimefavicon.gif',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg}'],
      },
    }),
  ],
})
