import './index.css'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import router from './router'

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </GoogleOAuthProvider>
)
