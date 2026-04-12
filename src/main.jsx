import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: 'var(--toast-bg, #fff)',
          color: 'var(--toast-color, #1f2937)',
          border: '1px solid var(--toast-border, #e5e7eb)',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        },
        success: {
          iconTheme: {
            primary: '#6366f1',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  </StrictMode>,
)