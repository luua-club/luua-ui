import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { Outlet, RouterProvider, useLocation } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { toast } from 'sonner'

import { Toaster } from '@/shared/ui/sonner'

import {
  API_CONSTANTS,
  LUUA_AUTH_INFO_KEY,
  QUERY_KEYS,
} from './core/config/constant'
import { queryClient } from './core/config/global.config'
import { useAppDispatch, useAppSelector } from './core/hooks/global-state.hook'
import { AuthInfo } from './core/models/auth.model'
import { store } from './core/store'
import {
  clearAuth,
  hydrateFromStorage,
  setAuthInfo,
} from './core/store/auth-slice'
import { loadAuthData } from './core/utils/auth-data.util'
import { logout } from './core/utils/common.util'
import router from './router'
import GlobalLoader from './shared/components/global-loader'
import { THEME_LOCAL_STORAGE_KEY } from './shared/config/constant'
import { ThemeProvider } from './shared/provider/theme-provider'
import { syncExtCookie } from './shared/utils/extension-cookie.util'
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
  const dispatch = useAppDispatch()
  const location = useLocation()
  const isLoginRoute = location.pathname === '/login'

  const authInfo = getLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY)
  const isLoggedIn = !!authInfo?.access_token

  // Reactive org/project from Redux — set by hydrateFromStorage (sync on mount)
  // or setAuthInfo (after cascade). Used to gate Outlet rendering.
  const currentOrg = useAppSelector(state => state.authState.currentOrg)
  const currentProject = useAppSelector(state => state.authState.currentProject)

  // Synchronous LS hydration on mount — shows stale data before any API call
  useEffect(() => {
    if (authInfo) dispatch(hydrateFromStorage(authInfo))
    else dispatch(clearAuth())
  }, [dispatch]) // eslint-disable-line react-hooks/exhaustive-deps

  // React Query owns the full 3-API cascade (user profile → resolve IDs → org + project).
  // Re-run from anywhere: queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] })
  const { data, isError, error } = useQuery({
    queryKey: [QUERY_KEYS.user],
    queryFn: loadAuthData,
    enabled: isLoggedIn && !isLoginRoute,
    staleTime: Infinity,
    retry: 1,
  })

  // Track whether we've seen at least one successful cascade result.
  // Used to distinguish "first load" (no data yet) from "cascade completed
  // but project is null" to avoid infinite GlobalLoader.
  const cascadeCompleted = useRef(false)

  useEffect(() => {
    if (!data) return
    dispatch(setAuthInfo(data))
    cascadeCompleted.current = true

    // LS now has complete user + org + project — push to extension cookie
    syncExtCookie(data)

    queryClient.invalidateQueries({
      predicate: q => q.queryKey[0] !== QUERY_KEYS.user,
    })

    if (import.meta.env.PROD && data.user) {
      posthog.identify(data.user.email, {
        email: data.user.email,
        name: data.user.name,
      })
    }
  }, [data, dispatch])

  useEffect(() => {
    if (!isError) return
    const err = error as AxiosError
    if (err?.status !== API_CONSTANTS.statusCode.unauthorized) {
      toast.error(
        'Some error has occurred, please try again later, if the problem persists, please contact support, logging out..'
      )
      setTimeout(() => logout(), 3000)
    } else {
      logout()
    }
  }, [isError, error])

  // On fresh login, LS only has the token — no org/project IDs yet.
  // Block page rendering until the cascade writes them to Redux so the
  // interceptor has valid headers before any page-level query fires.
  // On a refresh, hydrateFromStorage sets org/project from LS immediately
  // so this check resolves to false and there is no visible delay.
  //
  // Once the cascade has completed at least once, stop blocking — if
  // currentProject is null it means the org genuinely has no projects,
  // and we should render the app (not spin forever).
  if (
    isLoggedIn &&
    !isLoginRoute &&
    !cascadeCompleted.current &&
    (!currentOrg || !currentProject)
  ) {
    return <GlobalLoader />
  }

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
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <ThemeProvider storageKey={THEME_LOCAL_STORAGE_KEY}>
              <RouterProvider router={router} />
              <Toaster expand={true} />
            </ThemeProvider>
          </Provider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </PostHogProvider>
  )
}

export default App
