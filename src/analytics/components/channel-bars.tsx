import { getSocialPlatformLabel } from '@/core/utils/social.utils'
import { cn } from '@/shared/utils'

import { type ChannelTotals, formatNumber } from '../utils'

export default function ChannelBars({ totals }: { totals: ChannelTotals }) {
  const max = Math.max(totals.LinkedIn, totals.Twitter, 1)

  return (
    <div className="space-y-3">
      {(['LinkedIn', 'Twitter'] as const).map(channel => (
        <div key={channel} className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground text-xs">
              {getSocialPlatformLabel(channel)}
            </span>
            <span className="text-xs font-medium">
              {formatNumber(totals[channel])}
            </span>
          </div>
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div
              className={cn(
                'h-full rounded-full',
                channel === 'LinkedIn' ? 'bg-blue-500' : 'bg-zinc-900'
              )}
              style={{ width: `${(totals[channel] / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
