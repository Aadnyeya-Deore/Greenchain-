import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-wagmi': ['wagmi', 'viem', '@wagmi/core'],
          'vendor-walletconnect': ['@walletconnect/core', '@walletconnect/utils'],
          'vendor-reown': ['@reown/appkit', '@reown/appkit-adapter-wagmi'],
          'vendor-query': ['@tanstack/react-query'],
        },
      },
    },
  },
})
