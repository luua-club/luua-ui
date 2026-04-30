import { cn } from '@/shared/utils'

import { LoginAuthFormContainer } from '../../containers/auth-form-container'
import { OTPVerification } from '../../containers/otp-verification'
import type { UseLoginAuthResult } from '../../hooks/use-login-auth'
import { LeftPanelHeaderBand } from './left-panel-header-band'
import { LeftPanelHero } from './left-panel-hero'
import { LeftPanelTerms } from './left-panel-terms'

/** Horizontal inset matched to the right-panel rhythm */
const LEFT_PANEL_INSET = 'px-6 pr-12 sm:pl-8 sm:pr-14 lg:px-22 lg:pr-14'

export type LeftPanelProps = {
  auth: UseLoginAuthResult
}

/**
 * Left column: branding header, OTP vs sign-in content, terms.
 * Passes the same `useLoginAuth()` object to child flows so they can read state/form/actions.
 */
export default function LeftPanel({ auth }: LeftPanelProps) {
  const isOtpStep = auth.state.showOtpInput

  return (
    <div
      className={cn(
        'relative z-10 flex min-h-0 w-full flex-1 flex-col self-stretch',
        'py-4 lg:h-full lg:w-1/2 lg:flex-none lg:overflow-hidden lg:py-0'
      )}
    >
      <div className="relative flex min-h-0 flex-1 flex-col lg:h-full">
        <LeftPanelHeaderBand insetClassName={LEFT_PANEL_INSET} />

        <section
          className={cn(
            'flex min-h-0 flex-1 flex-col items-center justify-center lg:items-stretch',
            LEFT_PANEL_INSET,
            'py-8 lg:py-12',
            !isOtpStep && 'text-center lg:text-start'
          )}
        >
          <div
            className={cn(
              'relative -mt-14 w-full max-w-md',
              !isOtpStep && 'space-y-6'
            )}
          >
            {isOtpStep ? (
              <OTPVerification auth={auth} />
            ) : (
              <>
                <LeftPanelHero />
                <LoginAuthFormContainer auth={auth} />
              </>
            )}
          </div>
        </section>

        <section
          className={cn(
            'border-border flex h-[clamp(3.5rem,7vh,5rem)] shrink-0',
            'items-center justify-center border-t lg:justify-start',
            LEFT_PANEL_INSET,
            !isOtpStep && 'bg-card z-1'
          )}
        >
          <LeftPanelTerms />
        </section>
      </div>
    </div>
  )
}
