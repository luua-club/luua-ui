import { X } from 'lucide-react'

import { DiagonalStripe } from '@/shared/ui/diagonal-stripe'
import { cn } from '@/shared/utils'

/**
 * Static chrome over the carousel: vertical rule, diagonal stripe, corner X.
 * Does not scroll with slides — pointer-events-none so the carousel stays usable.
 */
export function RightPanelDecorations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute top-0 left-8 h-full border-l" />
      <DiagonalStripe className="absolute top-0 left-14 h-full w-40" />
      <div
        className={cn(
          'absolute left-8 -translate-x-1/2 -translate-y-1/2',
          'top-[clamp(4rem,12vh,8rem)]'
        )}
      >
        <X className="text-border size-8" strokeWidth={1} />
      </div>
    </div>
  )
}
