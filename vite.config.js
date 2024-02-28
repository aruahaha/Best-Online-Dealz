import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ViteCommonJS from 'vite-plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),ViteCommonJS()],
  optimizeDeps: {
    exclude: ['js-big-decimal']
  },
  define: {
    'process.env': process.env
  }
})