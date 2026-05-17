import { Loader2 } from 'lucide-react'
import type { ComponentProps } from 'react'

import { PLAN_UPGRADE_CTA, type PurchasablePlan } from '@/payments/pricing-data'
import { Button } from '@/shared/ui/button'

type ButtonProps = ComponentProps<typeof Button>

export function PlanUpgradeButton({
  planId,
  onUpgradePlan,
  isPending = false,
  isLoading = false,
  className,
  size = 'default',
  variant = 'default',
}: {
  planId: PurchasablePlan
  onUpgradePlan: (planId: PurchasablePlan) => void
  isPending?: boolean
  isLoading?: boolean
  className?: string
  size?: ButtonProps['size']
  variant?: ButtonProps['variant']
}) {
  return (
    <Button
      aria-busy={isLoading || undefined}
      className={className}
      disabled={isPending}
      onClick={() => onUpgradePlan(planId)}
      size={size}
      type="button"
      variant={variant}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Redirecting
        </>
      ) : (
        PLAN_UPGRADE_CTA
      )}
    </Button>
  )
}
