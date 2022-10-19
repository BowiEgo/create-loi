export default function generateViteConfig({ isMultiPage, needsPxToViewport }) {
  let viteConfig = `import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import vue2 from '@vitejs/plugin-vue2'
import vue2Jsx from '@vitejs/plugin-vue2-jsx'
${
  needsPxToViewport ? `import postcsspxtoviewport from 'postcss-px-to-viewport-with-include'\n` : ''
}
var __dirname

// https://vitejs.dev/config/
export default defineConfig({${
    isMultiPage
      ? `
  root: 'src/pages',
  base: './',
  build: {
    outDir: resolve(__dirname, 'dist'),
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/pages/index/index.html'),
        share: resolve(__dirname, 'src/pages/share/index.html')
      }
    }
  },`
      : ''
  }
  plugins: [
    vue2(),
    vue2Jsx(),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    proxy: {
      '/mock': {
        target: 'http://localhost:3004',
        rewrite: (path) => path.replace(/^\\/mock/, '')
      }
    }
  },
  css: {
    postcss: {
      plugins: [${
        needsPxToViewport
          ? `
        postcsspxtoviewport({
          viewportWidth: '375',
          unitPrecision: 3,
          viewportUnit: 'vw',
          selectorBlackList: [],
          minPixelValue: 1,
          mediaQuery: false,
          include: [/views/, /components/, /widgets/]
        })`
          : ''
      }
      ]
    }
  }
})
`

  return viteConfig
}
