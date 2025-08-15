import {
  IDraftListRequest,
  IDraftListResponse,
  IDraftRequest,
  IDraftResponse,
} from '../models/draft.model'
import { BaseApiService } from './base.api'

class DraftsApi extends BaseApiService {
  constructor() {
    super('/drafts')
  }

  async postDraft(data: IDraftRequest) {
    return this.post<IDraftResponse>(data)
  }

  async getDrafts(request: IDraftListRequest) {
    const { from = null, to = null, sort = 'desc', limit, offset } = request

    return this.get<IDraftListResponse>(undefined, {
      params: { from, to, sort, limit, offset },
    })
  }

  async deleteDraft(draftId: string) {
    return this.delete(draftId)
  }

  async deletePost(draftId: string, postId: string) {
    return this.delete(`${draftId}/posts/${postId}`)
  }
}

export const draftsApi = new DraftsApi()
