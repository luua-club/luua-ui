import { zodResolver } from '@hookform/resolvers/zod'
import { CredentialResponse } from '@react-oauth/google'
import { useMutation } from '@tanstack/react-query'
import { createLazyRoute, useRouter } from '@tanstack/react-router'
import { Loader, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import LuuaBlackTextLogo from '@/assets/logos/luua-black-text-logo.svg'
import LuuaWhiteTextLogo from '@/assets/logos/luua-white-text-logo.svg'
import { authApi } from '@/core/api/auth.api'
import {
  EXTERNAL_URLS,
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

import { GoogleLoginButton } from './components/google-login-button'
import IconLogo from './components/logo-header'
import RightPanel from './components/right-panel'
import { OTPVerification } from './containers/otp-verification'

function Login() {
  // ---- States ----
  const [showOtpInput, setShowOtpInput] = useState(false)

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
  const urlParams = new URLSearchParams(window.location.search)
  const isExtensionLogin = urlParams.get('source') === 'extension'
  const extensionId = urlParams.get('extensionId')

  // ---- Hooks ----
  const { theme } = useTheme()
  const router = useRouter()
  const dispatch = useAppDispatch()

  // ---- Mutation ----
  /**
   * Will login user
   */
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

  /**
   * Will send OTP to user
   */
  const magicLinkMutation = useMutation({
    mutationFn: (email: string) => authApi.requestMagicLink({ email }),
    onSuccess: () => {
      setShowOtpInput(true)
      toast.success('OTP sent to your email')
    },
    onError: () => {
      toast.error(
        `Kindly wait a few moments to receive the OTP for email - ${email}`
      )
    },
  })

  // --- Derived Variables ---
  const isLoading = loginMutation.isPending

  // ---- Effects ----
  /**
   * USED FOR EXTENSION LOGIN REDIRECT, NOT PART OF MAIN APP
   * Store extension info and handle already logged in case
   */
  useEffect(() => {
    if (isExtensionLogin && extensionId) {
      // Store extension context in session storage
      setSessionStorageItem(LUUA_EXTENSION_ID_KEY, extensionId)
      setSessionStorageItem(LUUA_EXTENSION_LOGIN_KEY, 'true')

      // Check if user is already logged in
      const existingAuth = getLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY)
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
  }, [isExtensionLogin, extensionId])

  /**
   * USED FOR EXTENSION LOGIN REDIRECT, NOT PART OF MAIN APP
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
    dispatch(clearAuth())
    removeLocalStorageItem(LUUA_AUTH_INFO_KEY)
  }, [dispatch, isExtensionLogin])

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
   * Saves the token and redirects to the dashboard or extension.
   *
   * Normal web flow: saves token → redirects to /dashboard.
   * The React Query cascade in App.tsx fires automatically on dashboard load.
   *
   * Extension flow: needs the user's email before redirecting, so it runs the
   * 3-API cascade eagerly via loadAuthData().
   */
  const updateDataAndRedirect = async (res: LoginResponse) => {
    // Save token fields to LS (partial — cascade fills user/org/project)
    setLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY, {
      access_token: res.access_token,
      token_type: res.token_type,
      new_user: res.new_user,
    })

    // Extension login: needs user email before redirecting to the extension
    const storedExtensionId = getSessionStorageItem<string>(
      LUUA_EXTENSION_ID_KEY
    )
    const extensionLoginFlag = getSessionStorageItem(LUUA_EXTENSION_LOGIN_KEY)
    const isFromExtension =
      extensionLoginFlag === 'true' ||
      (typeof extensionLoginFlag === 'boolean' && extensionLoginFlag === true)

    if (isFromExtension && storedExtensionId) {
      try {
        const authInfo = await loadAuthData()
        removeSessionStorageItem(LUUA_EXTENSION_ID_KEY)
        removeSessionStorageItem(LUUA_EXTENSION_LOGIN_KEY)
        const email = authInfo.user?.email ?? ''
        window.location.href = `chrome-extension://${storedExtensionId}/auth.html?token=${encodeURIComponent(res.access_token)}&userId=${encodeURIComponent(email)}&email=${encodeURIComponent(email)}`
      } catch {
        removeLocalStorageItem(LUUA_AUTH_INFO_KEY)
        toast.error('Something went wrong, Please try again !')
      }
      return
    }

    // Normal web flow: redirect — App.tsx cascade fires on dashboard load
    router.navigate({ to: '/dashboard', search: {} })
  }

  return (
    <div className="bg-background relative flex h-dvh w-full overflow-hidden">
      <Spotlight />

      {/* Left Section */}
      <div className="relative z-10 flex w-full flex-col p-4 lg:w-1/2 lg:p-8">
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
                {/* Google Sign In */}
                <GoogleLoginButton
                  onSuccess={onLogin}
                  onError={() => {
                    toast.error('Something went wrong, Please try again !')
                  }}
                  disabled={magicLinkMutation.isPending}
                  isLoading={isLoading}
                  enableOneTap={!magicLinkMutation.isPending}
                />

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
                        !email?.trim() ||
                        !!errors.email
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
