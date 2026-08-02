import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  appType: 'spa',
  resolve: {
    alias: {
      // Bypass Vite's exports-map resolution for handsontable CSS
      'handsontable/styles': path.resolve(__dirname, 'node_modules/handsontable/styles'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy spreadsheet libraries into separate cacheable chunks
          handsontable: ['handsontable'],
          hyperformula: ['hyperformula'],
          exceljs: ['exceljs'],
        },
      },
    },
  },
  server: {
    port: 5173,
    headers: {
      'Cache-Control': 'no-store',
    },
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
});
