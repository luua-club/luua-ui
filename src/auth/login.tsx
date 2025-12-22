import { CredentialResponse } from '@react-oauth/google'
import {
  useIsFetching,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { createLazyRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { authApi } from '@/core/api/auth.api'
import { userApi } from '@/core/api/user.api'
import {
  LUUA_EXTENSION_ID_KEY,
  LUUA_EXTENSION_LOGIN_KEY,
  LUUA_USER_KEY,
  QUERY_KEYS,
} from '@/core/config/constant'
import { useAppDispatch } from '@/core/hooks/global-state.hook'
import { LoginResponse } from '@/core/models/auth.model'
import { User } from '@/core/models/user.model'
import { clearUser, setUser } from '@/core/store/auth-slice'
import { cn } from '@/shared/utils'
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/shared/utils/localstorage.util'
import {
  getSessionStorageItem,
  removeSessionStorageItem,
  setSessionStorageItem,
} from '@/shared/utils/sessionstorage.util'

import LoginPanel from './components/login-panel'

function Login() {
  // ---- States ----
  const [mounted, setMounted] = useState(false)

  // ---- Variables ----
  const key = useMemo(() => LUUA_USER_KEY, [])
  const urlParams = new URLSearchParams(window.location.search)
  const isExtensionLogin = urlParams.get('source') === 'extension'
  const extensionId = urlParams.get('extensionId')

  // ---- Hooks ----
  const router = useRouter()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const loginMutation = useMutation({
    mutationFn: (token: string) =>
      authApi.login({
        token,
      }),
    onSuccess: response => {
      updateDataAndRedirect(response.data)
    },
    onError: () => {
      toast.error('Something went wrong, Please try again !')
    },
  })
  const isFetchingUser = useIsFetching({ queryKey: [QUERY_KEYS.user] })

  // ---- Effects ----
  /**
   * Store extension info and handle already logged in case
   */
  useEffect(() => {
    if (isExtensionLogin && extensionId) {
      // Store extension context in session storage
      setSessionStorageItem(LUUA_EXTENSION_ID_KEY, extensionId)
      setSessionStorageItem(LUUA_EXTENSION_LOGIN_KEY, 'true')

      // Check if user is already logged in
      const existingAuth = getLocalStorageItem<LoginResponse & { user?: User }>(
        key
      )
      if (existingAuth?.access_token && existingAuth?.user?.email) {
        // Build extension redirect URL with existing credentials
        const extensionRedirectUrl = `chrome-extension://${extensionId}/auth.html?token=${encodeURIComponent(existingAuth.access_token)}&userId=${encodeURIComponent(existingAuth.user.email)}&email=${encodeURIComponent(existingAuth.user.email)}`

        // Clear extension flags
        removeSessionStorageItem(LUUA_EXTENSION_ID_KEY)
        removeSessionStorageItem(LUUA_EXTENSION_LOGIN_KEY)

        // Redirect to extension
        window.location.href = extensionRedirectUrl
        return
      }
    }
  }, [isExtensionLogin, extensionId, key])

  /**
   * Clear user and local storage on mount (only if not extension login or not already logged in)
   */
  useEffect(() => {
    // Skip everything if this is an extension login
    if (isExtensionLogin) {
      return
    }

    // Clear any stale extension session storage if this is NOT an extension login
    removeSessionStorageItem(LUUA_EXTENSION_ID_KEY)
    removeSessionStorageItem(LUUA_EXTENSION_LOGIN_KEY)

    // Clear user and auth data for fresh login
    dispatch(clearUser())
    removeLocalStorageItem(key)
  }, [dispatch, key, isExtensionLogin])

  /**
   * Defer animations until after first mount to avoid flash
   */
  useEffect(() => {
    setMounted(true)
  }, [])

  /**
   * Handles the login process
   *
   * @param credentialResponse - The credential response from Google
   * @returns The login response
   */
  const onLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return
    loginMutation.mutate(credentialResponse.credential)
  }

  /**
   * Updates the store and redirects to the dashboard or extension
   *
   * @param res - The login response
   */
  const updateDataAndRedirect = async (res: LoginResponse) => {
    setLocalStorageItem(key, res)

    try {
      const response = await queryClient.fetchQuery({
        queryKey: [QUERY_KEYS.user],
        queryFn: () => userApi.getUser(),
        staleTime: 0,
        retry: false,
      })

      dispatch(setUser(response.data))
      setLocalStorageItem(key, {
        ...getLocalStorageItem<LoginResponse>(key),
        user: response.data,
      })

      // Check if this login came from the extension
      const storedExtensionId = getSessionStorageItem<string>(
        LUUA_EXTENSION_ID_KEY
      )
      const extensionLoginFlag = getSessionStorageItem(LUUA_EXTENSION_LOGIN_KEY)
      // Handle both boolean true and string 'true' (JSON.parse converts "true" to true)
      const isFromExtension =
        extensionLoginFlag === 'true' ||
        (typeof extensionLoginFlag === 'boolean' && extensionLoginFlag === true)

      if (
        isFromExtension &&
        storedExtensionId &&
        res.access_token &&
        response.data.email
      ) {
        // Clear storage
        removeSessionStorageItem(LUUA_EXTENSION_ID_KEY)
        removeSessionStorageItem(LUUA_EXTENSION_LOGIN_KEY)

        // Build extension redirect URL
        const extensionRedirectUrl = `chrome-extension://${storedExtensionId}/auth.html?token=${encodeURIComponent(res.access_token)}&userId=${encodeURIComponent(response.data.email)}&email=${encodeURIComponent(response.data.email)}`

        // Redirect to extension
        window.location.href = extensionRedirectUrl
        return
      }

      // Normal web app redirect (clear query params)
      router.navigate({ to: '/welcome', search: {} })
    } catch {
      removeLocalStorageItem(key)
      toast.error('Something went wrong, Please try again !')
    }
  }

  return (
    <div className="bg-card flex min-h-screen w-screen items-center justify-center overflow-hidden">
      {/** Login */}
      <div
        className={cn(
          'z-1 w-full max-w-[720px] px-4',
          !mounted && 'opacity-0',
          mounted &&
            'motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 transform-gpu will-change-[transform,opacity] motion-safe:delay-75 motion-safe:duration-700 motion-safe:ease-out'
        )}
      >
        <LoginPanel
          isLoading={loginMutation.isPending || isFetchingUser > 0}
          onLogin={onLogin}
        />
      </div>
    </div>
  )
}

//--- Lazy Route ---
export const Route = createLazyRoute('/login')({
  component: Login,
})

export default Login
