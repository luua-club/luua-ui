import { type IAnalyticsBreakdownResponse } from '@/core/models/analytics.model'
import { getSocialPlatformLabel } from '@/core/utils/social.utils'
import StackedAreaChart from '@/shared/components/charts/stacked-area-chart'
import { useTheme } from '@/shared/provider/theme-provider'

import AnalyticsChartCard from '../layouts/analytics-chart-card-layout'
import {
  createPlatformChartConfig,
  getPlatformChartColors,
  toDateLabel,
} from '../utils/platform-chart.utils'
import { formatNumber } from '../utils/utils'
import PlatformChartLegend from './platform-chart-legend'

type TotalInteractionsCardProps = {
  breakdown: IAnalyticsBreakdownResponse
}

export default function TotalInteractionsCard({
  breakdown,
}: TotalInteractionsCardProps) {
  const { theme } = useTheme()
  const platformColors = getPlatformChartColors(theme)
  const chartConfig = createPlatformChartConfig(platformColors)
  const interactions = breakdown.interactions
  const chartData = interactions.daily_trend.map(point => ({
    date: toDateLabel(point.date),
    LinkedIn: point.LinkedIn,
    Twitter: point.Twitter,
  }))
  const dateLabels = chartData.filter((_, index) => {
    if (index === 0 || index === chartData.length - 1) return true
    return index % 7 === 0
  })

  return (
    <AnalyticsChartCard
      title="Total Interactions"
      value={formatNumber(interactions.total)}
      helper={`${formatNumber(interactions.post_count)} posts measured`}
      tooltip={`Total interactions is the sum of likes and comments across LinkedIn and ${getSocialPlatformLabel('Twitter')} for the selected period.`}
      trend={interactions.change_percent}
      legend={<PlatformChartLegend colors={platformColors} />}
      chart={
        <StackedAreaChart
          data={chartData}
          config={chartConfig}
          xAxisKey="date"
          series={[
            {
              key: 'LinkedIn',
              color: platformColors.LinkedIn,
              gradientId: 'totalLinkedinFill',
            },
            {
              key: 'Twitter',
              color: platformColors.Twitter,
              gradientId: 'totalTwitterFill',
            },
          ]}
          stackId="interactions"
          tooltipClassName="w-[150px]"
        />
      }
      footer={
        <div className="text-muted-foreground flex shrink-0 items-center justify-between px-5 pt-1 pb-4 text-[11px] leading-none font-medium">
          {dateLabels.map(label => (
            <span key={label.date}>{label.date}</span>
          ))}
        </div>
      }
    />
  )
}
