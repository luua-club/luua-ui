import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { Loader } from 'lucide-react'

import BrandGoogle from '@/assets/icons/brand-google.svg?react'
import { cn } from '@/shared/utils'

interface GoogleLoginButtonProps {
  onSuccess: (credentialResponse: CredentialResponse) => void
  onError: () => void
  disabled?: boolean
  isLoading?: boolean
  enableOneTap?: boolean
}

export function GoogleLoginButton({
  onSuccess,
  onError,
  disabled = false,
  isLoading = false,
  enableOneTap = true,
}: GoogleLoginButtonProps) {
  // -- Derived State ----
  const interactive = !disabled && !isLoading

  return (
    <div className={cn('relative h-11 w-full')}>
      {/* Custom styled background button (visual only) */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 flex items-center justify-center',
          'border-border bg-background text-foreground dark:bg-input/30 dark:border-input rounded-sm border'
        )}
      >
        {isLoading ? (
          <Loader className="size-5 animate-spin" />
        ) : (
          <span className="flex items-center text-sm font-semibold">
            <BrandGoogle className="mr-2 size-5" aria-hidden />
            Continue with Google
          </span>
        )}
      </div>

      {/* Real Google Login button - transparent overlay so user clicks it directly */}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center overflow-hidden',
          '[&_iframe]:!h-11 [&_iframe]:!w-full'
        )}
        style={{
          opacity: interactive ? 0.01 : 0,
          pointerEvents: interactive ? 'auto' : 'none',
        }}
      >
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          theme="filled_black"
          text="continue_with"
          shape="rectangular"
          width={400}
          useOneTap={enableOneTap}
        />
      </div>
    </div>
  )
}
