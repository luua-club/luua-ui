import { IPublishDraftRequest } from '../models/draft.model'
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
}

export const postsApi = new PostsApi()
