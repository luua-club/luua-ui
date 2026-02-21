import { useQuery } from '@tanstack/react-query'
import { ArrowDown, ArrowUp } from 'lucide-react'

import { analyticsApi } from '@/core/api/analytics.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { type IAnalyticsMetric } from '@/core/models/post.model'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
//import { Skeleton } from '@/shared/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip'

// ---------------------------------------------------------------------------
// Sparkline — simple inline SVG chart
// ---------------------------------------------------------------------------
function Sparkline({
  data,
  color = 'currentColor',
}: {
  data: number[]
  color?: string
}) {
  if (data.length < 2 || data.every(v => v === 0)) {
    return <div className="h-10 w-full" />
  }

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 120
  const h = 40
  const padding = 2

  const points = data
    .map((v, i) => {
      const x = padding + (i / (data.length - 1)) * (w - 2 * padding)
      const y = h - padding - ((v - min) / range) * (h - 2 * padding)
      return `${x},${y}`
    })
    .join(' ')

  // Area fill path
  const firstX = padding
  const lastX =
    padding + ((data.length - 1) / (data.length - 1)) * (w - 2 * padding)
  const areaPath = `M${firstX},${h} L${points.split(' ').join(' L')} L${lastX},${h} Z`

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-10 w-full"
      preserveAspectRatio="none"
    >
      <path d={areaPath} fill={color} fillOpacity={0.1} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Format large numbers: 1234 → "1.2K"
// ---------------------------------------------------------------------------
function formatMetricValue(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value % 1 === 0 ? String(value) : value.toFixed(1)
}

// ---------------------------------------------------------------------------
// Metric card colors
// ---------------------------------------------------------------------------
const CARD_COLORS: Record<string, string> = {
  Likes: '#f97316', // orange
  Comments: '#0ea5e9', // sky blue
  Reposts: '#10b981', // emerald
  'Engagement Rate': '#8b5cf6', // violet
}

// ---------------------------------------------------------------------------
// AnalyticsCard
// ---------------------------------------------------------------------------
function AnalyticsCard({ metric }: { metric: IAnalyticsMetric }) {
  const color = CARD_COLORS[metric.label] ?? '#6b7280'
  const dailyValues = metric.daily_data.map(d => d.value)
  const isPositive =
    metric.change_percent !== null && metric.change_percent >= 0
  const hasChange = metric.change_percent !== null

  return (
    <Card className="flex h-full min-w-0 flex-col gap-4 rounded-lg border p-4 shadow-none">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-foreground text-sm font-medium">{metric.label}</p>
          <p className="text-muted-foreground text-xs">Last 7 days</p>
        </div>
      </div>

      <Sparkline data={dailyValues} color={color} />

      <div className="flex items-end justify-between">
        <p className="text-foreground text-2xl leading-none font-semibold">
          {formatMetricValue(metric.value)}
          {metric.label === 'Engagement Rate' && '%'}
        </p>
        {hasChange && (
          <span
            className={`flex items-center gap-0.5 text-xs font-medium ${
              isPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-500 dark:text-red-400'
            }`}
          >
            {isPositive ? (
              <ArrowUp className="size-3" />
            ) : (
              <ArrowDown className="size-3" />
            )}
            {Math.abs(metric.change_percent!).toFixed(1)}%
          </span>
        )}
      </div>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------
// function AnalyticsCardSkeleton() {
//   return (
//     <Card className="flex h-full min-w-0 flex-col gap-2 rounded-lg border p-4 shadow-none">
//       <Skeleton className="h-4 w-20" />
//       <Skeleton className="h-3 w-14" />
//       <Skeleton className="h-10 w-full" />
//       <div className="flex items-end justify-between">
//         <Skeleton className="h-7 w-12" />
//         <Skeleton className="h-4 w-10" />
//       </div>
//     </Card>
//   )
// }

// ---------------------------------------------------------------------------
// AnalyticsCards (exported)
// ---------------------------------------------------------------------------
export default function AnalyticsCards() {
  const { data, isPending, isError } = useQuery({
    queryKey: [QUERY_KEYS.analytics],
    queryFn: () => analyticsApi.getDashboard(),
    staleTime: 5 * 60_000, // 5 minutes
  })

  const metrics = data?.data?.metrics ?? []
  const totalPosts = data?.data?.total_posts ?? 0

  // Don't render anything if no published posts (but still show on error)
  if (!isPending && !isError && totalPosts === 0) return null

  return (
    <div className="mx-auto mb-6 max-w-5xl px-4 md:px-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(metric => (
          <AnalyticsCard key={metric.label} metric={metric} />
        ))}
      </div>

      {!isPending && totalPosts !== 0 && !isError && (
        <div className="flex justify-end pt-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="link" className="text-xs">
                  View more
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Detailed analytics coming soon!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  )
}
