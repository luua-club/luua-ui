import { IPublishDraftRequest } from '../models/draft.model'
import { BaseApiService } from './base.api'

class PostsApi extends BaseApiService {
  constructor() {
    super('/posts')
  }

  async publishDraft(req: IPublishDraftRequest) {
    return this.post(req, '/publish-draft')
  }
}

export const postsApi = new PostsApi()
