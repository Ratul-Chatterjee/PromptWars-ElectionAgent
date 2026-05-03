import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vercel apps run at the root path '/' so we don't need the repo name base path anymore.
  base: '/',
})
