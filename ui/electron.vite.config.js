// electron.vite.config.js
import { defineConfig, splitVendorChunkPlugin, externalizeDepsPlugin } from 'electron-vite'
import { join } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    entry: 'src/main/main.js',
    build: {
      outDir: 'dist/main'
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: join(__dirname, 'src/main/preload.js'),
      },
      outDir: 'dist/preload'
    },
  },
  renderer: {
    plugins: [splitVendorChunkPlugin()],
    build: {
      rollupOptions: {
        input: join(__dirname, 'src/renderer/index.html'),
      },
      outDir: 'dist/renderer',
    },
  },
})
