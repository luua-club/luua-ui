import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

function getPackageName(id: string) {
  const normalizedId = id.split(path.sep).join('/')
  const parts = normalizedId.split('node_modules/')
  const pkgPath = parts[parts.length - 1]
  const pkgSegments = pkgPath.split('/')

  if (pkgSegments[0]?.startsWith('@')) {
    return `${pkgSegments[0]}/${pkgSegments[1]}`
  }

  return pkgSegments[0]
}

const isAnalyze = process.env.ANALYZE === 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    modulePreload: {
      resolveDependencies: (_url, deps, context) => {
        return deps.filter(
          dep =>
            !dep.includes('/charts-') &&
            (context.hostType !== 'html' || !dep.includes('/route-'))
        )
      },
    },
    rollupOptions: {
      output: {
        hoistTransitiveImports: false,
        manualChunks(id) {
          if (id.includes('commonjsHelpers.js')) {
            return 'commonjs-helpers'
          }

          // -------- Vendor chunks --------
          if (id.includes('node_modules')) {
            const pkg = getPackageName(id)

            if (pkg === 'lucide-react') {
              return 'lucide-icons'
            }
            if (pkg === '@radix-ui/react-slot' || pkg === 'radix-ui') {
              return 'radix-ui'
            }
            if (pkg.startsWith('@radix-ui/')) {
              return 'radix-components'
            }
            if (pkg.startsWith('@tanstack/')) {
              return 'tanstack'
            }
            if (pkg === 'motion') {
              return 'motion'
            }
            if (pkg === 'posthog-js') {
              return 'posthog'
            }
            if (pkg === 'axios') {
              return 'axios'
            }
            if (pkg === 'zod') {
              return 'zod'
            }
            if (pkg === 'date-fns') {
              return 'date-fns'
            }
            if (
              pkg === 'clsx' ||
              pkg === 'tailwind-merge' ||
              pkg === 'class-variance-authority'
            ) {
              return 'style-utils'
            }
            if (
              pkg === 'immer' ||
              pkg === 'reselect' ||
              pkg === 'tiny-invariant'
            ) {
              return 'redux'
            }
            if (
              pkg === 'recharts' ||
              pkg === 'victory-vendor' ||
              pkg.startsWith('d3-')
            ) {
              return 'charts'
            }
            if (pkg === 'canvas-confetti') {
              return 'confetti'
            }
            if (pkg === 'react-dnd' || pkg === 'react-dnd-html5-backend') {
              return 'react-dnd'
            }
            if (pkg === 'react-hook-form' || pkg === '@hookform/resolvers') {
              return 'react-forms'
            }
            if (
              pkg === 'react' ||
              pkg === 'react-dom' ||
              pkg === 'scheduler' ||
              pkg === 'use-sync-external-store'
            ) {
              return 'react-core'
            }
            if (
              pkg === 'react-redux' ||
              pkg === '@reduxjs/toolkit' ||
              pkg === 'redux'
            ) {
              return 'redux'
            }

            // Don't bundle other vendors together - let Vite optimize
            return undefined
          }
        },
      },
      plugins: [
        isAnalyze &&
          visualizer({
            filename: 'dist/stats.html',
            template: 'treemap',
            gzipSize: true,
            brotliSize: true,
            open: true,
          }),
      ].filter(Boolean),
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
