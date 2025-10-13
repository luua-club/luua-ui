import { useMutation } from '@tanstack/react-query'

import { draftsApi } from '../api/drafts.api'
import { postsApi } from '../api/posts.api'
import { type IDraftRequest } from '../models/draft.model'
import { channelType } from '../models/social.model'

/**
 * useScheduleDraft
 *
 * Performs a sequential flow using React Query mutation:
 * 1) Create a draft via draftsApi.postDraft
 * 2) Schedule the created draft via postsApi.scheduleDraft
 *
 * Usage:
 * const scheduleDraft = useScheduleDraft()
 * scheduleDraft.mutate({ draftRequest: {...}, scheduleDate: '2025-08-19T12:00:00Z' })
 */
export function useScheduleDraft() {
  type Params = {
    draftRequest: IDraftRequest
    forChannel: channelType[]
    /** ISO string date to apply to all created posts */
    scheduleDate: string
  }

  const mutation = useMutation({
    mutationFn: async (params: Params) => {
      const draftPayload: IDraftRequest = {
        posts: params.draftRequest.posts,
      }

      if (params.draftRequest.id) {
        draftPayload.id = params.draftRequest.id
      }

      // Step 1: Create draft
      const draftRes = await draftsApi.postDraft(draftPayload)

      const draftId = draftRes.data.draft.id

      // Filter postIds based on forChannel
      const forChannelSet = new Set(params.forChannel)
      const postIds = draftRes.data.draft.posts
        .filter(post => forChannelSet.has(post.channel))
        .map(post => post.id)

      // Step 2: Schedule draft
      const schedules = Object.fromEntries(
        postIds.map(id => [id, params.scheduleDate])
      ) as { [key: string]: string }

      const scheduleRes = await postsApi.scheduleDraft({
        draft_id: draftId,
        schedules,
      })

      return {
        draftId,
        draft: draftRes.data.draft,
        schedule: scheduleRes.data,
      }
    },
  })

  return {
    mutation,
  }
}
