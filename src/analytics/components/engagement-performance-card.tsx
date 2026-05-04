import { format } from 'date-fns'
import { CircleHelp } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { type IAnalyticsBreakdownResponse } from '@/core/models/analytics.model'
import {
  getSocialPlatformChartColor,
  getSocialPlatformLabel,
} from '@/core/utils/social.utils'
import { useTheme } from '@/shared/provider/theme-provider'
import { Card } from '@/shared/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/shared/ui/chart'
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/ui/tooltip'

import { formatNumber, parseDateKey } from '../utils'
import ChangePill from './change-pill'

type CommonEngagementCardProps = {
  breakdown: IAnalyticsBreakdownResponse
}

type ChartPoint = {
  date: string
  LinkedIn: number
  Twitter: number
}

type AnalyticsAreaMetricCardProps = {
  title: string
  value: string
  helper: string
  tooltip: string
  trend: number | null
  chartData: ChartPoint[]
  chartConfig: ChartConfig
  gradientIds: {
    LinkedIn: string
    Twitter: string
  }
}

type LeadingChannelComparisonCardProps = {
  breakdown: IAnalyticsBreakdownResponse
}

type PlatformChartColors = {
  LinkedIn: string
  Twitter: string
}

function usePlatformChartColors(): PlatformChartColors {
  const { theme } = useTheme()
  const mode = theme === 'dark' ? 'dark' : 'light'

  return {
    LinkedIn: getSocialPlatformChartColor('LinkedIn', mode),
    Twitter: getSocialPlatformChartColor('Twitter', mode),
  }
}

function createPlatformChartConfig({
  metricLabel,
  colors,
}: {
  metricLabel?: string
  colors: PlatformChartColors
}) {
  return {
    ...(metricLabel
      ? {
          [metricLabel.toLowerCase()]: {
            label: metricLabel,
          },
        }
      : {}),
    LinkedIn: {
      label: 'LinkedIn',
      color: colors.LinkedIn,
    },
    Twitter: {
      label: getSocialPlatformLabel('Twitter'),
      color: colors.Twitter,
    },
  } satisfies ChartConfig
}

function AnalyticsAreaMetricCard({
  title,
  value,
  helper,
  tooltip,
  trend,
  chartData,
  chartConfig,
  gradientIds,
}: AnalyticsAreaMetricCardProps) {
  const linkedinColor = chartConfig.LinkedIn.color ?? 'currentColor'
  const twitterColor = chartConfig.Twitter.color ?? 'currentColor'

  const dateLabels = chartData.filter((_, index) => {
    if (index === 0 || index === chartData.length - 1) return true
    return index % 7 === 0
  })

  return (
    <Card className="w-full max-w-[400px] min-w-0 gap-0 overflow-hidden rounded-xl border p-0 shadow-none">
      <div className="flex items-start justify-between gap-4 px-5 pt-4">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-1.5">
            <p className="text-foreground truncate text-sm font-semibold">
              {title}
            </p>
            <UiTooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="About engagement metric"
                  className="text-muted-foreground hover:text-foreground flex size-4 shrink-0 items-center justify-center rounded-full transition-colors"
                >
                  <CircleHelp className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-64">
                {tooltip}
              </TooltipContent>
            </UiTooltip>
          </div>
          <p className="text-foreground mt-1 truncate text-2xl font-semibold tracking-tight">
            {value}
          </p>
          <p className="text-muted-foreground mt-0.5 truncate text-xs font-medium">
            {helper}
          </p>
        </div>
        <ChangePill value={trend} />
      </div>

      <div className="mt-1 flex items-center justify-end gap-4 px-5 text-[11px] font-medium">
        <div className="text-muted-foreground flex items-center gap-1.5">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: linkedinColor }}
          />
          LinkedIn
        </div>
        <div className="text-muted-foreground flex items-center gap-1.5">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: twitterColor }}
          />
          {getSocialPlatformLabel('Twitter')}
        </div>
      </div>

      <div className="h-[120px] shrink-0 px-1 pt-1">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 6,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id={gradientIds.LinkedIn}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={linkedinColor}
                  stopOpacity={0.38}
                />
                <stop
                  offset="95%"
                  stopColor={linkedinColor}
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient
                id={gradientIds.Twitter}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={twitterColor} stopOpacity={0.42} />
                <stop
                  offset="95%"
                  stopColor={twitterColor}
                  stopOpacity={0.04}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              hide
              tickLine={false}
              axisLine={false}
              height={0}
            />
            <YAxis hide domain={[0, 'dataMax + 200']} />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent className="w-[150px]" />}
            />
            <Area
              dataKey="LinkedIn"
              type="monotone"
              stackId="engagement"
              stroke={linkedinColor}
              strokeWidth={2}
              fill={`url(#${gradientIds.LinkedIn})`}
              fillOpacity={1}
              isAnimationActive={false}
            />
            <Area
              dataKey="Twitter"
              type="monotone"
              stackId="engagement"
              stroke={twitterColor}
              strokeWidth={2}
              fill={`url(#${gradientIds.Twitter})`}
              fillOpacity={1}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </div>

      <div className="text-muted-foreground flex shrink-0 items-center justify-between px-5 pt-1 pb-4 text-[11px] leading-none font-medium">
        {dateLabels.map(label => (
          <span key={label.date}>{label.date}</span>
        ))}
      </div>
    </Card>
  )
}

