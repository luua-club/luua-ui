import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { Outlet, RouterProvider, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { toast } from 'sonner'

import { Toaster } from '@/shared/ui/sonner'

import { userApi } from './core/api/user.api'
import { LUUA_USER_KEY, QUERY_KEYS } from './core/config/constant'
import { queryClient } from './core/config/global.config'
import { useAppDispatch } from './core/hooks/global-state.hook'
import { LoginResponse, LoginResponseSchema } from './core/models/auth.model'
import { UserSchema } from './core/models/user.model'
import { store } from './core/store'
import { setUser } from './core/store/auth-slice'
import { logout } from './core/utils/common.util'
import router from './router'
import { getLocalStorageItem } from './shared/utils/localstorage.util'

export function AppContent() {
  // ---- Variables ----
  // Check if JWT token is present in local storage
  const parsed = LoginResponseSchema.safeParse(
    getLocalStorageItem<unknown>(LUUA_USER_KEY)
  )
  const loginResponse: LoginResponse | null = parsed.success
    ? parsed.data
    : null
  const isLoggedIn = !!loginResponse?.access_token

  // ---- Hooks ----
  const dispatch = useAppDispatch()
  const location = useLocation()
  const isLoginRoute = location.pathname === '/login'

  // GET user profile, Do not run login route (the same is also ran there)
  const {
    data: userData,
    isError,
    isEnabled,
  } = useQuery({
    queryKey: [QUERY_KEYS.user],
    queryFn: () => userApi.getUser(),
    enabled: !!isLoggedIn && !isLoginRoute,
  })

  // ---- Effects ----
  // Update store with fresh user data when query succeeds
  useEffect(() => {
    if (!userData?.data) {
      return
    }

    if (UserSchema.safeParse(userData.data).success) {
      dispatch(setUser(userData.data))
    } else {
      toast.error('Something went wrong, Please try again !')
      logout()
    }
  }, [userData, dispatch])

  // If User profile API fails and is also enabled then run this effect
  // Note: isEnabled is used because the same query is also ran in login page
  // so to avoid conflicts and race condition it is used
  useEffect(() => {
    if (isError && isEnabled) {
      toast.error('Something went wrong, Please try again !')
      logout()
    }
  }, [isError, isEnabled])

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
          <Toaster />
        </Provider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  )
}

export default App
