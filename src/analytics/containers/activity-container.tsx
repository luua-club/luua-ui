import { useSuspenseQuery } from '@tanstack/react-query'

import { analyticsApi } from '@/core/api/analytics.api'
import { QUERY_KEYS } from '@/core/config/constant'

import SectionEmptyState from '../components/section-empty-state'
import TopPostsTable from '../components/top-posts-table'

export default function ActivityContainer() {
  const { data } = useSuspenseQuery({
    queryKey: [QUERY_KEYS.analytics, 'recent-posts'],
    queryFn: () =>
      analyticsApi.getPosts({
        limit: 100,
        offset: 0,
        sort_by: 'published_at',
        sort_order: 'desc',
        include_trend: true,
        trend_metric: 'common_interactions',
      }),
    staleTime: 15 * 60_000,
  })

  if (data.posts.length === 0) {
    return (
      <SectionEmptyState
        title="No recent posts yet"
        description="Recent posts will appear after published posts have collected analytics snapshots."
      />
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <TopPostsTable posts={data.posts} />
    </div>
  )
}
