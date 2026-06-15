import { createLazyRoute } from '@tanstack/react-router'
import { X } from 'lucide-react'

import luuaIconLogo from '@/assets/logos/luua-black-icon-logo.svg'
import LuuaBlackTextLogo from '@/assets/logos/luua-black-text-logo.svg'
import luuaWhiteIconLogo from '@/assets/logos/luua-white-icon-logo.svg'
import LuuaWhiteTextLogo from '@/assets/logos/luua-white-text-logo.svg'
import { EXTERNAL_URLS } from '@/core/config/constant'

import { GoogleLoginButton } from './components/google-login-button'
import { MagicLinkForm } from './components/magic-link-form'
import { OTPVerification } from './containers/otp-verification'
import { useLoginAuth } from './hooks/use-login-auth'

function Login() {
  // All API / storage / redirect / extension logic lives in the hook.
  const auth = useLoginAuth()
  const { state, form, actions } = auth
  const isOtpStep = state.showOtpInput

  return (
    <div className="bg-secondary dark:bg-secondary/70 relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden p-6">
      {/* Dotted grid background */}
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)',
          backgroundSize: '24px 24px',
          opacity: 0.12,
        }}
      />

      <div className="border-border bg-card relative z-10 w-full max-w-md overflow-hidden rounded-lg border p-7">
        {/* top inner sheen */}
        <div
          aria-hidden
          className="absolute inset-x-9 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
        />

        <Wordmark />

        {isOtpStep ? (
          <div className="mt-8">
            <OTPVerification auth={auth} />
          </div>
        ) : (
          <>
            <Hero />

            <div className="mt-8 space-y-4">
              <GoogleLoginButton
                onSuccess={actions.onGoogleSuccess}
                onError={actions.onGoogleError}
                disabled={state.isMagicLinkPending}
                isLoading={state.isLoading}
                enableOneTap={!state.isMagicLinkPending}
              />

              <OrSeparator />

              <MagicLinkForm
                register={form.register}
                errors={form.errors}
                isLoading={state.isLoading}
                isMagicLinkPending={state.isMagicLinkPending}
                onSubmit={form.onMagicLinkSubmit}
              />
            </div>

            <Terms />
          </>
        )}
      </div>
    </div>
  )
}

/** Luua icon + wordmark, light/dark aware. */
function Wordmark() {
  return (
    <div className="flex items-center gap-3">
      <img src={luuaIconLogo} alt="Luua" className="size-8 dark:hidden" />
      <img
        src={luuaWhiteIconLogo}
        alt="Luua"
        className="hidden size-8 dark:block"
      />
      <img src={LuuaBlackTextLogo} alt="Luua" className="h-6 dark:hidden" />
      <img
        src={LuuaWhiteTextLogo}
        alt="Luua"
        className="hidden h-6 dark:block"
      />
    </div>
  )
}

/** Marketing copy above the auth options (default login step only). */
function Hero() {
  return (
    <div className="mt-10 space-y-3">
      <p className="text-muted-foreground text-[0.65rem] font-semibold tracking-[0.2em] uppercase">
        Sign in to Luua
      </p>

      <h1 className="text-foreground text-3xl leading-tight font-semibold tracking-tight text-balance">
        A Social <span className="font-medium italic">media</span> tool
      </h1>

      <p className="text-muted-foreground">
        Turn ideas into ready-to-publish content — without the extra team.
      </p>
    </div>
  )
}

function OrSeparator() {
  return (
    <div className="flex items-center gap-6">
      <div className="h-px flex-1 border-t border-dashed border-zinc-300 dark:border-zinc-500" />
      <X
        className="text-muted-foreground size-3.5 shrink-0"
        strokeWidth={1.5}
        aria-hidden
      />
      <div className="h-px flex-1 border-t border-dashed border-zinc-300 dark:border-zinc-500" />
    </div>
  )
}

function Terms() {
  return (
    <p className="text-muted-foreground mt-6 text-xs leading-relaxed">
      By continuing, you agree to our{' '}
      <a
        href={EXTERNAL_URLS.tos}
        className="text-foreground hover:text-foreground/80 font-medium underline underline-offset-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        Terms
      </a>{' '}
      and{' '}
      <a
        href={EXTERNAL_URLS.privacy}
        className="text-foreground hover:text-foreground/80 font-medium underline underline-offset-2"
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
