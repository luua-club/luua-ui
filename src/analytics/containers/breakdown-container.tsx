import { useSuspenseQuery } from '@tanstack/react-query'

import { analyticsApi } from '@/core/api/analytics.api'
import { QUERY_KEYS } from '@/core/config/constant'

import LeadingPlatformCard from '../components/leading-platform-card'
import PostCountByChannelCard from '../components/post-count-by-channel-card'
import SectionEmptyState from '../components/section-empty-state'
import TotalInteractionsCard from '../components/total-interactions-card'

export default function BreakdownContainer() {
  const { data } = useSuspenseQuery({
    queryKey: [QUERY_KEYS.analytics, 'breakdown'],
    queryFn: () => analyticsApi.getBreakdown(),
    staleTime: 15 * 60_000,
  })

  if (data.interactions.total === 0 && data.publishing.total_posts === 0) {
    return (
      <SectionEmptyState
        title="No interaction breakdown yet"
        description="Platform breakdowns will appear once posts and interaction snapshots are available."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <TotalInteractionsCard breakdown={data} />
      <LeadingPlatformCard breakdown={data} />
      <PostCountByChannelCard breakdown={data} />
    </div>
  )
}
