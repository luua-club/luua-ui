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
} from '@/core/config/constant'
import { useAppDispatch } from '@/core/hooks/global-state.hook'
import {
  AuthInfo,
  LoginResponse,
  MagicLinkRequest,
  MagicLinkRequestSchema,
} from '@/core/models/auth.model'
import { clearAuth } from '@/core/store/auth-slice'
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
  }
  form: {
    register: UseFormRegister<MagicLinkRequest>
    errors: FieldErrors<MagicLinkRequest>
    onMagicLinkSubmit: (e?: BaseSyntheticEvent) => Promise<void> | void
  }
  actions: {
    onGoogleSuccess: (credentialResponse: CredentialResponse) => Promise<void>
    onGoogleError: () => void
    onResendOtp: () => void
    onBackFromOtp: () => void
    onOtpVerifySuccess: (res: LoginResponse) => void | Promise<void>
  }
}

/**
 * All login route business logic: extension handshake, Google + magic-link flows,
 * form state, and post-auth redirect (web + extension).
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

  // ---- Handlers (declared before mutations where referenced) ----

  /**
   * Saves the token and redirects to the dashboard or extension.
   *
   * Normal web flow: saves token → redirects to /dashboard.
   * The React Query cascade in App.tsx fires automatically on dashboard load.
   *
   * Extension flow: needs the user's email before redirecting, so it runs the
   * 3-API cascade eagerly via loadAuthData().
   */
  const updateDataAndRedirect = useCallback(
    async (res: LoginResponse) => {
      setLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY, {
        access_token: res.access_token,
        token_type: res.token_type,
        new_user: res.new_user,
      })

      let authInfo: AuthInfo | null = null
      try {
        authInfo = await loadAuthData()
        syncExtCookie(authInfo)
      } catch {
        // Cascade failed — continue to navigate; App.tsx will retry
      }

      const storedExtensionId = getSessionStorageItem<string>(
        LUUA_EXTENSION_ID_KEY
      )
      const extensionLoginFlag = getSessionStorageItem(LUUA_EXTENSION_LOGIN_KEY)
      const isFromExtension =
        extensionLoginFlag === 'true' ||
        (typeof extensionLoginFlag === 'boolean' && extensionLoginFlag === true)

      if (isFromExtension && storedExtensionId) {
        if (!authInfo) {
          removeLocalStorageItem(LUUA_AUTH_INFO_KEY)
          toast.error('Something went wrong, Please try again !')
          return
        }
        removeSessionStorageItem(LUUA_EXTENSION_ID_KEY)
        removeSessionStorageItem(LUUA_EXTENSION_LOGIN_KEY)
        const emailFromAuth = authInfo.user?.email ?? ''
        window.location.href = `chrome-extension://${storedExtensionId}/auth.html?token=${encodeURIComponent(res.access_token)}&userId=${encodeURIComponent(emailFromAuth)}&email=${encodeURIComponent(emailFromAuth)}`
        return
      }

      router.navigate({ to: '/dashboard', search: {} })
    },
    [router]
  )

  // ---- Mutations ----
  const loginMutation = useMutation({
    mutationFn: (token: string) => authApi.login({ token }),
    onSuccess: response => {
      void updateDataAndRedirect(response.data)
    },
    onError: () => {
      toast.error('Something went wrong, Please try again !')
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

  const onGoogleSuccess = useCallback(
    async (credentialResponse: CredentialResponse) => {
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
  }, [])

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
      onOtpVerifySuccess: updateDataAndRedirect,
    },
  }
}