function toDateLabel(date: string) {
  return format(parseDateKey(date), 'MMM d')
}

function channelValue(
  points: { channel: 'LinkedIn' | 'Twitter'; value?: number; count?: number }[],
  channel: 'LinkedIn' | 'Twitter'
) {
  const point = points.find(item => item.channel === channel)

  return point?.value ?? point?.count ?? 0
}

export function TotalEngagementCard({ breakdown }: CommonEngagementCardProps) {
  const platformColors = usePlatformChartColors()
  const totalChartConfig = createPlatformChartConfig({
    colors: platformColors,
  })
  const interactions = breakdown.interactions
  const chartData = interactions.daily_trend.map(point => ({
    date: toDateLabel(point.date),
    LinkedIn: point.LinkedIn,
    Twitter: point.Twitter,
  }))

  return (
    <AnalyticsAreaMetricCard
      title="Total Interactions"
      value={formatNumber(interactions.total)}
      helper={`${formatNumber(interactions.post_count)} posts measured`}
      tooltip={`Total interactions is the sum of likes and comments across LinkedIn and ${getSocialPlatformLabel('Twitter')} for the selected period.`}
      trend={interactions.change_percent}
      chartData={chartData}
      chartConfig={totalChartConfig}
      gradientIds={{
        LinkedIn: 'totalLinkedinFill',
        Twitter: 'totalTwitterFill',
      }}
    />
  )
}

export function LeadingChannelCard({
  breakdown,
}: LeadingChannelComparisonCardProps) {
  const platformColors = usePlatformChartColors()
  const twitterLabel = getSocialPlatformLabel('Twitter')
  const leadingChannelChartConfig = {
    interactions: {
      label: 'Interactions',
    },
    LinkedIn: {
      label: 'LinkedIn',
      color: platformColors.LinkedIn,
    },
    Twitter: {
      label: twitterLabel,
      color: platformColors.Twitter,
    },
  } satisfies ChartConfig
  const interactions = breakdown.interactions
  const LinkedIn = channelValue(interactions.by_channel, 'LinkedIn')
  const Twitter = channelValue(interactions.by_channel, 'Twitter')
  const leadingSummary = interactions.leading_channel
  const leadingChannel =
    leadingSummary?.channel === 'Twitter' ? twitterLabel : 'LinkedIn'
  const leadingValue = leadingSummary?.value ?? Math.max(Twitter, LinkedIn)
  const leadingShare = Math.round(
    leadingSummary?.share_percent ??
      (leadingValue / Math.max(interactions.total, 1)) * 100
  )
  const chartData = [
    {
      channel: 'LinkedIn',
      interactions: LinkedIn,
      fill: 'var(--color-LinkedIn)',
    },
    {
      channel: 'Twitter',
      interactions: Twitter,
      fill: 'var(--color-Twitter)',
    },
  ]

  return (
    <Card className="w-full max-w-[400px] min-w-0 gap-0 overflow-hidden rounded-xl border p-0 shadow-none">
      <div className="flex items-start justify-between gap-4 px-5 pt-4">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-1.5">
            <p className="text-foreground truncate text-sm font-semibold">
              Leading Platform
            </p>
            <UiTooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="About leading channel metric"
                  className="text-muted-foreground hover:text-foreground flex size-4 shrink-0 items-center justify-center rounded-full transition-colors"
                >
                  <CircleHelp className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-64">
                Leading platform shows which platform generated the larger share
                of likes and comments in the selected period.
              </TooltipContent>
            </UiTooltip>
          </div>
          <p className="text-foreground mt-1 truncate text-xl font-semibold tracking-tight">
            {leadingChannel}
          </p>
          <p className="text-muted-foreground mt-0.5 truncate text-xs font-medium">
            {leadingShare}% of interactions · {formatNumber(leadingValue)} total
          </p>
        </div>
      </div>

      <div className="mt-1 flex h-4 items-center justify-end gap-4 px-5 text-[11px] font-medium">
        <div className="text-muted-foreground flex items-center gap-1.5">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: platformColors.LinkedIn }}
          />
          LinkedIn
        </div>
        <div className="text-muted-foreground flex items-center gap-1.5">
          <span
            className="border-border size-2 rounded-full border"
            style={{ backgroundColor: platformColors.Twitter }}
          />
          {twitterLabel}
        </div>
      </div>

      <div className="h-[120px] shrink-0 px-3 pt-1 pb-1">
        <ChartContainer
          config={leadingChannelChartConfig}
          className="h-full w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              top: 6,
              right: 18,
              left: 8,
              bottom: 6,
            }}
          >
            <YAxis
              dataKey="channel"
              type="category"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              width={64}
              tickFormatter={value => value}
              fontSize={11}
            />
            <XAxis dataKey="interactions" type="number" hide />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent className="w-[150px]" />}
            />
            <Bar dataKey="interactions" radius={6} isAnimationActive={false} />
          </BarChart>
        </ChartContainer>
      </div>

      <div className="text-muted-foreground flex shrink-0 items-center justify-between px-5 pt-1 pb-4 text-[11px] leading-none font-medium">
        <span>Share of common interactions</span>
      </div>
    </Card>
  )
}

