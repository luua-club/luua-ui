import { type channelType } from './social.model'

export type AnalyticsChannel = Extract<channelType, 'LinkedIn' | 'Twitter'>

export type AnalyticsPostSortBy =
  | 'likes'
  | 'comments'
  | 'reposts'
  | 'views'
  | 'published_at'

export type AnalyticsSortOrder = 'asc' | 'desc'

export type AnalyticsMetricKey = 'likes' | 'comments' | 'reposts' | 'views'

export type AnalyticsTrendMetric = 'common_interactions' | AnalyticsMetricKey

export interface IAnalyticsDateRangeRequest {
  start_date?: string
  end_date?: string
  channels?: AnalyticsChannel[]
}

export interface IAnalyticsPostsRequest {
  limit?: number
  offset?: number
  sort_by?: AnalyticsPostSortBy
  sort_order?: AnalyticsSortOrder
  channel?: AnalyticsChannel
  published_start_date?: string
  published_end_date?: string
  include_trend?: boolean
  trend_metric?: AnalyticsTrendMetric
}

export interface IAnalyticsLatestMetrics {
  likes: number
  comments: number
  reposts: number
  views: number
  snapshot_date: string | null
}

export interface IAnalyticsPostTrendPoint {
  date: string
  value: number
}

export interface IAnalyticsPost {
  post_id: string
  channel: AnalyticsChannel
  content_preview: string
  published_at: string | null
  external_url: string | null
  has_media: boolean
  latest_metrics: IAnalyticsLatestMetrics | null
  common_interactions?: number | null
  trend?: IAnalyticsPostTrendPoint[] | null
}

export interface IAnalyticsPostsResponse {
  posts: IAnalyticsPost[]
  total: number
  limit: number
  offset: number
}

export interface IAnalyticsRange {
  start_date: string
  end_date: string
  timezone: 'UTC'
}

export interface IAnalyticsMetricSummary {
  key: AnalyticsMetricKey
  value: number
  change_percent: number | null
  channels: AnalyticsChannel[]
  unavailable_channels: AnalyticsChannel[]
}

export interface IAnalyticsOverviewResponse {
  range: IAnalyticsRange
  metrics: IAnalyticsMetricSummary[]
}

export interface IAnalyticsChannelInteractionSummary {
  channel: AnalyticsChannel
  value: number
  post_count: number
  avg_per_post: number
  share_percent: number
}

export type IAnalyticsLeadingChannelSummary =
  IAnalyticsChannelInteractionSummary

export interface IAnalyticsDailyInteractionPoint {
  date: string
  total: number
  LinkedIn: number
  Twitter: number
}

export interface IAnalyticsInteractionsSummary {
  basis: 'likes+comments'
  total: number
  post_count: number
  avg_per_post: number
  change_percent: number | null
  by_channel: IAnalyticsChannelInteractionSummary[]
  leading_channel: IAnalyticsLeadingChannelSummary | null
  daily_trend: IAnalyticsDailyInteractionPoint[]
}

export interface IAnalyticsPostCountByChannel {
  channel: AnalyticsChannel
  count: number
  share_percent: number
}

export interface IAnalyticsPublishingSummary {
  total_posts: number
  post_count_by_channel: IAnalyticsPostCountByChannel[]
}

export interface IAnalyticsBreakdownResponse {
  range: IAnalyticsRange
  interactions: IAnalyticsInteractionsSummary
  publishing: IAnalyticsPublishingSummary
}

export interface IAnalyticsActivityRequest {
  end_date?: string
  weeks?: number
  channels?: AnalyticsChannel[]
}

export interface IAnalyticsActivityPoint {
  date: string
  count: number
  LinkedIn: number
  Twitter: number
}

export interface IAnalyticsActivityResponse {
  end_date: string
  weeks: number
  total_posts: number
  active_days: number
  peak_week: number
  activity: IAnalyticsActivityPoint[]
}
