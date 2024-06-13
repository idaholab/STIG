import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'path';

const dirname = path.dirname(new URL(import.meta.url).pathname);

export default defineConfig({
  base: '/stig-react',
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
      '@app': path.resolve(dirname, 'app'),
      '@components': path.resolve(dirname, 'src/components'),
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
});
