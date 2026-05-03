import {
  addDays,
  eachDayOfInterval,
  format,
  startOfWeek,
  subDays,
} from 'date-fns'

import {
  type AnalyticsChannel,
  type IAnalyticsHistoryPoint,
  type IAnalyticsLatestMetrics,
  type IAnalyticsPost,
  type IAnalyticsPostHistoryResponse,
  type ICommonAnalyticsData,
} from '@/core/models/analytics.model'

export const ACTIVITY_WEEKS = 52

export type ChannelTotals = Record<AnalyticsChannel, number>

export type AnalyticsMetricKey = Exclude<
  keyof IAnalyticsLatestMetrics,
  'snapshot_date'
>

export type TrendPoint = {
  date: string
  total: number
  LinkedIn: number
  Twitter: number
}

export type ActivityPoint = {
  date: string
  count: number
}

export type CommonAnalyticsSummary = {
  totalEngagement: number
  channelEngagement: ChannelTotals
  channelPostCount: Record<AnalyticsChannel, number>
  avgEngagementPerPost: number
  trend: TrendPoint[]
  activity: ActivityPoint[]
  topPosts: IAnalyticsPost[]
  historiesByPostId: Map<string, IAnalyticsPostHistoryResponse>
}

export function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function toDateKey(value: string | null | undefined) {
  if (!value) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return format(date, 'yyyy-MM-dd')
}

export function metricValue(value: number | null | undefined) {
  return Number.isFinite(value) ? Number(value) : 0
}

export function commonEngagement(post: IAnalyticsPost) {
  return (
    metricValue(post.latest_metrics.likes) +
    metricValue(post.latest_metrics.comments)
  )
}

export function commonEngagementPoint(point: IAnalyticsHistoryPoint) {
  return metricValue(point.likes) + metricValue(point.comments)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en', {
    notation: value >= 10_000 ? 'compact' : 'standard',
    maximumFractionDigits: value >= 10_000 ? 1 : 0,
  }).format(value)
}

export function formatChange(value: number | null) {
  if (value === null || !Number.isFinite(value)) return null
  return `${Math.abs(value).toFixed(1)}%`
}

export function getChangePercent(first: number, last: number) {
  if (first === 0) return last > 0 ? null : 0
  return ((last - first) / first) * 100
}

/**
 * Calculate the overall trend change from the first non-zero total trend point
 * to the latest point. This avoids treating leading zero days as a real
 * baseline when a selected range starts before analytics data exists.
 */
export function getTotalTrendChange(points: TrendPoint[]) {
  const firstPoint = points.find(point => point.total > 0)
  const lastPoint = points[points.length - 1]

  if (!firstPoint || !lastPoint) return null

  return getChangePercent(firstPoint.total, lastPoint.total)
}

function includesAnalyticsChannel(
  channel: AnalyticsChannel,
  channels?: AnalyticsChannel[]
) {
  return !channels || channels.includes(channel)
}

/**
 * Sum the latest snapshot value for one analytics metric across posts.
 * Pass `channels` when a widget should only count a subset of platforms.
 */
export function getAnalyticsLatestMetricTotal({
  posts,
  metric,
  channels,
}: {
  posts: IAnalyticsPost[]
  metric: AnalyticsMetricKey
  channels?: AnalyticsChannel[]
}) {
  return posts.reduce((total, post) => {
    if (!includesAnalyticsChannel(post.channel, channels)) return total
    return total + metricValue(post.latest_metrics[metric])
  }, 0)
}

/**
 * Compare the first and latest history snapshots for a metric across channels.
 * This keeps KPI trend logic reusable for cards, tables, and future charts.
 */
export function getAnalyticsHistoryMetricChange({
  histories,
  metric,
  channels,
}: {
  histories: IAnalyticsPostHistoryResponse[]
  metric: AnalyticsMetricKey
  channels?: AnalyticsChannel[]
}) {
  const matchingHistories = histories.filter(history =>
    includesAnalyticsChannel(history.channel, channels)
  )

  const firstTotal = matchingHistories.reduce((total, history) => {
    const orderedPoints = [...history.data_points].sort((a, b) =>
      a.snapshot_date.localeCompare(b.snapshot_date)
    )
    const firstPoint = orderedPoints[0]
    return total + metricValue(firstPoint?.[metric])
  }, 0)

  const lastTotal = matchingHistories.reduce((total, history) => {
    const orderedPoints = [...history.data_points].sort((a, b) =>
      a.snapshot_date.localeCompare(b.snapshot_date)
    )
    const lastPoint = orderedPoints[orderedPoints.length - 1]
    return total + metricValue(lastPoint?.[metric])
  }, 0)

  return getChangePercent(firstTotal, lastTotal)
}

