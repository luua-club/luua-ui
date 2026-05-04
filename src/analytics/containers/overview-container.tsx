import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { analyticsApi } from '@/core/api/analytics.api'
import { QUERY_KEYS } from '@/core/config/constant'

import SectionEmptyState from '../components/section-empty-state'
import { SocialMetricCard } from '../components/social-metric-cards'
import { metricConfigs } from '../config/metric.config'

export default function OverviewContainer() {
  const { data } = useSuspenseQuery({
    queryKey: [QUERY_KEYS.analytics, 'overview'],
    queryFn: () => analyticsApi.getOverview(),
    staleTime: 15 * 60_000,
  })

  const metricCards = useMemo(
    () =>
      metricConfigs.map(config => {
        const summary = data.metrics.find(
          metric => metric.key === config.metric
        )

        return {
          ...config,
          value: summary?.value ?? 0,
          change: summary?.change_percent ?? null,
        }
      }),
    [data.metrics]
  )

  if (data.metrics.length === 0) {
    return (
      <SectionEmptyState
        title="No overview metrics yet"
        description="Analytics metrics will appear after published posts have collected snapshots."
      />
    )
  }

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
