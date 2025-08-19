import { IPublishDraftRequest } from '../models/draft.model'
import { IScheduleDraftRequest } from '../models/schedule.model'
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
}

export const postsApi = new PostsApi()
