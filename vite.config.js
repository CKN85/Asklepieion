import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Set to the repo name because the site is served from
  // ckn85.github.io/Asklepieion/. If you later point a custom domain at the
  // root of the site, change this back to '/'.
  base: '/Asklepieion/',
})