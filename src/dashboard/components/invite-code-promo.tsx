import { useNavigate } from '@tanstack/react-router'
import { Gift, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { type FormEvent, useEffect, useState } from 'react'

import { REDEMPTION_CODE_LENGTH } from '@/auth/config/otp-verification.config'
import { AppIconLogo } from '@/core/components/app-logo'
import { useUserState } from '@/core/hooks/user-state.hook'
import { AnimatedGradientText } from '@/shared/ui/animated-gradient-text'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/utils'

const SUPPORT_MAIL = 'connect@luua.club'

function normalizeRedemptionCodeParam(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, REDEMPTION_CODE_LENGTH)
}

export function InviteCodePromo() {
  const userState = useUserState()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [codeInput, setCodeInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setCodeInput('')
      setError(null)
    }
  }, [open])

  if (!userState || userState.plan !== 'Free') {
    return null
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const code = normalizeRedemptionCodeParam(codeInput)
    if (code.length !== REDEMPTION_CODE_LENGTH) {
      setError('Enter the six-character code exactly as provided.')
      return
    }

    setError(null)
    setOpen(false)
    navigate({
      to: '/payments',
      search: { code },
    })
  }

  return (
    <>
      {!open && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="text-primary/80 shrink-0 rounded-full shadow-sm"
          aria-label="Redeem code"
          onClick={() => setOpen(true)}
        >
          <Gift className="size-4" />
        </Button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            key="invite-code-promo-panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'bg-card fixed z-40 flex max-h-[min(560px,85dvh)] w-auto flex-col overflow-hidden rounded-xl border shadow-xl',
              'right-4 bottom-[max(1rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] left-4 md:right-[max(1.5rem,calc(env(safe-area-inset-right,0px)+0.75rem))] md:left-auto md:w-[min(440px,calc(100vw-2rem))]'
            )}
          >
            <div className="flex shrink-0 justify-end px-2 pt-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground size-8"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pb-5">
              <div className="flex flex-col gap-3">
                <AnimatedGradientText className="text-[11px] font-semibold tracking-[0.14em] uppercase">
                  Pro access
                </AnimatedGradientText>
                <h2 className="text-foreground text-lg font-semibold tracking-tight">
                  Have an invite code?
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Enter your code and we&apos;ll take you to{' '}
                  <span className="text-foreground font-medium">
                    Billing & Plans
                  </span>{' '}
                  to finish redemption when you&apos;re the organisation owner.
                </p>
              </div>

              <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <label
                  className="text-foreground text-sm font-medium"
                  htmlFor="invite-redemption-code"
                >
                  Invite code
                </label>
                <Input
                  id="invite-redemption-code"
                  autoComplete="off"
                  aria-invalid={!!error}
                  aria-describedby={
                    error ? 'invite-redemption-code-error' : undefined
                  }
                  className="h-11 font-mono text-base tracking-[0.18em] uppercase placeholder:font-sans placeholder:tracking-normal"
                  inputMode="text"
                  maxLength={24}
                  placeholder="e.g. ABC123"
                  spellCheck={false}
                  value={codeInput}
                  onChange={event => {
                    setCodeInput(event.target.value)
                    setError(null)
                  }}
                />
                {error ? (
                  <p
                    id="invite-redemption-code-error"
                    className="text-destructive text-xs leading-relaxed"
                    role="alert"
                  >
                    {error}
                  </p>
                ) : null}
                <Button
                  type="submit"
                  className="w-full rounded-lg py-5 font-semibold"
                >
                  Continue to billing
                </Button>
              </form>

              <div className="border-border border-t pt-5">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Don&apos;t have a code yet? If you think you should have Pro
                  on Luua, reach out at{' '}
                  <a
                    href={`mailto:${SUPPORT_MAIL}?subject=Pro%20invite%20request`}
                    className="text-primary font-medium underline-offset-4 hover:underline"
                  >
                    {SUPPORT_MAIL}
                  </a>
                  . Tell us a little about how you use Luua—we&apos;d love to
                  help you get set up.
                </p>
              </div>

              <div className="text-muted-foreground border-border flex items-center gap-2 border-t pt-4 text-xs">
                <AppIconLogo className="!size-4 shrink-0 opacity-70" />
                <span>Luua team</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
