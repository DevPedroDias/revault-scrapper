import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    electron({
      main: {
        entry: 'application/main.ts',
        vite: {
          build: {
            rollupOptions: {
              external: ['sqlite3', 'typeorm'],
            },
          },
        },
      },
      preload: {
        input: [path.join(__dirname, 'application/preload.ts')],
      },
      renderer: process.env.NODE_ENV === 'test' ? undefined : {},
    }),
  ],
});