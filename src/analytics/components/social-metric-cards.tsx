import { ArrowDown, ArrowUp } from 'lucide-react'
import { useMemo } from 'react'

import StackedPlatformIcons from '@/core/components/stacked-platform-icons'
import { type AnalyticsChannel } from '@/core/models/analytics.model'
import { formatCompactMetricValue } from '@/core/utils/common.util'
import { getSocialPlatformLabel } from '@/core/utils/social.utils'
import { Card } from '@/shared/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { cn } from '@/shared/utils'

type SocialMetricCardProps = {
  title: string
  channels: AnalyticsChannel[]
  value: number
  change: number | null
  imageSrc: string
  imageClassName?: string
}

export function SocialMetricCard({
  title,
  channels,
  value,
  change,
  imageSrc,
  imageClassName,
}: SocialMetricCardProps) {
  const isPositive = change === null || change >= 0
  const TrendIcon = isPositive ? ArrowUp : ArrowDown
  const channelLabel = useMemo(
    () => channels.map(channel => getSocialPlatformLabel(channel)).join(' + '),
    [channels]
  )

  return (
    <Card className="bg-card relative h-[156px] overflow-hidden rounded-xl border p-5 shadow-sm">
      <div className="absolute top-5 right-5 z-10">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={`${title} is summed across ${channelLabel}`}
              className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
            >
              <StackedPlatformIcons channels={channels} />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="max-w-44 text-center text-[10px]"
          >
            {title} is the total summed across {channelLabel}.
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="relative z-10 flex h-full max-w-[64%] flex-col justify-between">
        <div className="pr-14">
          <h3 className="text-foreground text-lg leading-none font-semibold">
            {title}
          </h3>
        </div>

        <div className="flex items-baseline gap-1">
          <p className="text-foreground text-[32px] leading-none font-bold tracking-tight">
            {formatCompactMetricValue(value)}
          </p>
          <span
            aria-label={isPositive ? 'Trending up' : 'Trending down'}
            className={cn(
              'inline-flex size-6 items-center justify-center rounded-full',
              isPositive ? 'text-emerald-600' : 'text-red-500'
            )}
          >
            <TrendIcon className="size-5 stroke-[2.5]" />
          </span>
        </div>
      </div>

      <img
        src={imageSrc}
        alt=""
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute bottom-[-34px] z-0 w-auto object-contain opacity-95 grayscale',
          imageClassName
        )}
      />
    </Card>
  )
}
