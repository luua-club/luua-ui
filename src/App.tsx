import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { Outlet, RouterProvider, useLocation } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { toast } from 'sonner'

import { Toaster } from '@/shared/ui/sonner'

import { userApi } from './core/api/user.api'
import {
  API_CONSTANTS,
  LUUA_USER_KEY,
  QUERY_KEYS,
} from './core/config/constant'
import { queryClient } from './core/config/global.config'
import { useAppDispatch } from './core/hooks/global-state.hook'
import { LoginResponse } from './core/models/auth.model'
import { UserSchema } from './core/models/user.model'
import { store } from './core/store'
import { setUser } from './core/store/auth-slice'
import { logout } from './core/utils/common.util'
import router from './router'
import { THEME_LOCAL_STORAGE_KEY } from './shared/config/constant'
import { ThemeProvider } from './shared/provider/theme-provider'
import { getLocalStorageItem } from './shared/utils/localstorage.util'

// Initialize PostHog only in production
if (import.meta.env.PROD) {
  posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_PUBLIC_REVERSE_PROXY_URL,
    person_profiles: 'always',
    capture_exceptions: true,
  })
}

export function AppContent() {
  // ---- Variables ----
  // Check if JWT token is present in local storage
  const loginResponse: LoginResponse | null =
    getLocalStorageItem<LoginResponse>(LUUA_USER_KEY)
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
    error,
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

      // Add user to posthog
      posthog.identify(`${userData.data.email}`, {
        name: userData.data.name,
        email: userData.data.email,
        plan: userData.data.plan,
        linkedin_connected: userData.data.connected_channels.linkedin.connected,
        twitter_connected: userData.data.connected_channels.twitter.connected,
        theme: localStorage.getItem(THEME_LOCAL_STORAGE_KEY),
      })
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
      const err = error as AxiosError

      if (err?.status !== API_CONSTANTS.statusCode.unauthorized) {
        posthog.captureException(error)
        toast.error(
          'Some error has occurred, please try again later, if the problem persists, please contact support, loggin out..'
        )
        setTimeout(() => logout(), 3000)
      } else {
        logout()
      }
    }
  }, [isError, isEnabled, error])

  return (
    <div className="page-fade-in">
      <Outlet />
    </div>
  )
}

function App() {
  return (
    <PostHogProvider client={posthog}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        {/* Google Auth provider */}
        <QueryClientProvider client={queryClient}>
          {/* Query client provider */}
          <Provider store={store}>
            <ThemeProvider storageKey={THEME_LOCAL_STORAGE_KEY}>
              {/* Redux provider */}
              <RouterProvider router={router} /> {/* Router provider */}
              <Toaster expand={true} />
            </ThemeProvider>
          </Provider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </PostHogProvider>
  )
}

export default App
