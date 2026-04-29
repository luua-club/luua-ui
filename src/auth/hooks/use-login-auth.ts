import { zodResolver } from '@hookform/resolvers/zod'
import type { CredentialResponse } from '@react-oauth/google'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import type { BaseSyntheticEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { authApi } from '@/core/api/auth.api'
import {
  LUUA_AUTH_INFO_KEY,
  LUUA_EXTENSION_ID_KEY,
  LUUA_EXTENSION_LOGIN_KEY,
  QUERY_KEYS,
} from '@/core/config/constant'
import { queryClient } from '@/core/config/global.config'
import { useAppDispatch } from '@/core/hooks/global-state.hook'
import {
  AuthInfo,
  LoginResponse,
  MagicLinkRequest,
  MagicLinkRequestSchema,
} from '@/core/models/auth.model'
import { clearAuth, setAuthInfo } from '@/core/store/auth-slice'
import { loadAuthData } from '@/core/utils/auth-data.util'
import { syncExtCookie } from '@/shared/utils/extension-cookie.util'
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

export type UseLoginAuthResult = {
  state: {
    showOtpInput: boolean
    email: string
    isLoading: boolean
    isMagicLinkPending: boolean
    isVerifyingOtp: boolean
    otpError: boolean
  }
  form: {
    register: UseFormRegister<MagicLinkRequest>
    errors: FieldErrors<MagicLinkRequest>
    onMagicLinkSubmit: (e?: BaseSyntheticEvent) => Promise<void> | void
  }
  actions: {
    onGoogleSuccess: (credentialResponse: CredentialResponse) => void
    onGoogleError: () => void
    onResendOtp: () => void
    onBackFromOtp: () => void
    onVerifyOtp: (otp: string) => void
    resetOtpError: () => void
  }
}

/**
 * All login route business logic: extension handshake, Google + magic-link flows,
 * form state, and post-auth redirect (web + extension).
 *
 * Both Google sign-in and OTP verification share `completeLogin`, which:
 *   1. Persists the access token to localStorage.
 *   2. Runs the user/org/project cascade THROUGH React Query
 *      (`queryClient.fetchQuery({ queryKey: [QUERY_KEYS.user], ... })`) so the
 *      result is cached. After we navigate to /dashboard, App.tsx's
 *      `useQuery({ queryKey: [QUERY_KEYS.user], staleTime: Infinity })` is a
 *      cache hit — preventing the duplicate cascade we used to see in the HAR.
 *
 * The cascade lives inside the mutation's `mutationFn` (not `onSuccess`) so
 * `mutation.isPending` stays true for the entire login → cascade → redirect
 * flow. The login button loader keeps spinning until the user is actually
 * navigated, instead of stopping the moment `POST /login/google` resolves.
 *
 * The cascade is run eagerly (before navigate) because the extension flow
 * builds `chrome-extension://${id}/auth.html?...&email=${authInfo.user.email}`
 * and needs the resolved email before `window.location.href = ...`.
 */
export function useLoginAuth(): UseLoginAuthResult {
  // ---- State ----
  const [showOtpInput, setShowOtpInput] = useState(false)

  // ---- Route context ----
  const urlParams = new URLSearchParams(window.location.search)
  const isExtensionLogin = urlParams.get('source') === 'extension'
  const extensionId = urlParams.get('extensionId')

  const router = useRouter()
  const dispatch = useAppDispatch()

  // ---- Form ----
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<MagicLinkRequest>({
    resolver: zodResolver(MagicLinkRequestSchema),
    defaultValues: { email: '' },
  })
  const email = watch('email')

  // ---- Shared post-token helpers ----

  /**
   * Persist the token, then run the user/org/project cascade through React
   * Query so App.tsx's `useQuery([QUERY_KEYS.user])` finds it in cache and
   * does not re-fetch after the redirect.
   */
  const completeLogin = useCallback(
    async (loginResponse: LoginResponse): Promise<AuthInfo> => {
      setLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY, {
        access_token: loginResponse.access_token,
        token_type: loginResponse.token_type,
        new_user: loginResponse.new_user,
      })
      return queryClient.fetchQuery({
        queryKey: [QUERY_KEYS.user],
        queryFn: loadAuthData,
        staleTime: Infinity,
      })
    },
    []
  )

  /**
   * Synchronous post-cascade redirect. For extension logins, builds the
   * chrome-extension://...auth.html URL using the resolved `authInfo.user.email`.
   * For normal web logins, navigates to /dashboard.
   */
  const redirectAfterLogin = useCallback(
    (loginResponse: LoginResponse, authInfo: AuthInfo) => {
      const storedExtensionId = getSessionStorageItem<string>(
        LUUA_EXTENSION_ID_KEY
      )
      const extensionLoginFlag = getSessionStorageItem(LUUA_EXTENSION_LOGIN_KEY)
      const isFromExtension =
        extensionLoginFlag === 'true' ||
        (typeof extensionLoginFlag === 'boolean' && extensionLoginFlag === true)

      if (isFromExtension && storedExtensionId) {
        removeSessionStorageItem(LUUA_EXTENSION_ID_KEY)
        removeSessionStorageItem(LUUA_EXTENSION_LOGIN_KEY)
        const emailFromAuth = authInfo.user?.email ?? ''
        window.location.href =
          `chrome-extension://${storedExtensionId}/auth.html` +
          `?token=${encodeURIComponent(loginResponse.access_token)}` +
          `&userId=${encodeURIComponent(emailFromAuth)}` +
          `&email=${encodeURIComponent(emailFromAuth)}`
        return
      }

      router.navigate({ to: '/dashboard', search: {} })
    },
    [router]
  )

  /**
   * Roll back partial auth state when the post-token cascade fails.
   * Keeps the user on /login instead of leaving them half-logged-in.
   */
  const rollbackPartialAuth = useCallback(() => {
    removeLocalStorageItem(LUUA_AUTH_INFO_KEY)
    queryClient.removeQueries({ queryKey: [QUERY_KEYS.user] })
  }, [])

  // ---- Mutations ----
  const loginMutation = useMutation({
    mutationFn: async (token: string) => {
      const res = await authApi.login({ token })
      const authInfo = await completeLogin(res.data)
      return { loginResponse: res.data, authInfo }
    },
    onSuccess: ({ loginResponse, authInfo }) => {
      dispatch(setAuthInfo(authInfo))
      syncExtCookie(authInfo)
      redirectAfterLogin(loginResponse, authInfo)
    },
    onError: () => {
      rollbackPartialAuth()
      toast.error('Something went wrong, Please try again !')
    },
  })

  const verifyOtpMutation = useMutation({
    mutationFn: async (otp: string) => {
      const res = await authApi.verifyMagicLink({ token: otp })
      const authInfo = await completeLogin(res.data)
      return { loginResponse: res.data, authInfo }
    },
    onSuccess: ({ loginResponse, authInfo }) => {
      dispatch(setAuthInfo(authInfo))
      syncExtCookie(authInfo)
      redirectAfterLogin(loginResponse, authInfo)
    },
    onError: () => {
      // Keep the user on the OTP screen; the OTP container reads
      // `verifyOtpMutation.isError` via `state.otpError` to show inline error.
      rollbackPartialAuth()
    },
  })

  const magicLinkMutation = useMutation({
    mutationFn: (emailArg: string) =>
      authApi.requestMagicLink({ email: emailArg }),
    onSuccess: () => {
      setShowOtpInput(true)
      toast.success('OTP sent to your email')
    },
    onError: () => {
      toast.error(
        `Kindly wait a few moments to receive the OTP for email - ${getValues('email')}`
      )
    },
  })

  // ---- Action handlers ----
  const onGoogleSuccess = useCallback(
    (credentialResponse: CredentialResponse) => {
      if (!credentialResponse.credential) return
      loginMutation.mutate(credentialResponse.credential)
    },
    [loginMutation]
  )

  const onGoogleError = useCallback(() => {
    toast.error('Something went wrong, Please try again !')
  }, [])

  const onResendOtp = useCallback(() => {
    magicLinkMutation.mutate(email)
  }, [email, magicLinkMutation])

  const onBackFromOtp = useCallback(() => {
    setShowOtpInput(false)
    verifyOtpMutation.reset()
  }, [verifyOtpMutation])

  const onVerifyOtp = useCallback(
    (otp: string) => {
      verifyOtpMutation.mutate(otp)
    },
    [verifyOtpMutation]
  )

  const resetOtpError = useCallback(() => {
    if (verifyOtpMutation.isError) verifyOtpMutation.reset()
  }, [verifyOtpMutation])

  // ---- Effects ----
  /**
   * USED FOR EXTENSION LOGIN REDIRECT, NOT PART OF MAIN APP
   * Store extension info and handle already logged in case
   */
  useEffect(() => {
    if (isExtensionLogin && extensionId) {
      setSessionStorageItem(LUUA_EXTENSION_ID_KEY, extensionId)
      setSessionStorageItem(LUUA_EXTENSION_LOGIN_KEY, 'true')

      const existingAuth = getLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY)
      if (existingAuth?.access_token && existingAuth?.user?.email) {
        syncExtCookie()

        const extensionRedirectUrl = `chrome-extension://${extensionId}/auth.html?token=${encodeURIComponent(existingAuth.access_token)}&userId=${encodeURIComponent(existingAuth.user.email)}&email=${encodeURIComponent(existingAuth.user.email)}`

        removeSessionStorageItem(LUUA_EXTENSION_ID_KEY)
        removeSessionStorageItem(LUUA_EXTENSION_LOGIN_KEY)

        window.location.href = extensionRedirectUrl
        return
      }
    }
  }, [isExtensionLogin, extensionId])

  /**
   * USED FOR EXTENSION LOGIN REDIRECT, NOT PART OF MAIN APP
   * Clear user and local storage on mount (only if not extension login)
   */
  useEffect(() => {
    if (isExtensionLogin) {
      return
    }

    removeSessionStorageItem(LUUA_EXTENSION_ID_KEY)
    removeSessionStorageItem(LUUA_EXTENSION_LOGIN_KEY)

    dispatch(clearAuth())
    removeLocalStorageItem(LUUA_AUTH_INFO_KEY)
  }, [dispatch, isExtensionLogin])

  // ---- Public API ----
  return {
    state: {
      showOtpInput,
      email,
      isLoading: loginMutation.isPending,
      isMagicLinkPending: magicLinkMutation.isPending,
      isVerifyingOtp: verifyOtpMutation.isPending,
      otpError: verifyOtpMutation.isError,
    },
    form: {
      register,
      errors,
      onMagicLinkSubmit: handleSubmit(data =>
        magicLinkMutation.mutate(data.email)
      ),
    },
    actions: {
      onGoogleSuccess,
      onGoogleError,
      onResendOtp,
      onBackFromOtp,
      onVerifyOtp,
      resetOtpError,
    },
  }
}
