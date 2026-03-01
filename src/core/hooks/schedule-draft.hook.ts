import { useMutation } from '@tanstack/react-query'

import { draftsApi } from '../api/drafts.api'
import { postsApi } from '../api/posts.api'
import { postHogScheduleCapture } from '../config/posthog.config'
import { type DraftItem, type IDraftRequest } from '../models/draft.model'
import { channelType } from '../models/social.model'

/**
 * useScheduleDraft
 *
 * Performs a sequential flow using React Query mutation:
 * 1) Create a draft via draftsApi.postDraft
 * 2) Schedule the created draft via postsApi.scheduleDraft
 */
export function useScheduleDraft() {
  type Params = {
    draftRequest: IDraftRequest
    forChannel: channelType[]
    /** ISO string date to apply to all created posts */
    scheduleDate: string
    version: number
  }

  const mutation = useMutation({
    mutationFn: async (params: Params) => {
      let draftId: string
      let postIds: string[]
      let draftData: DraftItem | IDraftRequest
      let currentVersion = params.version

      if (params.draftRequest.id) {
        draftId = params.draftRequest.id
        draftData = params.draftRequest

        // Filter postIds based on forChannel
        const forChannelSet = new Set(params.forChannel)
        postIds = params.draftRequest.posts
          .filter(post => forChannelSet.has(post.channel) && post.id)
          .map(post => post.id!)
      } else {
        const draftPayload: IDraftRequest = {
          posts: params.draftRequest.posts,
        }

        // Step 1: Create/Update draft
        const draftRes = await draftsApi.postDraft(draftPayload)

        draftId = draftRes.data.draft.id
        draftData = draftRes.data.draft
        currentVersion = draftRes.data.draft.version

        // Filter postIds based on forChannel
        const forChannelSet = new Set(params.forChannel)
        postIds = draftRes.data.draft.posts
          .filter(post => forChannelSet.has(post.channel))
          .map(post => post.id)
      }

      // Step 2: Schedule draft
      const schedules = Object.fromEntries(
        postIds.map(id => [id, params.scheduleDate])
      ) as { [key: string]: string }

      const scheduleRes = await postsApi.scheduleDraft({
        draft_id: draftId,
        version: currentVersion,
        schedules,
      })

      // POSTHOG
      postHogScheduleCapture(draftId, postIds, draftData)
      // END POSTHOG

      return {
        draftId,
        draft: draftData,
        schedule: scheduleRes.data,
      }
    },
  })

  return {
    mutation,
  }
}
