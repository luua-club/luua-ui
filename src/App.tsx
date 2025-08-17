import './App.css'

import { GoogleOAuthProvider } from '@react-oauth/google'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { Outlet, RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AxiosError, CanceledError } from 'axios'
import { useEffect } from 'react'
import { Provider } from 'react-redux'

import { userApi } from './core/api/user.api'
import { LUUA_USER_KEY, QUERY_KEYS } from './core/config/constant'
import { useAppDispatch } from './core/hooks/global-state.hook'
import { ILoginResponse } from './core/models/auth.model'
import { store } from './core/store'
import { setUser } from './core/store/auth-slice'
import router from './router'
import { getLocalStorageItem } from './shared/utils/localstorage.util'

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

  // Check if JWT token is present in local storage
  const loginResponse = getLocalStorageItem<ILoginResponse>(LUUA_USER_KEY)
  const isLoggedIn = loginResponse && loginResponse?.access_token

  const { data: userData } = useQuery({
    queryKey: [QUERY_KEYS.user],
    queryFn: () => userApi.getUser(),
    enabled: !!isLoggedIn, // Only run query if user is logged in
    retry: (failureCount, error: AxiosError) => {
      // Don't retry on authentication errors at all
      if (error.response?.status === 401 || error.response?.status === 403) {
        return false
      }
      // Retry canceled requests (e.g., navigation/abort) up to 3 times
      if (
        (error.code === AxiosError.ERR_CANCELED ||
          error instanceof CanceledError) &&
        failureCount < 3
      ) {
        return true
      }
      // Only retry on server errors (5xx) up to 3 times
      if (
        error.response?.status &&
        error.response.status >= 500 &&
        failureCount < 3
      ) {
        return true
      }
      return false
    },
  })

  useEffect(() => {
    // Update store with fresh user data when query succeeds
    if (userData?.data) {
      dispatch(setUser(userData?.data))
    }
  }, [userData, dispatch])

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
