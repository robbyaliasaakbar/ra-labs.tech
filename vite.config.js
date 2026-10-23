import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Sumber HTML ada di entries/, root index.html adalah hasil build.
// Dev server pakai port 5015 sesuai permintaan, strictPort biar tidak diam diam lompat port.
// Middleware pertama ini bikin `/` di dev langsung menunjuk ke entries/index.html,
// karena root index.html baru ada setelah build dan isinya versi lama tanpa HMR.
const serveSourceAtRoot = {
  name: 'serve-source-at-root',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === '/') req.url = '/entries/index.html'
      next()
    })
  },
}

export default defineConfig({
  plugins: [react(), serveSourceAtRoot],
  server: {
    port: 5015,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'entries/index.html'),
      },
    },
  },
})
