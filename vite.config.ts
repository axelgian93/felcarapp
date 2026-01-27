import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno (como las del archivo .env)
  // Fix: Property 'cwd' does not exist on type 'Process'
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            leaflet: ['leaflet'],
            ui: ['lucide-react']
          }
        }
      },
      chunkSizeWarningLimit: 1200,
    },
    define: {
      // Esto permite que el código siga usando 'process.env.API_KEY'
      // tomando el valor de VITE_API_KEY de tu archivo .env
      'process.env': {
        API_KEY: env.VITE_API_KEY
      }
    }
  };
});
