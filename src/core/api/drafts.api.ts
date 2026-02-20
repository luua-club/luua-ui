import {
  DraftItem,
  IDraftListRequest,
  IDraftListResponse,
  IDraftRenameRequest,
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

  async renameDraft(data: IDraftRenameRequest) {
    return this.post<IDraftResponse>(data)
  }

  async getDrafts(request: IDraftListRequest, autopilot = false) {
    const { from = null, to = null, sort = 'desc', limit, offset } = request
    const payload: {
      from: string | null
      to: string | null
      sort: string
      limit: number
      offset: number
      autopilot?: boolean
    } = {
      from,
      to,
      sort,
      limit,
      offset,
    }

    if (autopilot) {
      payload['autopilot'] = true
    }

    return this.get<IDraftListResponse>(undefined, {
      params: payload,
    })
  }

  async getDraft(draftId: string) {
    return this.get<DraftItem>(draftId)
  }

  async deleteDraft(draftId: string) {
    return this.delete(draftId)
  }

  async deletePost(draftId: string, postId: string) {
    return this.delete(`${draftId}/posts/${postId}`)
  }
}

export const draftsApi = new DraftsApi()
