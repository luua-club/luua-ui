import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useBlocker, useLocation, useNavigate } from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import confetti from 'canvas-confetti'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { draftsApi } from '@/core/api/drafts.api'
import {
  ShareModalOpenState,
  SharePostType,
} from '@/core/components/SharePostModal'
import { QUERY_KEYS } from '@/core/config/constant'
import { usePublishDraft } from '@/core/hooks/publish-draft.hook'
import { useScheduleDraft } from '@/core/hooks/schedule-draft.hook'
import { WithOptional } from '@/core/models/common.model'
import {
  type DraftItem,
  IDraftRequest,
  PostItem,
} from '@/core/models/draft.model'
import { channelType } from '@/core/models/social.model'

export type PostDraftsType = Partial<
  Record<channelType, WithOptional<PostItem, 'id'>>
>

export const useCreateDraft = () => {
  // ----- State -----
  const [postDrafts, setPostDrafts] = useState<PostDraftsType>(
    {} as PostDraftsType
  )
  const [isShareModalOpen, setIsShareModalOpen] = useState<ShareModalOpenState>(
    {
      open: false,
      schedule: false,
    }
  )
  // Navigation guard state
  const [allowLeave, setAllowLeave] = useState(false)
  const [blockerEnabled, setBlockerEnabled] = useState(false)

  // ----- Hooks -----
  const location = useLocation()
  const { mutation: publishDraft } = usePublishDraft()
  const { mutation: scheduleDraft } = useScheduleDraft()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // ----- Variables -----
  const draftId = new URLSearchParams(location.search).get('draftId')
  const draftEnabled = Boolean(draftId)
  // ---- Internal navigation blocker (custom modal is handled in page via resolver) ----
  const navBlocker = useBlocker({
    shouldBlockFn: () => !allowLeave,
    withResolver: true,
    enableBeforeUnload: false,
    disabled: !blockerEnabled,
  })

  // Enable blocker when there is any unsaved content in editor
  useEffect(() => {
    const hasContent =
      Boolean(postDrafts.LinkedIn?.content) ||
      Boolean(postDrafts.Twitter?.content)
    setBlockerEnabled(hasContent)
  }, [postDrafts.LinkedIn?.content, postDrafts.Twitter?.content])

  // ----- API calls with Effects -----
  /**
   * GET draft by Id on load
   */
  const draftQuery = useQuery<DraftItem>({
    queryKey: [QUERY_KEYS.draft, draftId],
    queryFn: async () => {
      const res = await draftsApi.getDraft(draftId as string)
      return res.data
    },
    enabled: draftEnabled,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  })

  /**
   * Runs when draft API return results
   */
  useEffect(() => {
    if (!draftQuery.data) {
      return
    }

    const postDraft = {} as PostDraftsType

    draftQuery.data.posts.forEach((p: PostItem) => {
      postDraft[p.channel] = p
    })

    setPostDrafts(postDraft)
  }, [draftQuery.data])

  /**
   * Handle query parameter to open share modal
   */
  const handleQueryParameter = useCallback(
    (paramName: string, modalState: ShareModalOpenState) => {
      const paramValue = new URLSearchParams(location.search).get(paramName)
      if (paramValue === 'true' && draftQuery.data) {
        setIsShareModalOpen(modalState)
        // Remove parameter from URL while keeping others
        const newSearch = new URLSearchParams(location.search)
        newSearch.delete(paramName)
        if (newSearch.toString()) {
          // If there are remaining parameters, preserve them
          window.history.replaceState(
            null,
            '',
            `${location.pathname}?${newSearch.toString()}`
          )
        } else {
          // If no parameters left, remove query string entirely
          window.history.replaceState(null, '', location.pathname)
        }
      }
    },
    [location.search, location.pathname, draftQuery.data]
  )

  /**
   * Handle query parameters to open share modal
   */
  useEffect(() => {
    // Handle publish parameter
    handleQueryParameter('publish', { open: true, schedule: false })
    // Handle schedule parameter
    handleQueryParameter('schedule', { open: true, schedule: true })
  }, [handleQueryParameter])

  /**
   * Redirect to creation page if fetching the draft fails
   */
  useEffect(() => {
    if (draftQuery.isError) {
      const err = draftQuery.error

      if (isAxiosError(err) && err.response?.status !== 404) {
        toast.error('Something went wrong')
      }

      // Bypass blocker for programmatic redirect
      setAllowLeave(true)
      navigate({ to: '/creation/create' })
    }
  }, [draftQuery.isError, draftQuery.error, navigate])

  /**
   * POST draft
   */
  const saveDraftMutation = useMutation({
    mutationFn: (payload: IDraftRequest) => draftsApi.postDraft(payload),
    onSuccess: response => {
      toast.success('Draft saved successfully')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.drafts] })
      // Ensure navigation is not blocked after save
      setAllowLeave(true)
      navigate({
        to: '/creation/create',
        search: { draftId: response.data.draft.id },
      })
    },
    onError: () => {
      toast.error('Failed to save draft')
    },
  })

  /**
   * DELETE post from draft
   */
  const deletePostMutation = useMutation({
    mutationFn: ({ draftId, postId }: { draftId: string; postId: string }) =>
      draftsApi.deletePost(draftId, postId),
    onSuccess: () => {
      toast.success('Post deleted successfully')
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.drafts],
      })
      draftQuery.refetch()
    },
    onError: () => {
      toast.error('Failed to delete post')
    },
  })

  // ----- Helper Functions -----
  /**
   * Call when a post in a draft is updated
   *
   * @param val - The new content value
   * @param name - The channel name ('LinkedIn' or 'Twitter')
   */
  const handleContentChange = useCallback(
    (val: string, name: channelType) => {
      setPostDrafts(prev => ({
        ...prev,
        [name]: {
          ...(prev[name] ?? { channel: name }),
          content: val,
        },
      }))
    },
    [setPostDrafts]
  )

  /**
   * Returns the draft request payload
   *
   * @returns {IDraftRequest} request payload
   */
  const getDraftRequestPayload = (): IDraftRequest => {
    const draftPayload: IDraftRequest = {
      posts: [],
    }

    if (draftId) {
      draftPayload.id = draftId
    }

    const linkedinObj = postDrafts['LinkedIn']
    const twitterObj = postDrafts['Twitter']

    if (linkedinObj?.content) {
      draftPayload.posts.push({
        ...linkedinObj,
        channel: 'LinkedIn',
      })
    }

    if (twitterObj?.content) {
      draftPayload.posts.push({
        ...twitterObj,
        channel: 'Twitter',
      })
    }

    return draftPayload
  }

  /**
   * Save drafts
   */
  const handleSaveDraft = () => {
    const postPayload = getDraftRequestPayload()
    if (postPayload.posts.length === 0) return

    // Call api
    saveDraftMutation.mutate(postPayload)
  }

  /**
   * Publish drafts
   */
  const handleSubmitDraft = (
    postIds: string[],
    schedule: boolean,
    scheduleDate?: string
  ) => {
    const postPayload = getDraftRequestPayload()
    if (postPayload.posts.length === 0) return

    const filteredPosts = postPayload.posts.filter(p => {
      if (p.id) {
        return postIds.includes(p.id)
      }

      return postIds.includes(p.channel)
    })

    const finalPayload = {
      ...postPayload,
      posts: filteredPosts,
    }

    if (schedule && scheduleDate) {
      scheduleDraft.mutate(
        {
          draftRequest: finalPayload,
          scheduleDate,
        },
        {
          onSuccess: () => {
            setIsShareModalOpen({ open: false, schedule: false })
            toast.success('Draft scheduled successfully')
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.drafts] })
            // Bypass blocker for programmatic navigation
            setAllowLeave(true)
            navigate({ to: '/schedule' })
          },
          onError: () => {
            setIsShareModalOpen({ open: false, schedule: false })
            toast.error('Failed to schedule draft')
          },
        }
      )
      return
    }

    // Call api
    publishDraft.mutate(finalPayload, {
      onSuccess: () => {
        setIsShareModalOpen({ open: false, schedule: false })
        toast.success('Post are published successfully')
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.drafts] })

        const handleClick = () => {
          const end = Date.now() + 500 // 500 ms
          const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1']

          const frame = () => {
            if (Date.now() > end) return

            confetti({
              particleCount: 2,
              angle: 60,
              spread: 55,
              startVelocity: 60,
              origin: { x: 0, y: 0.5 },
              colors: colors,
            })
            confetti({
              particleCount: 2,
              angle: 120,
              spread: 55,
              startVelocity: 60,
              origin: { x: 1, y: 0.5 },
              colors: colors,
            })

            requestAnimationFrame(frame)
          }

          frame()
        }

        handleClick()
        // Bypass blocker for programmatic navigation
        setAllowLeave(true)
        navigate({ to: '/dashboard' })
      },
      onError: () => {
        toast.error('Failed to publish posts')
      },
    })
  }

  /**
   * Check if action is disabled
   *
   * @returns {boolean} true if action is disabled
   */
  const isDraftActionsDisabled = () => {
    if (
      saveDraftMutation.isPending ||
      (draftEnabled && draftQuery.isPending) ||
      publishDraft.isPending ||
      scheduleDraft.isPending ||
      deletePostMutation.isPending
    ) {
      return true
    }

    if (!postDrafts['LinkedIn']?.content && !postDrafts['Twitter']?.content) {
      return true
    }

    return false
  }

  /**
   * Delete post from draft
   *
   * @param postId - Post id
   */
  const handleDeletePost = (postId?: string) => {
    if (!postId || !draftId) return

    deletePostMutation.mutate({ draftId, postId })
  }

  const getSharePosts = () => {
    const posts: SharePostType = []

    if (postDrafts['LinkedIn']) {
      posts.push({
        id: postDrafts['LinkedIn']?.id || postDrafts['LinkedIn'].channel,
        content: postDrafts['LinkedIn'].content,
        channel: postDrafts['LinkedIn'].channel,
      })
    }

    if (postDrafts['Twitter']) {
      posts.push({
        id: postDrafts['Twitter']?.id || postDrafts['Twitter'].channel,
        content: postDrafts['Twitter'].content,
        channel: postDrafts['Twitter'].channel,
      })
    }

    return posts
  }

  return {
    // ----- State -----
    postDrafts,
    setPostDrafts,
    isShareModalOpen,
    setIsShareModalOpen,

    // ----- Variables -----
    draftEnabled,
    draftId,

    // ----- Query/Mutation -----
    draftQuery,
    saveDraftMutation,
    deletePostMutation,
    publishDraft,
    scheduleDraft,

    // ----- Handlers -----
    handleContentChange,
    handleSaveDraft,
    handleSubmitDraft,
    handleDeletePost,
    isDraftActionsDisabled,

    // ----- Utilities -----
    getSharePosts,

    // ----- Navigation guard controls -----
    setAllowLeave,
    navBlocker,
  }
}
