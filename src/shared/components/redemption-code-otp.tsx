import {
  getOtpInputMode,
  getOtpInputPattern,
  getOtpSlotGroupIndices,
  REDEMPTION_CODE_LENGTH,
  REDEMPTION_CODE_OTP_CONFIG,
} from '@/auth/config/otp-verification.config'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp'
import { cn } from '@/shared/utils'

const [SLOTS_LEFT, SLOTS_RIGHT] = getOtpSlotGroupIndices(
  REDEMPTION_CODE_OTP_CONFIG.length
)
const PATTERN = getOtpInputPattern(REDEMPTION_CODE_OTP_CONFIG.characterSet)
const INPUT_MODE = getOtpInputMode(REDEMPTION_CODE_OTP_CONFIG.characterSet)

type RedemptionCodeOtpProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  hasError?: boolean
  /** Compact cells for dashboard promo card */
  variant?: 'default' | 'compact'
  /** Callback when length reaches REDEMPTION_CODE_LENGTH */
  onComplete?: (value: string) => void
  autoComplete?: string
  containerClassName?: string
  'aria-describedby'?: string
}

export function RedemptionCodeOtp({
  id,
  value,
  onChange,
  disabled,
  hasError,
  variant = 'default',
  onComplete,
  autoComplete = 'off',
  containerClassName,
  'aria-describedby': ariaDescribedBy,
}: RedemptionCodeOtpProps) {
  const slotClass =
    variant === 'compact'
      ? 'h-11 w-9 text-base font-medium tabular-nums shadow-none sm:h-12 sm:w-10'
      : 'h-12 w-10 text-lg font-medium tabular-nums shadow-none sm:h-14 sm:w-12'

  const handleChange = (next: string) => {
    onChange(next)
    if (onComplete && next.length === REDEMPTION_CODE_LENGTH) {
      onComplete(next)
    }
  }

  return (
    <InputOTP
      id={id}
      maxLength={REDEMPTION_CODE_LENGTH}
      value={value}
      onChange={handleChange}
      pattern={PATTERN}
      inputMode={INPUT_MODE}
      disabled={disabled}
      aria-invalid={hasError}
      aria-describedby={ariaDescribedBy}
      autoComplete={autoComplete}
      containerClassName={cn(
        'flex flex-wrap items-center justify-start gap-0',
        disabled && 'pointer-events-none opacity-60',
        containerClassName
      )}
      data-slot="redemption-code-otp"
    >
      <InputOTPGroup className="gap-0">
        {SLOTS_LEFT.map(i => (
          <InputOTPSlot
            key={i}
            index={i}
            aria-invalid={hasError}
            className={cn(
              slotClass,
              hasError && 'border-destructive bg-destructive/5'
            )}
          />
        ))}
      </InputOTPGroup>
      {SLOTS_RIGHT.length > 0 ? (
        <>
          <span
            aria-hidden
            className="bg-border mx-2 h-px w-3 shrink-0 sm:mx-3 sm:w-4"
          />
          <InputOTPGroup className="gap-0">
            {SLOTS_RIGHT.map(i => (
              <InputOTPSlot
                key={i}
                index={i}
                aria-invalid={hasError}
                className={cn(
                  slotClass,
                  hasError && 'border-destructive bg-destructive/5'
                )}
              />
            ))}
          </InputOTPGroup>
        </>
      ) : null}
    </InputOTP>
  )
}
