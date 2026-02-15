import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Safely expose API_KEY to client-side code
      // This allows Vercel's "API_KEY" env var to work in the browser
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || ''),
    }
  }
})