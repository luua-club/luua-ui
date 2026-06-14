import { ArrowUpRight, Sparkles } from 'lucide-react'

import {
  getUsagePercent,
  type UsageLimit,
} from '@/core/billing/plan-entitlements'
import { LANDING_PRICING_URL } from '@/core/config/constant'
import { Button } from '@/shared/ui/button'
import { Progress } from '@/shared/ui/progress'
import { cn } from '@/shared/utils'

interface UpgradeCalloutProps {
  title: string
  description: string
  usage?: {
    label: string
    limit: UsageLimit | undefined
  }
  actionLabel?: string
  className?: string
  compact?: boolean
}

export function UpgradeCallout({
  title,
  description,
  usage,
  actionLabel = 'Upgrade',
  className,
  compact = false,
}: UpgradeCalloutProps) {
  const limit = usage?.limit
  const showUsage = Boolean(limit && limit.total !== -1)
  const usagePercent = getUsagePercent(limit)
  const isAtLimit = usagePercent >= 100

  return (
    <div
      className={cn(
        'bg-card rounded-xl border p-4 shadow-sm',
        compact ? 'space-y-3' : 'space-y-4',
        className
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border',
              isAtLimit ? 'border-amber-500/25 bg-amber-500/10' : 'bg-muted'
            )}
          >
            <Sparkles
              className={cn(
                'size-4',
                isAtLimit
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-muted-foreground'
              )}
            />
          </div>

          <div className="min-w-0 flex-1">
            <p
              className={cn('font-semibold', compact ? 'text-sm' : 'text-base')}
            >
              {title}
            </p>
            <p
              className={cn(
                'text-muted-foreground mt-0.5 leading-5',
                compact ? 'text-xs' : 'text-sm'
              )}
            >
              {description}
            </p>
          </div>
        </div>

        <Button
          asChild
          size="sm"
          className="h-8 w-full shrink-0 px-3 text-xs sm:w-auto"
        >
          <a href={LANDING_PRICING_URL}>
            {actionLabel}
            <ArrowUpRight className="size-3.5" />
          </a>
        </Button>
      </div>

      {showUsage ? (
        <div className="bg-muted/30 rounded-lg border px-3 py-2.5">
          <div className="text-muted-foreground flex items-center justify-between gap-3 text-xs">
            <span>{usage?.label}</span>
            <span className="text-foreground font-medium tabular-nums">
              {limit?.used} / {limit?.total}
            </span>
          </div>
          <Progress value={usagePercent} className="bg-muted mt-2 h-1.5" />
        </div>
      ) : null}
    </div>
  )
}
