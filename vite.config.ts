import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // Fix bundle size issues
    chunkSizeWarningLimit: 1000, // Increase limit to 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React vendor code
          'react-vendor': ['react', 'react-dom', 'wouter'],
          // Split chart libraries
          'chart-vendor': ['recharts'],
          // Split UI component libraries
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-progress',
            '@radix-ui/react-tabs',
            '@radix-ui/react-switch',
            '@radix-ui/react-scroll-area'
          ],
          // Split utility libraries
          'util-vendor': ['clsx', 'class-variance-authority', 'tailwind-merge'],
          // Split map libraries (if any)
          'map-vendor': ['leaflet', 'react-leaflet'],
          // Split query libraries
          'query-vendor': ['@tanstack/react-query'],
          // Split icon libraries
          'icon-vendor': ['lucide-react']
        }
      }
    },
    // Optimize for production  
    minify: 'esbuild',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'recharts',
      '@tanstack/react-query',
      'lucide-react'
    ],
  },
});