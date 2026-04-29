import { useIsFetching, useMutation } from '@tanstack/react-query'
import { ArrowLeft, Loader } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { authApi } from '@/core/api/auth.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { Button } from '@/shared/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp'
import { cn } from '@/shared/utils'

import {
  getOtpCodeDescriptor,
  getOtpInputMode,
  getOtpInputPattern,
  getOtpSlotGroupIndices,
  OTP_RESEND_COOLDOWN_SECONDS,
  OTP_VERIFICATION_INPUT_CONFIG,
} from '../config/otp-verification.config'
import type { UseLoginAuthResult } from '../hooks/use-login-auth'

interface OTPVerificationProps {
  auth: UseLoginAuthResult
}

// ---- Derived layout from config (module scope: stable for slot groups) ----
const [OTP_SLOTS_LEFT, OTP_SLOTS_RIGHT] = getOtpSlotGroupIndices(
  OTP_VERIFICATION_INPUT_CONFIG.length
)
const OTP_PATTERN = getOtpInputPattern(
  OTP_VERIFICATION_INPUT_CONFIG.characterSet
)
const OTP_INPUT_MODE = getOtpInputMode(
  OTP_VERIFICATION_INPUT_CONFIG.characterSet
)
const OTP_CODE_DESCRIPTOR = getOtpCodeDescriptor(
  OTP_VERIFICATION_INPUT_CONFIG.length,
  OTP_VERIFICATION_INPUT_CONFIG.characterSet
)

/**
 * OTP entry after magic-link email step: verify via API, resend cooldown, editorial UI.
 * Length and allowed characters come from {@link OTP_VERIFICATION_INPUT_CONFIG}.
 */
