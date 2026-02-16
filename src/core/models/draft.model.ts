import { WithOptional } from '../models/common.model'
import { IPagination } from './pagination.model'
import { IPost } from './post.model'

export type PostItem = Pick<
  IPost,
  'id' | 'content' | 'channel' | 'attached_media'
>

export type DraftItem = {
  id: string
  posts: PostItem[]
  autopilot?: boolean
  inspiration_ids?: string[]
  created_at: string
  updated_at: string
}

export interface IDraftRequest {
  id?: string
  posts: WithOptional<PostItem, 'id'>[]
}

export interface IDraftResponse {
  draft: DraftItem
}

export interface IDraftListRequest extends Omit<IPagination, 'total'> {
  sort: 'asc' | 'desc'
  from?: string
  to?: string
  inspiration_id?: string
}

export interface IDraftListResponse extends IPagination {
  posts: DraftItem[]
}

export interface IPublishDraftRequest {
  draft_id: string
  post_ids: string[]
}
