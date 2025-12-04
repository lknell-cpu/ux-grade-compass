import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify('AIzaSyBMb8I5dpB_lrW4zrsSjVR6bpH2dLgrAF0'),
    'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify('ux-grade-compass.firebaseapp.com'),
    'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify('ux-grade-compass'),
    'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify('ux-grade-compass.firebasestorage.app'),
    'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify('777272444232'),
    'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify('1:777272444232:web:e41398aa551a8ffa009f7d'),
  },
})
