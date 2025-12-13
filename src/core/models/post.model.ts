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
