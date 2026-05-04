import { type IAnalyticsBreakdownResponse } from '@/core/models/analytics.model'
import { getSocialPlatformLabel } from '@/core/utils/social.utils'
import VerticalBarChart from '@/shared/components/charts/vertical-bar-chart'
import { useTheme } from '@/shared/provider/theme-provider'

import AnalyticsChartCard from '../layouts/analytics-chart-card-layout'
import {
  channelValue,
  getPlatformChartColors,
  makePlatformChartData,
} from '../utils/platform-chart.utils'
import { formatNumber } from '../utils/utils'
import PlatformChartLegend from './platform-chart-legend'

type LeadingPlatformCardProps = {
  breakdown: IAnalyticsBreakdownResponse
}

export default function LeadingPlatformCard({
  breakdown,
}: LeadingPlatformCardProps) {
  const { theme } = useTheme()
  const platformColors = getPlatformChartColors(theme)
  const twitterLabel = getSocialPlatformLabel('Twitter')
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
  const chartConfig = {
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
  }
  const chartData = makePlatformChartData({
    LinkedIn,
    Twitter,
    valueKey: 'interactions',
  })

  return (
    <AnalyticsChartCard
      title="Leading Platform"
      value={leadingChannel}
      helper={`${leadingShare}% of interactions · ${formatNumber(leadingValue)} total`}
      tooltip="Leading platform shows which platform generated the larger share of likes and comments in the selected period."
      legend={<PlatformChartLegend colors={platformColors} />}
      chartClassName="h-[120px] px-3 pt-1 pb-1"
      chart={
        <VerticalBarChart
          data={chartData}
          config={chartConfig}
          categoryKey="channel"
          valueKey="interactions"
          tooltipClassName="w-[150px]"
        />
      }
      footer={
        <div className="text-muted-foreground flex shrink-0 items-center justify-between px-5 pt-1 pb-4 text-[11px] leading-none font-medium">
          <span>Share of common interactions</span>
        </div>
      }
    />
  )
}
