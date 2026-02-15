import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables from .env files or system environment
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Capture the API key from various possible sources
  // Vercel automatically exposes env vars starting with VITE_ to the browser build
  const apiKey = env.VITE_API_KEY || env.API_KEY || process.env.VITE_API_KEY || process.env.API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Safely expose API_KEY to client-side code
      // We prioritize VITE_API_KEY but also fallback to API_KEY
      'process.env.API_KEY': JSON.stringify(apiKey),
    }
  }
})