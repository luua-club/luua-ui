import { EXTERNAL_URLS } from '@/core/config/constant'

export function LeftPanelTerms() {
  return (
    <p className="text-muted-foreground text-center text-xs lg:text-start">
      By continuing, you agree to our{' '}
      <a
        href={EXTERNAL_URLS.tos}
        className="text-foreground hover:text-foreground/80 font-medium underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Terms of Condition
      </a>
      <br />
      and{' '}
      <a
        href={EXTERNAL_URLS.privacy}
        className="text-foreground hover:text-foreground/80 font-medium underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Privacy Policy
      </a>
      .
    </p>
  )
}
