import { BadgeCheck, CheckCircle2 } from 'lucide-react'

import { buttonVariants } from '@/shared/ui/button'
import { cn } from '@/shared/utils/index'

export function CurrentPlanAffordance({
  className,
  size = 'default',
}: {
  className?: string
  size?: 'default' | 'compact'
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        buttonVariants({
          variant: 'secondary',
          size: size === 'compact' ? 'sm' : 'default',
        }),
        'w-full cursor-default',
        size === 'default' && 'my-6',
        size === 'compact' && 'mt-4',
        className
      )}
    >
      <BadgeCheck
        className="text-muted-foreground size-4 shrink-0"
        strokeWidth={2}
        aria-hidden
      />
      Current plan
    </div>
  )
}

export function IncludedPlanAffordance({
  className,
  size = 'default',
}: {
  className?: string
  size?: 'default' | 'compact'
}) {
  return (
    <div
      role="status"
      className={cn(
        buttonVariants({
          variant: 'outline',
          size: size === 'compact' ? 'sm' : 'default',
        }),
        'text-muted-foreground w-full cursor-default bg-transparent shadow-none',
        size === 'default' && 'my-6',
        size === 'compact' && 'mt-4',
        className
      )}
    >
      <CheckCircle2
        className="text-muted-foreground size-4 shrink-0"
        strokeWidth={2}
        aria-hidden
      />
      {size === 'compact' ? 'Included' : 'Included in your plan'}
    </div>
  )
}
