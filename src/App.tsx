import './App.css'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Outlet, RouterProvider, useRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useEffect } from 'react'
import { Provider } from 'react-redux'

import { userApi } from './core/api/user.api'
import { LUUA_USER_KEY } from './core/config/constant'
import { getLocalStorageItem } from './core/config/utils/localstorage.util'
import { useAppDispatch } from './core/hooks/global-state.hook'
import { store } from './core/store'
import { setUser } from './core/store/auth-slice'
import router from './router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

export function AppContent() {
  const dispatch = useAppDispatch()
  const routerInstance = useRouter()

  useEffect(() => {
    // Check if JWT token is present in local storage
    const token = getLocalStorageItem(LUUA_USER_KEY)
    if (!token) {
      // If user is not logged in
      // and the current path is not login, redirect to login
      if (routerInstance.state.location.pathname === '/login') {
        return
      }
      routerInstance.navigate({ to: '/login' })
      return
    }

    // If user logged in, but page is refreshed, get fresh user data to hydrate store
    // If user is not logged in, the base API will handle the 401 error and redirect to login
    userApi.getUser().then(res => dispatch(setUser(res.data)))
  }, [])

  return (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  )
}

export default App
