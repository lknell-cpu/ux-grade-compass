import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './AuthContext.jsx'
import ProtectedApp from './ProtectedApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProtectedApp />
    </AuthProvider>
  </StrictMode>,
)
