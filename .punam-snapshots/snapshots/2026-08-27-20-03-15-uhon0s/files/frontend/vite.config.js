import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/exports/components.js'),
      '@library': path.resolve(__dirname, './src/exports/library.js'),
      '@styles': path.resolve(__dirname, './src/exports/styles.js'),
    },
  },
});