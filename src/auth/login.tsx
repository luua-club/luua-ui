import { zodResolver } from '@hookform/resolvers/zod'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import {
  useIsFetching,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { createLazyRoute, useRouter } from '@tanstack/react-router'
import { Loader, Mail } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import LuuaBlackTextLogo from '@/assets/logos/luua-black-text-logo.svg'
import LuuaWhiteTextLogo from '@/assets/logos/luua-white-text-logo.svg'
import { authApi } from '@/core/api/auth.api'
import { userApi } from '@/core/api/user.api'
import {
  EXTERNAL_URLS,
  LUUA_EXTENSION_ID_KEY,
  LUUA_EXTENSION_LOGIN_KEY,
  LUUA_USER_KEY,
  QUERY_KEYS,
} from '@/core/config/constant'
import { useAppDispatch } from '@/core/hooks/global-state.hook'
import {
  LoginResponse,
  MagicLinkRequest,
  MagicLinkRequestSchema,
} from '@/core/models/auth.model'
import { User } from '@/core/models/user.model'
import { clearUser, setUser } from '@/core/store/auth-slice'
import { useTheme } from '@/shared/provider/theme-provider'
import { Button } from '@/shared/ui/button'
import { Highlighter } from '@/shared/ui/highlighter'
import { Input } from '@/shared/ui/input'
import { Spotlight } from '@/shared/ui/spotlight-new'
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

import IconLogo from './components/logo-header'
import { OTPVerification } from './components/otp-verification'
import RightPanel from './components/right-panel'

function Login() {
  // ---- States ----
  const [buttonReady, setButtonReady] = useState(false)
  const [showOtpInput, setShowOtpInput] = useState(false)

  // --- Refs ---
  const buttonRef = useRef<HTMLDivElement | null>(null)

  // --- Forms ---
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MagicLinkRequest>({
    resolver: zodResolver(MagicLinkRequestSchema),
    defaultValues: { email: '' },
  })
  const email = watch('email')

  // ---- Variables ----
  const key = useMemo(() => LUUA_USER_KEY, [])
  const urlParams = new URLSearchParams(window.location.search)
  const isExtensionLogin = urlParams.get('source') === 'extension'
  const extensionId = urlParams.get('extensionId')

  // ---- Hooks ----
  const { theme } = useTheme()
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
  const magicLinkMutation = useMutation({
    mutationFn: (email: string) => authApi.requestMagicLink({ email }),
    onSuccess: () => {
      setShowOtpInput(true)
      toast.success('OTP sent to your email')
    },
    onError: () => {
      toast.error('Failed to send OTP. Please try again.')
    },
  })
  const isFetchingUser = useIsFetching({ queryKey: [QUERY_KEYS.user] })

  // --- Derived Variables ---
  const isLoading = loginMutation.isPending || isFetchingUser > 0

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
   * Show the Google button only after its iframe is present to avoid snap
   */
  useEffect(() => {
    if (isLoading || showOtpInput) return

    const el = buttonRef.current
    if (!el) return

    // Already mounted?
    if (el.querySelector('iframe')) {
      // Next frame to allow paint before transition, then small delay for smoother entrance
      const rafId = requestAnimationFrame(() => {
        const tId = window.setTimeout(() => setButtonReady(true), 250)
        // cleanup mirrors below return
        ;(cleanupFns => cleanupFns.push(() => window.clearTimeout(tId)))(
          cleanup
        )
      })
      const cleanup: Array<() => void> = [() => cancelAnimationFrame(rafId)]
      return () => cleanup.forEach(fn => fn())
    }

    const observer = new MutationObserver(() => {
      if (el.querySelector('iframe')) {
        // slight delay so the iframe has painted before we reveal
        window.setTimeout(() => setButtonReady(true), 250)
        observer.disconnect()
      }
    })
    observer.observe(el, { childList: true, subtree: true })

    // Fallback in case iframe takes too long
    const timeout = window.setTimeout(() => {
      // even on fallback, keep a tiny delay to maintain consistency
      window.setTimeout(() => setButtonReady(true), 150)
      observer.disconnect()
    }, 1500)

    return () => {
      observer.disconnect()
      window.clearTimeout(timeout)
    }
  }, [isLoading, showOtpInput])

  // ---- Handlers ----
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
   * Handles magic link request,
   * Sends email to user of OTP
   */
  const handleMagicLinkRequest = (data: MagicLinkRequest) => {
    magicLinkMutation.mutate(data.email)
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
    <div className="bg-background relative flex min-h-screen w-full overflow-hidden">
      <Spotlight />

      {/* Left Section */}
      <div className="relative z-10 flex w-full flex-col p-8 lg:w-1/2 lg:p-8">
        <div className="relative flex flex-1 flex-col items-center justify-center">
          {/* Conditional Content: OTP View or Default Login View */}
          {showOtpInput ? (
            /* OTP Verification View */
            <div className="w-full max-w-sm">
              <OTPVerification
                email={email}
                isResending={magicLinkMutation.isPending}
                onVerifySuccess={updateDataAndRedirect}
                onResend={() => {
                  magicLinkMutation.mutate(email)
                }}
                onBack={() => {
                  setShowOtpInput(false)
                }}
              />
            </div>
          ) : (
            <>
              {/* Header */}
              <LoginHeader />

              {/* Auth Options */}
              <div className="w-full max-w-sm space-y-4">
                {/* Google Sign In (reserve space and fade-in when iframe is ready) */}
                <div className="relative flex h-[44px] w-full items-center justify-center">
                  {isLoading ? (
                    <Loader className="text-foreground size-6 animate-spin" />
                  ) : (
                    <div
                      ref={buttonRef}
                      className={`w-full transform-gpu transition-opacity duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity] ${
                        buttonReady ? 'opacity-100' : 'opacity-0'
                      } ${magicLinkMutation.isPending ? 'pointer-events-none' : ''}`}
                      style={
                        magicLinkMutation.isPending
                          ? { opacity: 0.5 }
                          : undefined
                      }
                    >
                      <GoogleLogin
                        onSuccess={onLogin}
                        onError={() => {
                          toast.error(
                            'Something went wrong, Please try again !'
                          )
                        }}
                        theme={theme === 'dark' ? 'filled_black' : 'outline'}
                        text="continue_with"
                        width={'100%'}
                        shape="circle"
                        useOneTap={!magicLinkMutation.isPending}
                        cancel_on_tap_outside
                      />
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 border-t border-dashed border-gray-300 dark:border-gray-700" />
                  <span className="text-muted-foreground text-sm">Or</span>
                  <div className="h-px flex-1 border-t border-dashed border-gray-300 dark:border-gray-700" />
                </div>

                {/* Magic Link */}
                <form
                  className="h-16 space-y-1"
                  onSubmit={handleSubmit(handleMagicLinkRequest)}
                  noValidate
                >
                  <div className="relative">
                    {/* Icon */}
                    <Mail className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />

                    {/* Input */}
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...register('email')}
                      className={`border-border bg-background text-foreground placeholder:text-muted-foreground h-10 rounded-full pr-28 pl-12 text-base ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      disabled={isLoading || magicLinkMutation.isPending}
                    />

                    {/* Button */}
                    <Button
                      type="submit"
                      className="absolute top-1/2 right-1.5 h-7 -translate-y-1/2 rounded-full px-4 text-xs font-medium"
                      variant="default"
                      size={'sm'}
                      disabled={
                        isLoading ||
                        magicLinkMutation.isPending ||
                        !email?.trim()
                      }
                    >
                      {magicLinkMutation.isPending ? (
                        <Loader className="size-4 animate-spin" />
                      ) : (
                        'Get OTP'
                      )}
                    </Button>
                  </div>

                  {errors.email && (
                    <p className="pl-4 text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </form>
              </div>

              {/* Terms & conditions*/}
              <TermsAndPrivacy />
            </>
          )}
        </div>
      </div>

      {/* Right Section - Hidden on mobile/tablet */}
      <RightPanel theme={theme} />
    </div>
  )
}

const LoginHeader = () => {
  return (
    <>
      {/* Logo */}
      <div className="absolute top-0 left-0 hidden md:block">
        <img src={LuuaBlackTextLogo} alt="Luua" className="h-6 dark:hidden" />
        <img
          src={LuuaWhiteTextLogo}
          alt="Luua"
          className="hidden h-6 dark:block"
        />
      </div>

      {/* Icon Logo */}
      <div className="mb-4 sm:mb-8">
        <IconLogo />
      </div>

      <h1 className="text-foreground mb-2 text-center text-3xl font-semibold tracking-tight sm:text-5xl">
        A Social media tool
      </h1>

      {/* Description */}
      <p className="mb-12 text-center font-medium sm:text-xl">
        <Highlighter
          action="underline"
          color="#FF9800"
          padding={4}
          animationDuration={500}
          iterations={8}
        >
          to accelerate your personal brand.
        </Highlighter>
      </p>
    </>
  )
}

const TermsAndPrivacy = () => {
  return (
    <p className="text-muted-foreground mt-2 text-center text-xs">
      By continuing, you agree to our{' '}
      <a
        href={EXTERNAL_URLS.tos}
        className="text-foreground hover:text-foreground/80 font-medium underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Terms of Condition
      </a>
      <br />
      and{' '}
      <a
        href={EXTERNAL_URLS.privacy}
        className="text-foreground hover:text-foreground/80 font-medium underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Privacy Policy
      </a>
      .
    </p>
  )
}

//--- Lazy Route ---
export const Route = createLazyRoute('/login')({
  component: Login,
})

export default Login
