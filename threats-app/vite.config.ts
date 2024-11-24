/* eslint-disable */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/rip_frontend",
  server: {
    proxy: {
      "/api": {
        target: "http://192.168.1.11:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/"),
      },
    },
    port: 3000
  }
});