function buildTrend(
  posts: IAnalyticsPost[],
  histories: IAnalyticsPostHistoryResponse[],
  startDate: string,
  endDate: string
): TrendPoint[] {
  const dates = eachDayOfInterval({
    start: parseDateKey(startDate),
    end: parseDateKey(endDate),
  }).map(date => format(date, 'yyyy-MM-dd'))

  const trend = dates.map(date => {
    const point: TrendPoint = {
      date,
      total: 0,
      LinkedIn: 0,
      Twitter: 0,
    }

    histories.forEach(history => {
      const availablePoints = [...history.data_points]
        .sort((a, b) => a.snapshot_date.localeCompare(b.snapshot_date))
        .filter(dataPoint => dataPoint.snapshot_date <= date)
      const latestPoint = availablePoints[availablePoints.length - 1]

      if (!latestPoint) return

      const engagement = commonEngagementPoint(latestPoint)
      point[history.channel] += engagement
      point.total += engagement
    })

    return point
  })

  if (trend.some(point => point.total > 0)) return trend

  const fallback = dates.map(date => ({
    date,
    total: 0,
    LinkedIn: 0,
    Twitter: 0,
  }))

  posts.forEach(post => {
    const date =
      post.latest_metrics.snapshot_date ?? toDateKey(post.published_at)
    const fallbackPoint = fallback.find(point => point.date === date)
    if (!fallbackPoint) return

    const engagement = commonEngagement(post)
    fallbackPoint[post.channel] += engagement
    fallbackPoint.total += engagement
  })

  return fallback
}

function buildActivity(posts: IAnalyticsPost[], endDate: string) {
  const graphStart = startOfWeek(
    subDays(parseDateKey(endDate), (ACTIVITY_WEEKS - 1) * 7),
    { weekStartsOn: 0 }
  )
  const graphEnd = addDays(graphStart, ACTIVITY_WEEKS * 7 - 1)
  const countByDate = new Map<string, number>()

  posts.forEach(post => {
    const dateKey = toDateKey(post.published_at)
    if (!dateKey) return
    countByDate.set(dateKey, (countByDate.get(dateKey) ?? 0) + 1)
  })

  return eachDayOfInterval({ start: graphStart, end: graphEnd }).map(date => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return {
      date: dateKey,
      count: countByDate.get(dateKey) ?? 0,
    }
  })
}

export function summarizeCommonAnalytics(
  data: ICommonAnalyticsData
): CommonAnalyticsSummary {
  const channelEngagement: ChannelTotals = {
    LinkedIn: 0,
    Twitter: 0,
  }
  const channelPostCount: Record<AnalyticsChannel, number> = {
    LinkedIn: 0,
    Twitter: 0,
  }

  data.posts.forEach(post => {
    channelEngagement[post.channel] += commonEngagement(post)
    channelPostCount[post.channel] += 1
  })

  const totalEngagement = channelEngagement.LinkedIn + channelEngagement.Twitter
  const historiesByPostId = new Map(
    data.histories.map(history => [history.post_id, history])
  )

  return {
    totalEngagement,
    channelEngagement,
    channelPostCount,
    avgEngagementPerPost:
      data.posts.length > 0 ? totalEngagement / data.posts.length : 0,
    trend: buildTrend(data.posts, data.histories, data.startDate, data.endDate),
    activity: buildActivity(data.posts, data.endDate),
    topPosts: [...data.posts]
      .sort((a, b) => {
        const engagementDiff = commonEngagement(b) - commonEngagement(a)
        if (engagementDiff !== 0) return engagementDiff
        return (
          new Date(b.published_at ?? 0).getTime() -
          new Date(a.published_at ?? 0).getTime()
        )
      })
      .slice(0, 10),
    historiesByPostId,
  }
}
