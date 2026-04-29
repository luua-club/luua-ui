import { Loader, Mail } from 'lucide-react'
import type { BaseSyntheticEvent } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import type { MagicLinkRequest } from '@/core/models/auth.model'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/utils'

type LeftPanelMagicLinkFormProps = {
  register: UseFormRegister<MagicLinkRequest>
  errors: FieldErrors<MagicLinkRequest>
  /** Watched email value for submit enabled state */
  email: string
  isLoading: boolean
  isMagicLinkPending: boolean
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void> | void
}

/**
 * Email capture + OTP request CTA. Validation comes from react-hook-form in the parent.
 */
export function LeftPanelMagicLinkForm({
  register,
  errors,
  email,
  isLoading,
  isMagicLinkPending,
  onSubmit,
}: LeftPanelMagicLinkFormProps) {
  const disabledFields = isLoading || isMagicLinkPending
  const submitDisabled = disabledFields || !email?.trim() || !!errors.email

  return (
    <form className="space-y-1" onSubmit={onSubmit} noValidate>
      <div className="relative">
        <Mail className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />

        <Input
          type="email"
          placeholder="Enter your email"
          {...register('email')}
          className={cn(
            'border-border bg-background text-foreground',
            'placeholder:text-muted-foreground h-11 rounded-md pr-[7.25rem] pl-11 text-base',
            errors.email && 'border-red-500 focus-visible:ring-red-500'
          )}
          disabled={disabledFields}
        />

        <Button
          type="submit"
          className={cn(
            'absolute top-1/2 right-1.5 h-8 -translate-y-1/2 rounded-md',
            'px-4 text-xs font-medium'
          )}
          variant="default"
          size="sm"
          disabled={submitDisabled}
        >
          {isMagicLinkPending ? (
            <Loader className="size-4 animate-spin" />
          ) : (
            'Get OTP'
          )}
        </Button>
      </div>

      {errors.email && (
        <p className="text-center text-xs text-red-500 lg:pl-3 lg:text-left">
          {errors.email.message}
        </p>
      )}
    </form>
  )
}
