import { useMutation } from '@tanstack/react-query'

import { draftsApi } from '../api/drafts.api'
import { postsApi } from '../api/posts.api'
import { postHogPublishCapture } from '../config/posthog.config'
import { type DraftItem, type IDraftRequest } from '../models/draft.model'
import { channelType } from '../models/social.model'

/**
 * usePublishDraft
 *
 * Performs a sequential flow using React Query mutation:
 * 1) Create/Update a draft via draftsApi.postDraft
 * 2) Publish the created draft via postsApi.publishDraft
 */
export function usePublishDraft() {
  type Params = {
    draftRequest: IDraftRequest
    forChannel: channelType[]
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

      // Step 2: Publish draft
      const publishRes = await postsApi.publishDraft({
        draft_id: draftId,
        post_ids: postIds,
        version: currentVersion,
      })

      // POSTHOG
      postHogPublishCapture(draftId, postIds, draftData)
      // END POSTHOG

      return {
        draftId,
        draft: draftData,
        publish: publishRes.data,
      }
    },
  })

  return {
    mutation,
  }
}
