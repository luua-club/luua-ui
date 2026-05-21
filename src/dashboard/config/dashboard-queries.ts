import { analyticsApi } from '@/core/api/analytics.api'
import { draftsApi } from '@/core/api/drafts.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { queryClient } from '@/core/config/global.config'

export const DASHBOARD_ACTIVITY_WEEKS = 52

export const DASHBOARD_ACTIVITY_QUERY_KEY = [
  QUERY_KEYS.analytics,
  'dashboard-activity',
] as const

export const DASHBOARD_ACTIVITY_STALE_TIME = 15 * 60_000
export const DASHBOARD_ACTIVITY_GC_TIME = 15 * 60_000

export const DASHBOARD_DRAFTS_QUERY_KEY = [
  QUERY_KEYS.drafts,
  'dashboard',
  7,
] as const

export const DASHBOARD_DRAFTS_STALE_TIME = 30_000
export const DASHBOARD_DRAFTS_GC_TIME = 5 * 60_000

export function prefetchDashboardQueries() {
  return Promise.all([
    queryClient.ensureQueryData({
      queryKey: DASHBOARD_ACTIVITY_QUERY_KEY,
      queryFn: () =>
        analyticsApi.getActivity({ weeks: DASHBOARD_ACTIVITY_WEEKS }),
      staleTime: DASHBOARD_ACTIVITY_STALE_TIME,
    }),
    queryClient.ensureQueryData({
      queryKey: DASHBOARD_DRAFTS_QUERY_KEY,
      queryFn: () => draftsApi.getDrafts({ limit: 7, offset: 0, sort: 'desc' }),
      staleTime: DASHBOARD_DRAFTS_STALE_TIME,
    }),
  ])
}
