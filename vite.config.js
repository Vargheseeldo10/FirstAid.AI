import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Explicitly define the output directory
    emptyOutDir: true, // Ensure old build files are removed before new build
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // Exclude if it's causing issues
  },
});
