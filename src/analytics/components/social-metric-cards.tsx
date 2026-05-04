import { ArrowDown, ArrowUp } from 'lucide-react'
import { useMemo } from 'react'

import StackedPlatformIcons from '@/core/components/stacked-platform-icons'
import {
  type AnalyticsChannel,
  type IAnalyticsMetricSummary,
} from '@/core/models/analytics.model'
import { formatCompactMetricValue } from '@/core/utils/common.util'
import { getSocialPlatformLabel } from '@/core/utils/social.utils'
import { Card } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { cn } from '@/shared/utils'

import { metricConfigs } from '../config/metric.config'

function formatChannelList(channels: AnalyticsChannel[]) {
  return channels.map(channel => getSocialPlatformLabel(channel)).join(' + ')
}

type SocialMetricCardProps = {
  title: string
  channels: AnalyticsChannel[]
  value: number
  change: number | null
  imageSrc: string
  imageClassName?: string
}

function SocialMetricCard({
  title,
  channels,
  value,
  change,
  imageSrc,
  imageClassName,
}: SocialMetricCardProps) {
  const isPositive = change === null || change >= 0
  const TrendIcon = isPositive ? ArrowUp : ArrowDown
  const channelLabel = useMemo(() => formatChannelList(channels), [channels])

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

//---------------------------------
// Social Metric Card List
//---------------------------------
type SocialMetricCardsProps = {
  metrics: IAnalyticsMetricSummary[]
}
export default function SocialMetricCards({ metrics }: SocialMetricCardsProps) {
  const metricCards = useMemo(
    () =>
      metricConfigs.map(config => {
        const summary = metrics.find(metric => metric.key === config.metric)

        return {
          ...config,
          value: summary?.value ?? 0,
          change: summary?.change_percent ?? null,
        }
      }),
    [metrics]
  )

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metricCards.map(config => (
        <SocialMetricCard
          key={config.title}
          title={config.title}
          channels={config.channels}
          value={config.value}
          change={config.change}
          imageSrc={config.imageSrc}
          imageClassName={config.imageClassName}
        />
      ))}
    </div>
  )
}

//---------------------------------
// Social Metric Card List Skeleton
//---------------------------------
export function SocialMetricCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card
          className="bg-card relative h-[156px] overflow-hidden rounded-xl border p-5 shadow-sm"
          key={index}
        >
          <div className="absolute top-5 right-5 z-10 flex items-center">
            <Skeleton className="size-[26px] rounded-full border" />
            <Skeleton className="-ml-2.5 size-[26px] rounded-full border" />
          </div>

          <div className="relative z-10 flex h-full max-w-[64%] flex-col justify-between">
            <div className="pr-14">
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>

            <div className="flex items-center gap-2 pb-0.5">
              <Skeleton className="h-10 w-24 rounded-md" />
              <Skeleton className="size-6 rounded-full" />
            </div>
          </div>

          <Skeleton
            className={cn(
              'absolute bottom-[-34px] z-0 h-[142px] w-[92px] rounded-t-full rounded-b-none opacity-60',
              index % 2 === 0 ? 'right-[-8px]' : 'right-[-18px]'
            )}
          />
        </Card>
      ))}
    </div>
  )
}
