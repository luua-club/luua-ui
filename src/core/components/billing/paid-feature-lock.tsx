import { ArrowUpRight, LockKeyhole, Sparkles } from 'lucide-react'

import { LANDING_PRICING_URL } from '@/core/config/constant'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils'

interface PaidFeatureLockProps {
  title: string
  description: string
  features?: string[]
  actionLabel?: string
  className?: string
}

export function PaidFeatureLock({
  title,
  description,
  features,
  actionLabel = 'Upgrade to Pro',
  className,
}: PaidFeatureLockProps) {
  return (
    <div
      className={cn(
        'bg-background flex min-h-[320px] items-center justify-center rounded-lg border border-dashed p-6 text-center',
        className
      )}
    >
      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        <div className="bg-muted relative flex size-12 items-center justify-center rounded-lg border">
          <LockKeyhole className="size-5" />
          <Sparkles className="absolute -top-1 -right-1 size-4 text-amber-500" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="text-muted-foreground text-sm leading-6 text-balance">
            {description}
          </p>
        </div>

        {features?.length ? (
          <div className="flex flex-wrap justify-center gap-2">
            {features.map(feature => (
              <span
                key={feature}
                className="bg-muted rounded-md border px-2 py-1 text-xs font-medium"
              >
                {feature}
              </span>
            ))}
          </div>
        ) : null}

        <Button asChild>
          <a href={LANDING_PRICING_URL}>
            {actionLabel}
            <ArrowUpRight className="size-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}
