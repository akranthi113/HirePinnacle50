import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/HirePinnacle50/', // MUST match the GitHub repository name
  build: {
    outDir: "docs",
  },
})
