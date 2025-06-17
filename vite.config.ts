import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
    proxy: {
      '/predict': 'http://127.0.0.1:5000',
    },
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    
  },
});
