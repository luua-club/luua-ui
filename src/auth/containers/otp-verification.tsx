import { useIsFetching, useMutation } from '@tanstack/react-query'
import { ArrowLeft, Loader } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { authApi } from '@/core/api/auth.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { LoginResponse } from '@/core/models/auth.model'
import { Button } from '@/shared/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp'

import IconLogo from '../components/logo-header'

const RESEND_COOLDOWN_SECONDS = 60 // 1 minutes

interface OTPVerificationProps {
  email: string
  isResending: boolean
  onVerifySuccess: (response: LoginResponse) => void
  onResend: () => void
  onBack: () => void
}

export function OTPVerification({
  email,
  isResending,
  onVerifySuccess,
  onResend,
  onBack,
}: OTPVerificationProps) {
  // --- States ---
  const [otpValue, setOtpValue] = useState('')
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS)
  const [hasError, setHasError] = useState(false)

  // --- Refs ---
  const cooldownIntervalRef = useRef<number | null>(null)

  // --- Hooks ---
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

  // --- FUNCTIONS ---
  /**
   * Starts the resend cooldown timer
   */
  const startResendCooldown = useCallback(() => {
    if (cooldownIntervalRef.current) {
      window.clearInterval(cooldownIntervalRef.current)
    }

    setResendCooldown(RESEND_COOLDOWN_SECONDS)

    cooldownIntervalRef.current = window.setInterval(() => {
      setResendCooldown(prev => {
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

  /**
   * Handles OTP change and auto-submit when complete
   */
  const handleOtpChange = (value: string) => {
    setOtpValue(value)
    // Clear error state when user starts typing again
    if (hasError) {
      setHasError(false)
    }
    if (value.length === 6) {
      verifyOtpMutation.mutate(value)
    }
  }

  /**
   * Handles resend OTP
   */
  const handleResendOtp = () => {
    if (resendCooldown > 0 || isResending) return
    setOtpValue('')
    onResend()
    startResendCooldown()
  }

  // --- EFFECTS ---
  /**
   * Start cooldown on mount
   */
  useEffect(() => {
    startResendCooldown()

    return () => {
      if (cooldownIntervalRef.current) {
        window.clearInterval(cooldownIntervalRef.current)
      }
    }
  }, [startResendCooldown])

  // --- DERIVED VARIABLES ---
  const isLoading = verifyOtpMutation.isPending || isFetchingUser > 0

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Back button */}
      <Button
        onClick={onBack}
        disabled={isLoading}
        className="absolute top-0 left-0 h-8 self-start"
        variant="secondary"
      >
        <ArrowLeft className="size-4" />
        back
      </Button>

      <IconLogo />

      {/* OTP Heading */}
      <h3 className="text-foreground text-center text-2xl font-medium text-balance">
        Open your mail and enter your OTP
      </h3>

      <span className="text-foreground/80 -mt-4">{email}</span>

      {/* OTP Input */}
      {isLoading ? (
        <div className="flex h-12 items-center justify-center">
          <Loader className="text-foreground size-6 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <InputOTP
            maxLength={6}
            value={otpValue}
            onChange={handleOtpChange}
            disabled={isLoading}
            autoFocus={!hasError}
          >
            <InputOTPGroup>
              <InputOTPSlot
                index={0}
                className={`size-12 text-lg ${hasError ? 'border-destructive' : ''}`}
              />
              <InputOTPSlot
                index={1}
                className={`size-12 text-lg ${hasError ? 'border-destructive' : ''}`}
              />
              <InputOTPSlot
                index={2}
                className={`size-12 text-lg ${hasError ? 'border-destructive' : ''}`}
              />
              <InputOTPSlot
                index={3}
                className={`size-12 text-lg ${hasError ? 'border-destructive' : ''}`}
              />
              <InputOTPSlot
                index={4}
                className={`size-12 text-lg ${hasError ? 'border-destructive' : ''}`}
              />
              <InputOTPSlot
                index={5}
                className={`size-12 text-lg ${hasError ? 'border-destructive' : ''}`}
              />
            </InputOTPGroup>
          </InputOTP>
          {hasError && (
            <span className="text-destructive text-sm">
              Invalid OTP. Please try again.
            </span>
          )}
        </div>
      )}

      {/* Resend link */}
      <div className="flex w-full justify-center text-cyan-600 dark:text-cyan-400">
        {resendCooldown > 0 ? (
          <span className="text-sm">Resend in {resendCooldown} sec</span>
        ) : isResending ? (
          <span className="text-sm">Sending...</span>
        ) : (
          <button
            onClick={handleResendOtp}
            className="text-sm text-green-600 underline transition-colors hover:text-green-500/80 dark:text-green-500"
            disabled={isLoading || isResending}
          >
            Resend
          </button>
        )}
      </div>
    </div>
  )
}
