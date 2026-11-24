
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
  proxy: {
    "/football-images": {
      target: "https://football-api.yuvron.online",
      changeOrigin: true,
      secure: true,
      rewrite: (path) =>
        path.replace(/^\/football-images/, "/images"),
    },
  },
},
})
