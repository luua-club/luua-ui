import {
  ICalendarEventsRequest,
  ICalendarEventsResponse,
} from '@/posts-view/models/calendar.model'

import { IPublishDraftRequest } from '../models/draft.model'
import {
  IAnalyticsResponse,
  IPostListRequest,
  IPostListResponse,
} from '../models/post.model'
import {
  IPublishedPostListRequest,
  IPublishedPostListResponse,
} from '../models/published-post.model'
import {
  IScheduledPostRequest,
  IScheduledPostResponse,
  IScheduleDraftRequest,
} from '../models/schedule.model'
import { BaseApiService } from './base.api'

class PostsApi extends BaseApiService {
  constructor() {
    super('/posts')
  }

  async publishDraft(req: IPublishDraftRequest) {
    return this.post(req, '/publish-draft')
  }

  async scheduleDraft(req: IScheduleDraftRequest) {
    return this.post(req, '/schedule-draft')
  }

  async getScheduledPosts(req: IScheduledPostRequest) {
    const { from = null, to = null, sort = 'desc', limit, offset } = req

    return this.get<IScheduledPostResponse>('/scheduled', {
      params: { from, to, sort, limit, offset },
    })
  }

  async deleteScheduledPost(id: string) {
    return this.delete(`/scheduled/${id}`)
  }

  async getPublishedPosts(req: IPublishedPostListRequest) {
    const { from = null, to = null, sort = 'desc', limit, offset } = req

    return this.get<IPublishedPostListResponse>('/published', {
      params: { from, to, sort, limit, offset },
    })
  }

  async retryPost(id: string) {
    return this.post({ post_id: id }, `/retry`)
  }

  async listPosts(req: IPostListRequest) {
    return this.get<IPostListResponse>('', { params: req })
  }

  async getCalendarEvents(req: ICalendarEventsRequest) {
    return this.get<ICalendarEventsResponse>('/calendar', {
      params: req,
    })
  }

  async getAnalytics() {
    return this.get<IAnalyticsResponse>('/analytics')
  }
}

export const postsApi = new PostsApi()
