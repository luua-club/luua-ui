import { useMutation } from '@tanstack/react-query'

import { draftsApi } from '../api/drafts.api'
import { postsApi } from '../api/posts.api'
import { type IDraftRequest } from '../models/draft.model'

/**
 * usePublishDraft
 *
 * Performs a sequential flow using React Query mutation:
 * 1) Create/Update a draft via draftsApi.postDraft
 * 2) Publish the created draft via postsApi.publishDraft
 *
 * Usage:
 * const publishDraft = usePublishDraft()
 * publishDraft.mutate({ posts: [...], id: 'draftId' })
 */
export function usePublishDraft() {
  const mutation = useMutation({
    mutationFn: async (params: IDraftRequest) => {
      const draftPayload: IDraftRequest = {
        posts: params.posts,
      }

      if (params.id) {
        draftPayload.id = params.id
      }

      // Step 1: Create/Update draft
      const draftRes = await draftsApi.postDraft(draftPayload)

      const draftId = draftRes.data.draft.id
      const postIds = draftRes.data.draft.posts.map(post => post.id)

      // Step 2: Publish draft
      const publishRes = await postsApi.publishDraft({
        draft_id: draftId,
        post_ids: postIds,
      })

      return {
        draftId,
        draft: draftRes.data.draft,
        publish: publishRes.data,
      }
    },
  })

  return {
    mutation,
  }
}
