import { type IAnalyticsBreakdownResponse } from '@/core/models/analytics.model'
import { getSocialPlatformLabel } from '@/core/utils/social.utils'
import DonutChart from '@/shared/components/charts/donut-chart'
import { useTheme } from '@/shared/provider/theme-provider'
import { type ChartConfig } from '@/shared/ui/chart'

import AnalyticsChartCard from '../layouts/analytics-chart-card-layout'
import {
  channelValue,
  getPlatformChartColors,
  makePlatformChartData,
} from '../utils/platform-chart.utils'
import { formatNumber } from '../utils/utils'
import PlatformChartLegend from './platform-chart-legend'

type PostCountByChannelCardProps = {
  breakdown: IAnalyticsBreakdownResponse
}

export default function PostCountByChannelCard({
  breakdown,
}: PostCountByChannelCardProps) {
  const { theme } = useTheme()
  const platformColors = getPlatformChartColors(theme)
  const publishing = breakdown.publishing
  const linkedinPosts = channelValue(
    publishing.post_count_by_channel,
    'LinkedIn'
  )
  const twitterPosts = channelValue(publishing.post_count_by_channel, 'Twitter')
  const totalPosts = publishing.total_posts
  const chartConfig = {
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
  const chartData = makePlatformChartData({
    LinkedIn: linkedinPosts,
    Twitter: twitterPosts,
    valueKey: 'posts',
  }).filter(point => Number(point.posts) > 0)

  return (
    <AnalyticsChartCard
      title="Post Count"
      value={formatNumber(totalPosts)}
      helper="published posts by channel"
      tooltip="Post count shows how many published posts came from each channel in the selected period."
      chartClassName="mt-1 h-[140px] px-3"
      chart={
        <DonutChart
          data={chartData}
          config={chartConfig}
          dataKey="posts"
          nameKey="channel"
          tooltipClassName="w-[140px]"
        />
      }
      footer={
        <PlatformChartLegend
          colors={platformColors}
          showValues={{
            LinkedIn: formatNumber(linkedinPosts),
            Twitter: formatNumber(twitterPosts),
          }}
          className="flex shrink-0 items-center justify-center gap-5 px-5 pt-1 pb-4 text-[11px] leading-none font-medium"
        />
      }
    />
  )
}
