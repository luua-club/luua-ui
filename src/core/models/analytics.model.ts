import { type channelType } from './social.model'

export type AnalyticsChannel = Extract<channelType, 'LinkedIn' | 'Twitter'>

export type AnalyticsPostSortBy =
  | 'likes'
  | 'comments'
  | 'reposts'
  | 'views'
  | 'published_at'

export type AnalyticsSortOrder = 'asc' | 'desc'

export interface IAnalyticsPostsRequest {
  limit?: number
  offset?: number
  sort_by?: AnalyticsPostSortBy
  sort_order?: AnalyticsSortOrder
  channel?: AnalyticsChannel
}

export interface IAnalyticsLatestMetrics {
  likes: number
  comments: number
  reposts: number
  views: number
  snapshot_date: string | null
}

export interface IAnalyticsPost {
  post_id: string
  channel: AnalyticsChannel
  content_preview: string
  published_at: string | null
  external_url: string | null
  has_media: boolean
  latest_metrics: IAnalyticsLatestMetrics
}

export interface IAnalyticsPostsResponse {
  posts: IAnalyticsPost[]
  total: number
  limit: number
  offset: number
}

export interface IAnalyticsPostHistoryRequest {
  start_date?: string
  end_date?: string
}

export interface IAnalyticsHistoryPoint {
  snapshot_date: string
  likes: number
  comments: number
  reposts: number
  views: number
}

export interface IAnalyticsPostHistoryResponse {
  post_id: string
  channel: AnalyticsChannel
  data_points: IAnalyticsHistoryPoint[]
}

export interface ICommonAnalyticsData {
  posts: IAnalyticsPost[]
  total: number
  histories: IAnalyticsPostHistoryResponse[]
  startDate: string
  endDate: string
}
