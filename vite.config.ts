import { rmSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import WindiCSS from 'vite-plugin-windicss'
import solidPlugin from 'vite-plugin-solid'

rmSync('dist', { recursive: true, force: true }) // v14.14.0

export default defineConfig({
  plugins: [
    solidPlugin(),
    WindiCSS(),
    electron({
      main: {
        entry: 'electron/main.ts',
      },
      preload: {
        input: {
          // Must be use absolute path, this is the restrict of Rollup
          preload: join(__dirname, 'electron/preload.ts'),
        },
      },
      // Enables use of Node.js API in the Renderer-process
      // https://github.com/electron-vite/vite-plugin-electron/tree/main/packages/electron-renderer#electron-renderervite-serve
      renderer: {},
    }),
  ],
  resolve: {
    alias: {
      "@": join(__dirname, './src'),
    }
  }
})
