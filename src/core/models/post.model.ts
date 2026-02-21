import { channelType } from './social.model'

export type postStatusType = 'Scheduled' | 'Published' | 'Failed' | 'Queued'

export interface MediaObject {
  url: string
  thumbnail?: string
}

export interface IPost {
  id: string
  channel: channelType
  content: string
  status?: postStatusType
  attached_media?: MediaObject[]
  external_id?: string
  scheduled_at?: string
  published_at?: string
  created_at?: string
  updated_at?: string
}

export interface PostPreviewProps {
  initialContent?: string
  loading?: boolean
  notEditable?: boolean
  isActionLoading?: boolean
  onContentChange?: (content: string) => void
  handlePostDelete?: () => void
  hideDelete?: boolean
}

export interface IDailyDataPoint {
  date: string
  value: number
}

export interface IAnalyticsMetric {
  label: string
  value: number
  change_percent: number | null
  daily_data: IDailyDataPoint[]
}

export interface IAnalyticsResponse {
  metrics: IAnalyticsMetric[]
  period_start: string
  period_end: string
  total_posts: number
}

export interface IDailyDataPoint {
  date: string
  value: number
}

export interface IAnalyticsMetric {
  label: string
  value: number
  change_percent: number | null
  daily_data: IDailyDataPoint[]
}

export interface IAnalyticsResponse {
  metrics: IAnalyticsMetric[]
  period_start: string
  period_end: string
  total_posts: number
}
