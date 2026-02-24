import type { postStatusType } from '@/core/models/post.model'
import type { channelType } from '@/core/models/social.model'

export interface ICalendarEvent {
  id: string
  channel: channelType
  status: postStatusType
  scheduled_at: string | null
  published_at: string | null
  updated_at: string | null
  content: string
  external_id: string | null
  day_total: number
}

export interface ICalendarEventsResponse {
  events: ICalendarEvent[]
  total: number
}

export interface ICalendarEventsRequest {
  start: string
  end: string
  status?: postStatusType
  channel?: channelType
  sort?: 'asc' | 'desc'
  limit?: number
  offset?: number
}
