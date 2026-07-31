import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Using a custom domain at the root ("/") — if you're NOT using a custom
  // domain and are instead on username.github.io/asklepieion/, change this
  // to base: '/asklepieion/' (your repo name) or pages will load blank.
  base: '/Asklepieion/',
})
