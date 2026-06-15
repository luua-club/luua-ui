import { Loader, Mail } from 'lucide-react'
import type { BaseSyntheticEvent } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import type { MagicLinkRequest } from '@/core/models/auth.model'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/utils'

type MagicLinkFormProps = {
  register: UseFormRegister<MagicLinkRequest>
  errors: FieldErrors<MagicLinkRequest>
  isLoading: boolean
  isMagicLinkPending: boolean
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void> | void
}

/**
 * Email capture + OTP request. Stacked field + full-width CTA (login-05 style).
 * Validation comes from react-hook-form in the parent.
 */
export function MagicLinkForm({
  register,
  errors,
  isLoading,
  isMagicLinkPending,
  onSubmit,
}: MagicLinkFormProps) {
  const disabledFields = isLoading || isMagicLinkPending
  // Enabled at rest — empty/invalid email is caught by the zod resolver on
  // submit (no API call fires), keeping a confident primary CTA.
  const submitDisabled = disabledFields

  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmit} noValidate>
      <div className="flex flex-col gap-2">
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          className={cn(
            'h-11 rounded-sm text-base',
            errors.email && 'border-destructive focus-visible:ring-destructive'
          )}
          disabled={disabledFields}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-destructive text-xs">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="outline"
        className="bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground h-11 w-full rounded-sm border text-sm font-semibold"
        disabled={submitDisabled}
      >
        {isMagicLinkPending ? (
          <Loader className="size-4 animate-spin" />
        ) : (
          <>
            <Mail className="mr-2 size-4" aria-hidden />
            Continue with email
          </>
        )}
      </Button>
    </form>
  )
}
