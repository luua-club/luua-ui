import {
  DraftItem,
  IDraftListRequest,
  IDraftListResponse,
  IDraftRenameRequest,
  IDraftRequest,
  IDraftResponse,
  ILockResponse,
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
    return this.patch<IDraftResponse, Pick<IDraftRenameRequest, 'name'>>(
      { name: data.name },
      `${data.id}/metadata`
    )
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
      inspiration_id?: string
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

    // Add inspiration_id if provided in request
    if ('inspiration_id' in request && request.inspiration_id) {
      payload['inspiration_id'] = request.inspiration_id
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

  async lockDraft(draftId: string) {
    return this.post<ILockResponse>({}, `${draftId}/lock`)
  }

  async unlockDraft(draftId: string) {
    return this.delete(`${draftId}/lock`)
  }
}

export const draftsApi = new DraftsApi()
