import { IPagination } from './pagination.model'
import { IPost } from './post.model'

export interface IScheduleDraftRequest {
  draft_id: string
  schedules: {
    [key: string]: string
  }
}

export interface IScheduledPostRequest extends Omit<IPagination, 'total'> {
  sort: 'asc' | 'desc'
  from?: string
  to?: string
}

export interface IScheduledPostResponse extends IPagination {
  posts: IPost[]
}
