import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: {
        quality: 90,
      },
      jpeg: {
        quality: 90,
      },
      jpg: {
        quality: 90,
      },
      tiff: {
        quality: 90,
      },
      gif: {
        optimizationLevel: 3,
      },
      webp: {
        lossless: true,
      },
      avif: {
        lossless: true,
      },
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
                removeViewBox: false, // https://github.com/svg/svgo/issues/1128
              },
            },
          },
          'sortAttrs',
          {
            name: 'addAttributesToSVGElement',
            params: {
              attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
            },
          },
        ],
      },
    }),
  ],
  base: '/',
})