export function PostCountByChannelCard({
  breakdown,
}: {
  breakdown: IAnalyticsBreakdownResponse
}) {
  const platformColors = usePlatformChartColors()
  const postCountChartConfig = {
    posts: {
      label: 'Posts',
    },
    LinkedIn: {
      label: 'LinkedIn',
      color: platformColors.LinkedIn,
    },
    Twitter: {
      label: getSocialPlatformLabel('Twitter'),
      color: platformColors.Twitter,
    },
  } satisfies ChartConfig
  const publishing = breakdown.publishing
  const linkedinPosts = channelValue(
    publishing.post_count_by_channel,
    'LinkedIn'
  )
  const twitterPosts = channelValue(publishing.post_count_by_channel, 'Twitter')
  const totalPosts = publishing.total_posts
  const chartData = [
    {
      channel: 'LinkedIn',
      posts: linkedinPosts,
      fill: 'var(--color-LinkedIn)',
    },
    {
      channel: 'Twitter',
      posts: twitterPosts,
      fill: 'var(--color-Twitter)',
    },
  ].filter(point => point.posts > 0)

  return (
    <Card className="w-full max-w-[400px] min-w-0 gap-0 overflow-hidden rounded-xl border p-0 shadow-none">
      <div className="flex items-start justify-between gap-4 px-5 pt-4">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-1.5">
            <p className="text-foreground truncate text-sm font-semibold">
              Post Count
            </p>
            <UiTooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="About post count by channel"
                  className="text-muted-foreground hover:text-foreground flex size-4 shrink-0 items-center justify-center rounded-full transition-colors"
                >
                  <CircleHelp className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-64">
                Post count shows how many published posts came from each channel
                in the selected period.
              </TooltipContent>
            </UiTooltip>
          </div>
          <p className="text-foreground mt-1 truncate text-2xl font-semibold tracking-tight">
            {formatNumber(totalPosts)}
          </p>
          <p className="text-muted-foreground mt-0.5 truncate text-xs font-medium">
            published posts by channel
          </p>
        </div>
      </div>

      <div className="mt-1 h-[140px] shrink-0 px-3">
        <ChartContainer config={postCountChartConfig} className="h-full w-full">
          <PieChart accessibilityLayer>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent className="w-[140px]" />}
            />
            <Pie
              data={chartData}
              dataKey="posts"
              nameKey="channel"
              innerRadius={38}
              outerRadius={58}
              paddingAngle={4}
              stroke="var(--color-card)"
              strokeWidth={4}
              isAnimationActive={false}
            />
          </PieChart>
        </ChartContainer>
      </div>

      <div className="flex shrink-0 items-center justify-center gap-5 px-5 pt-1 pb-4 text-[11px] leading-none font-medium">
        <div className="text-muted-foreground flex items-center gap-1.5">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: platformColors.LinkedIn }}
          />
          LinkedIn · {formatNumber(linkedinPosts)}
        </div>
        <div className="text-muted-foreground flex items-center gap-1.5">
          <span
            className="border-border size-2 rounded-full border"
            style={{ backgroundColor: platformColors.Twitter }}
          />
          {getSocialPlatformLabel('Twitter')} · {formatNumber(twitterPosts)}
        </div>
      </div>
    </Card>
  )
}
