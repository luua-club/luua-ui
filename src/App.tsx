import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { Outlet, RouterProvider } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Provider } from 'react-redux'

import { userApi } from './core/api/user.api'
import { LUUA_USER_KEY, QUERY_KEYS } from './core/config/constant'
import { queryClient } from './core/config/global.config'
import { useAppDispatch } from './core/hooks/global-state.hook'
import { ILoginResponse } from './core/models/auth.model'
import { store } from './core/store'
import { setUser } from './core/store/auth-slice'
import router from './router'
import { getLocalStorageItem } from './shared/utils/localstorage.util'

export function AppContent() {
  // ---- Variables ----
  // Check if JWT token is present in local storage
  const loginResponse = getLocalStorageItem<ILoginResponse>(LUUA_USER_KEY)
  const isLoggedIn = loginResponse && loginResponse.access_token

  // ---- Hooks ----
  const dispatch = useAppDispatch()

  // GET user profile
  const { data: userData } = useQuery({
    queryKey: [QUERY_KEYS.user],
    queryFn: () => userApi.getUser(),
    enabled: !!isLoggedIn,
  })

  // ---- Effects ----
  // Update store with fresh user data when query succeeds
  useEffect(() => {
    if (userData?.data) {
      dispatch(setUser(userData?.data))
    }
  }, [userData, dispatch])

  return (
    <>
      <Outlet />
    </>
  )
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {/* Google Auth provider */}
      <QueryClientProvider client={queryClient}>
        {/* Query client provider */}
        <Provider store={store}>
          {/* Redux provider */}
          <RouterProvider router={router} /> {/* Router provider */}
        </Provider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  )
}

export default App
