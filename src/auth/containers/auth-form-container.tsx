import { X } from 'lucide-react'

import { GoogleLoginButton } from '../components/google-login-button'
import { LeftPanelMagicLinkForm } from '../components/magic-link-form'
import type { UseLoginAuthResult } from '../hooks/use-login-auth'

type LoginAuthFormContainerProps = {
  auth: UseLoginAuthResult
}

/**
 * Google sign-in + magic-link email capture.
 * Reads register / submit / Google handlers from `useLoginAuth()`.
 */
export function LoginAuthFormContainer({ auth }: LoginAuthFormContainerProps) {
  const { state, form, actions } = auth

  return (
    <div className="space-y-4">
      <GoogleLoginButton
        onSuccess={actions.onGoogleSuccess}
        onError={actions.onGoogleError}
        disabled={state.isMagicLinkPending}
        isLoading={state.isLoading}
        enableOneTap={!state.isMagicLinkPending}
      />

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 border-t border-dashed border-gray-300 dark:border-gray-700" />
        <X
          className="text-muted-foreground size-3.5 shrink-0"
          strokeWidth={1.5}
          aria-hidden
        />
        <div className="h-px flex-1 border-t border-dashed border-gray-300 dark:border-gray-700" />
      </div>

      <LeftPanelMagicLinkForm
        register={form.register}
        errors={form.errors}
        email={state.email}
        isLoading={state.isLoading}
        isMagicLinkPending={state.isMagicLinkPending}
        onSubmit={form.onMagicLinkSubmit}
      />
    </div>
  )
}
