declare const __dirname: string

import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig((configEnv: any) => {
  const isDevelopment = configEnv.mode === 'development'

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
    },
    resolve: {
      alias: {
        app: resolve(__dirname, 'src', 'app'),
        components: resolve(__dirname, 'src', 'components'),
        hooks: resolve(__dirname, 'src', 'hooks'),
      },
    },
    css: {
      modules: {
        generateScopedName: isDevelopment
          ? '[name]__[local]__[hash:base64:5]'
          : '[hash:base64:5]',
      },
    },
    build: {
      outDir: 'dist',
    },
  }
})
