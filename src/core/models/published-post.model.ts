import { IPagination } from './pagination.model'
import { IPost } from './post.model'

export interface IPublishedPostListRequest extends Omit<IPagination, 'total'> {
  sort: 'asc' | 'desc'
  from?: string
  to?: string
}

export interface IPublishedPostListResponse extends IPagination {
  posts: IPost[]
}
