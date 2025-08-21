import { channelType } from './social.model'

export type postStatusType = 'Scheduled' | 'Published' | 'Failed' | 'Queued'

export interface IPost {
  id: string
  channel: channelType
  content: string
  status?: postStatusType
  attached_media?: string[]
  scheduled_at?: string
  published_at?: string
  created_at?: string
  updated_at?: string
}
