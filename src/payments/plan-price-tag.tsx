import {
  PLAN_PRICES,
  PLAN_USER_LABELS,
  type PlanId,
} from '@/payments/pricing-data'
import { cn } from '@/shared/utils/index'

export function PlanPriceTag({
  planId,
  className,
  size = 'default',
}: {
  planId: PlanId
  className?: string
  size?: 'default' | 'compact'
}) {
  const amount = PLAN_PRICES[planId].monthly

  return (
    <div className={cn('tabular-nums', className)}>
      <div className="flex items-baseline gap-0.5">
        <span
          className={cn(
            'font-semibold tracking-tight',
            size === 'default' && 'text-5xl',
            size === 'compact' && 'text-4xl'
          )}
        >
          ${amount}
        </span>
        {amount > 0 ? (
          <span
            className={cn(
              'text-muted-foreground font-medium',
              size === 'default' && 'text-lg',
              size === 'compact' && 'text-base'
            )}
          >
            /mo
          </span>
        ) : null}
      </div>
      <div
        className={cn(
          'text-muted-foreground mt-1 font-medium',
          size === 'default' && 'text-base',
          size === 'compact' && 'text-sm'
        )}
      >
        {PLAN_USER_LABELS[planId]}
      </div>
    </div>
  )
}
