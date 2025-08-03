import { channelType } from './social.model'

export interface IAttachedMedia {
  id: string
  title: string
  url: string
}

export type postStatusType = 'Scheduled' | 'Published' | 'Failed'

export interface IPost {
  id: string
  channel: channelType
  content: string
  status?: postStatusType
  attachedMedia?: IAttachedMedia[]
  scheduled_at?: string
  published_at?: string
  created_at?: string
  updated_at?: string
}
