import { ShieldCheck } from 'lucide-react'

import { RainbowButton } from '../ui/rainbow-button'

interface UpgradePlanCtaProps {
  onClick?: () => void
}

function UpgradePlanCta({ onClick }: UpgradePlanCtaProps) {
  return (
    <RainbowButton
      className="rounded-full text-xs"
      variant="default"
      size="sm"
      onClick={onClick}
    >
      <ShieldCheck /> Pro enabled
    </RainbowButton>
  )
}

export default UpgradePlanCta
