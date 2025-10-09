import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) {
              return 'lucide-icons'
            }
            if (id.includes('react') || id.includes('redux')) {
              return 'react-vendor'
            }
            if (id.includes('@tanstack')) {
              return 'tanstack'
            }
            if (id.includes('@radix-ui')) {
              return 'radix-ui'
            }
            if (id.includes('motion') || id.includes('framer')) {
              return 'motion'
            }
            if (id.includes('posthog')) {
              return 'posthog'
            }
            if (id.includes('axios')) {
              return 'axios'
            }
            if (id.includes('zod')) {
              return 'zod'
            }
            if (id.includes('date-fns')) {
              return 'date-fns'
            }
            if (id.includes('canvas-confetti')) {
              return 'confetti'
            }
            // Don't bundle other vendors together - let Vite optimize
            return undefined
          }

          // Route-based chunks
          if (id.includes('/src/auth/')) {
            return 'route-auth'
          }
          if (id.includes('/src/dashboard/')) {
            return 'route-dashboard'
          }
          if (id.includes('/src/settings/')) {
            return 'route-settings'
          }
          if (id.includes('/src/creation/')) {
            return 'route-creation'
          }
          if (id.includes('/src/auto-gen/')) {
            return 'route-autogen'
          }
          if (id.includes('/src/payments/')) {
            return 'route-payments'
          }
          if (id.includes('/src/onboarding/')) {
            return 'route-onboarding'
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
    watch: {
      usePolling: true,
    },
  },
})
