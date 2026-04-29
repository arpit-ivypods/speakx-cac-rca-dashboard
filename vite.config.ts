import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// For GitHub Pages, set BASE_PATH at build time (e.g. "/repo-name/").
// On Vercel/Netlify/local dev, leave empty so it serves from root.
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5180,
    strictPort: false,
    host: true,
  },
})
