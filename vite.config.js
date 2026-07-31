import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Served from ckn85.github.io/Asklepieion/ — change to '/' if you later
  // point a custom domain at the site root.
  base: '/Asklepieion/',
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