export function OTPVerification({ auth }: OTPVerificationProps) {
  // ---- Variables ----
  const { state, actions } = auth
  const email = state.email
  const isResending = state.isMagicLinkPending
  const onVerifySuccess = actions.onOtpVerifySuccess
  const onResend = actions.onResendOtp
  const onBack = actions.onBackFromOtp

  const otpLength = OTP_VERIFICATION_INPUT_CONFIG.length

  // ---- State ----
  const [otpValue, setOtpValue] = useState('')
  const [resendCooldown, setResendCooldown] = useState(
    OTP_RESEND_COOLDOWN_SECONDS
  )
  const [hasError, setHasError] = useState(false)

  const cooldownIntervalRef = useRef<number | null>(null)

  // ---- Verify mutation ----
  const verifyOtpMutation = useMutation({
    mutationFn: (token: string) => authApi.verifyMagicLink({ token }),
    onSuccess: response => {
      setHasError(false)
      onVerifySuccess(response.data)
    },
    onError: () => {
      setOtpValue('')
      setHasError(true)
    },
  })
  const isFetchingUser = useIsFetching({ queryKey: [QUERY_KEYS.user] })

  // ---- Resend cooldown ----
  const startResendCooldown = useCallback(() => {
    if (cooldownIntervalRef.current) {
      window.clearInterval(cooldownIntervalRef.current)
    }

    setResendCooldown(OTP_RESEND_COOLDOWN_SECONDS)

    cooldownIntervalRef.current = window.setInterval(() => {
      setResendCooldown((prev: number) => {
        if (prev <= 1) {
          if (cooldownIntervalRef.current) {
            window.clearInterval(cooldownIntervalRef.current)
            cooldownIntervalRef.current = null
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  // ---- Effects ----
  useEffect(() => {
    startResendCooldown()

    return () => {
      if (cooldownIntervalRef.current) {
        window.clearInterval(cooldownIntervalRef.current)
      }
    }
  }, [startResendCooldown])

  // ---- Handlers ----
  const handleOtpChange = (value: string) => {
    setOtpValue(value)
    if (hasError) {
      setHasError(false)
    }
    if (value.length === otpLength) {
      verifyOtpMutation.mutate(value)
    }
  }

  const handleResendOtp = () => {
    if (resendCooldown > 0 || isResending) return
    setOtpValue('')
    onResend()
    startResendCooldown()
  }

  // ---- Derived ----
  const isVerifying = verifyOtpMutation.isPending
  const isLoading = isVerifying || isFetchingUser > 0

  return (
    <div className="flex flex-col items-start gap-6 text-start">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={isVerifying}
      >
        <ArrowLeft />
        Back
      </Button>

      <OtpVerificationIntro
        email={email}
        codeDescriptor={OTP_CODE_DESCRIPTOR}
      />

      <OtpVerificationCodeSection
        otpValue={otpValue}
        maxLength={otpLength}
        pattern={OTP_PATTERN}
        inputMode={OTP_INPUT_MODE}
        onOtpChange={handleOtpChange}
        hasError={hasError}
        isLoading={isLoading}
        slotIndicesLeft={OTP_SLOTS_LEFT}
        slotIndicesRight={OTP_SLOTS_RIGHT}
      />

      <OtpVerificationResendRow
        resendCooldown={resendCooldown}
        isResending={isResending}
        isLoading={isLoading}
        onResend={handleResendOtp}
      />
    </div>
  )
}

function OtpVerificationIntro({
  email,
  codeDescriptor,
}: {
  email: string
  codeDescriptor: string
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-muted-foreground flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.22em] uppercase">
        <span
          aria-hidden
          className="bg-foreground/40 inline-block h-px w-6 shrink-0"
        />
        Verification
      </p>

      <h2
        className={cn(
          'text-foreground text-3xl font-semibold tracking-tight text-balance',
          'leading-[1.05] sm:text-4xl'
        )}
      >
        Check your <span className="font-medium italic">inbox</span>.
      </h2>

      <p className="text-foreground/70 text-sm leading-relaxed">
        We sent a {codeDescriptor} code to{' '}
        <span className="text-foreground font-medium underline decoration-dotted underline-offset-4">
          {email}
        </span>
        .
      </p>
    </div>
  )
}

function OtpVerificationCodeSection({
  otpValue,
  maxLength,
  pattern,
  inputMode,
  onOtpChange,
  hasError,
  isLoading,
  slotIndicesLeft,
  slotIndicesRight,
}: {
  otpValue: string
  maxLength: number
  pattern: string
  inputMode: 'numeric' | 'text'
  onOtpChange: (value: string) => void
  hasError: boolean
  isLoading: boolean
  slotIndicesLeft: readonly number[]
  slotIndicesRight: readonly number[]
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div
        className={cn('w-full', isLoading && 'pointer-events-none opacity-60')}
      >
        <InputOTP
          maxLength={maxLength}
          value={otpValue}
          onChange={onOtpChange}
          pattern={pattern}
          inputMode={inputMode}
          disabled={isLoading}
          autoFocus={!hasError}
          aria-invalid={hasError}
          data-slot="login-otp"
          autoComplete="one-time-code"
          containerClassName="flex flex-wrap items-center justify-center gap-0 sm:justify-start"
        >
          <InputOTPGroup className="gap-0">
            {slotIndicesLeft.map(i => (
              <OtpVerificationSlot key={i} index={i} hasError={hasError} />
            ))}
          </InputOTPGroup>
          {slotIndicesRight.length > 0 ? (
            <>
              <span
                aria-hidden
                className="bg-border mx-2 h-px w-3 shrink-0 sm:mx-3 sm:w-4"
              />
              <InputOTPGroup className="gap-0">
                {slotIndicesRight.map(i => (
                  <OtpVerificationSlot key={i} index={i} hasError={hasError} />
                ))}
              </InputOTPGroup>
            </>
          ) : null}
        </InputOTP>
      </div>

      {isLoading && (
        <p className="text-muted-foreground flex items-center gap-2 text-xs">
          <Loader className="size-3.5 shrink-0 animate-spin" aria-hidden />
          Verifying…
        </p>
      )}

      {hasError && (
        <p className="text-destructive flex items-center gap-1.5 text-xs">
          <span
            aria-hidden
            className="bg-destructive size-1 shrink-0 rounded-full"
          />
          Invalid OTP. Please try again.
        </p>
      )}
    </div>
  )
}

function OtpVerificationSlot({
  index,
  hasError,
}: {
  index: number
  hasError: boolean
}) {
  return (
    <InputOTPSlot
      index={index}
      aria-invalid={hasError}
      className={cn(
        'h-14 w-12 sm:h-16 sm:w-14',
        'text-xl font-medium tabular-nums',
        'shadow-none',
        hasError && 'border-destructive bg-destructive/5'
      )}
    />
  )
}

function OtpVerificationResendRow({
  resendCooldown,
  isResending,
  isLoading,
  onResend,
}: {
  resendCooldown: number
  isResending: boolean
  isLoading: boolean
  onResend: () => void
}) {
  return (
    <p className="text-muted-foreground text-xs leading-relaxed">
      Didn&apos;t get the code?{' '}
      {resendCooldown > 0 ? (
        <span className="text-foreground/70 tabular-nums">
          Resend available in {resendCooldown}s
        </span>
      ) : isResending ? (
        <span className="text-foreground/70">Sending…</span>
      ) : (
        <button
          type="button"
          onClick={onResend}
          disabled={isLoading || isResending}
          className={cn(
            'text-foreground font-medium underline underline-offset-4',
            'hover:text-foreground/80',
            'disabled:pointer-events-none disabled:opacity-50'
          )}
        >
          Resend code
        </button>
      )}
    </p>
  )
}
