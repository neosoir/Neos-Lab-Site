import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const allowedHosts = process.env.VITE_ALLOWED_HOSTS?.split(',') || ['localhost'];

console.log('allowedHosts', allowedHosts);

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      host: 'localhost',
    },
    allowedHosts
  },
  plugins: [react()],
})
