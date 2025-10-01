import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useBlocker, useNavigate } from '@tanstack/react-router'
import confetti from 'canvas-confetti'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { draftsApi } from '@/core/api/drafts.api'
import { ShareModalOpenState } from '@/core/components/SharePostModal'
import { QUERY_KEYS } from '@/core/config/constant'
import { useGeneratePosts } from '@/core/hooks/generate-post.hook'
import { useAppSelector } from '@/core/hooks/global-state.hook'
import { usePublishDraft } from '@/core/hooks/publish-draft.hook'
import { useScheduleDraft } from '@/core/hooks/schedule-draft.hook'
import { useUserState } from '@/core/hooks/user-state.hook'
import { IDraftRequest } from '@/core/models/draft.model'
import { extractedLinksType } from '@/core/models/generate-post.model'
import { IPost } from '@/core/models/post.model'

export interface HistoryEntry {
  id: string
  prompt: string
  createdAt: string
  posts: Pick<IPost, 'id' | 'channel' | 'content'>[]
  extractedLinks: extractedLinksType[]
}

export const useQuickShare = () => {
  // ---- State ----
  const [activeTab, setActiveTab] = useState<string>('created-post')
  const [isShareModalOpen, setIsShareModalOpen] = useState<ShareModalOpenState>(
    {
      open: false,
      schedule: false,
    }
  )
  // Navigation guard state
  const [allowLeave, setAllowLeave] = useState(false)
  const [blockerEnabled, setBlockerEnabled] = useState(false)
  // History State
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const lastPushedSignature = useRef<string | null>(null)
  const [overriddenPosts, setOverriddenPosts] = useState<
    Pick<IPost, 'id' | 'channel' | 'content'>[] | null
  >(null)
  const [rolledBackPrompt, setRolledBackPrompt] = useState<string | null>(null)
  const [overriddenExtractedLinks, setOverriddenExtractedLinks] = useState<
    extractedLinksType[] | null
  >(null)

  // ---- Hooks ----
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useUserState()

  // ---- Internal navigation blocker (custom modal is handled in component via resolver) ----
  const navBlocker = useBlocker({
    shouldBlockFn: () => !allowLeave,
    withResolver: true,
    enableBeforeUnload: false,
    disabled: !blockerEnabled,
  })

  // ---- Mutations ----
  const { mutation: publishDraft } = usePublishDraft()
  const { mutation: scheduleDraft } = useScheduleDraft()
  const saveDraftMutation = useMutation({
    mutationFn: (payload: IDraftRequest) => draftsApi.postDraft(payload),
    onSuccess: response => {
      toast.success('Draft saved successfully')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.drafts] })
      navigate({
        to: '/creation/create',
        search: { draftId: response.data.draft.id },
      })
    },
    onError: () => {
      toast.error('Failed to save draft')
    },
  })

  // ---- Selectors & Custom Hooks ----
  const preUserPromptState = useAppSelector(state => state.promptState)
  const {
    // Query state
    error,
    isLoading,
    isFetching,
    refetch,

    // Data
    posts,
    extractedLinks,

    // Current state
    activePrompt,
    key,
    userChannel,

    // Setters
    setUserPrompt,
    setUserSearch,
    setUserChannel,
  } = useGeneratePosts(
    preUserPromptState.prompt ?? '',
    preUserPromptState.search,
    preUserPromptState.channel
  )

  // ---- Effects ----
  /**
   * Navigates to dashboard if prompt is empty in redux state
   */
  useEffect(() => {
    if (!preUserPromptState.prompt) {
      // Bypass blocker for programmatic redirect
      setAllowLeave(true)
      navigate({ to: '/dashboard' })
      // Reset shortly after to re-enable guard for subsequent actions
      setTimeout(() => setAllowLeave(false), 200)
    } else {
      // Enable blocker only if we're staying on this page
      setBlockerEnabled(true)
    }
  }, [preUserPromptState.prompt, navigate])

  /**
   * Cancel queries when component unmounts
   */
  useEffect(() => {
    return () => {
      queryClient.cancelQueries({ queryKey: [key] })
    }
  }, [queryClient, key])

  /**
   * Show error toast if error is present by useGeneratePosts
   */
  useEffect(() => {
    if (error) {
      toast.error('Something went wrong while generating posts')
    }
  }, [error])

  /**
   * Push a new history entry whenever a new set of posts is generated
   * (initial prompt or follow-ups). Avoid duplicates using a signature.
   */
  useEffect(() => {
    const hasPosts = posts && posts.length > 0
    if (!hasPosts || !activePrompt) return

    // Build a signature unique to the generation result
    const signature = JSON.stringify({
      prompt: activePrompt,
      posts: posts.map(p => ({ channel: p.channel, content: p.content })),
    })

    if (lastPushedSignature.current === signature) return

    const entry: HistoryEntry = {
      id: `${Date.now()}-${history.length}`,
      prompt: activePrompt,
      createdAt: new Date().toISOString(),
      posts: [...posts],
      extractedLinks: [...(extractedLinks ?? [])],
    }

    setHistory(prev => [entry, ...prev])
    lastPushedSignature.current = signature
  }, [posts, activePrompt, history.length])

  // ---- Functions ----
  /**
   * Handles the submission of selected posts
   *
   * @param postIds - Array of post IDs to be submitted
   * @param schedule - Boolean indicating if the posts should be scheduled
   * @param scheduleDate - Optional date for scheduling the posts
   */
  const onSubmit = (
    postIds: string[],
    schedule: boolean,
    scheduleDate?: string
  ) => {
    // Filter selected posts
    const selectedPosts = posts.filter(post => postIds.includes(post.id))

    // Close modal if no posts are selected
    if (selectedPosts.length === 0) {
      setIsShareModalOpen({ open: false, schedule: false })
      return
    }

    // Prepare payload for draft
    const payload = selectedPosts.map(p => ({
      content: p.content,
      channel: p.channel,
      attached_media: [],
    }))

    // Schedule draft if schedule is true and scheduleDate is provided
    if (schedule && scheduleDate) {
      scheduleDraft.mutate(
        {
          draftRequest: {
            posts: payload,
          },
          scheduleDate,
        },
        {
          onSuccess: () => {
            setIsShareModalOpen({ open: false, schedule: false })
            toast.success('Draft scheduled successfully')
            navigate({ to: '/schedule' })
          },
          onError: () => {
            toast.error('Failed to schedule draft')
          },
        }
      )
      return
    }

    // Publish draft
    publishDraft.mutate(
      {
        posts: payload,
      },
      {
        onSuccess: () => {
          setIsShareModalOpen({ open: false, schedule: false })
          toast.success('Post are published successfully')
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
          navigate({ to: '/dashboard' })
        },
        onError: () => {
          toast.error('Failed to publish draft')
        },
      }
    )
  }

  /**
   * Handles the edit action for selected posts
   */
  const handleEdit = () => {
    if (!user) {
      return
    }

    // Prepare payload for draft
    const payload = posts
      .filter(
        p =>
          user.connected_channels[
            p.channel.toLowerCase() as keyof typeof user.connected_channels
          ].connected
      )
      .map(p => ({
        content: p.content,
        channel: p.channel,
        attached_media: [],
      }))

    // Save draft
    saveDraftMutation.mutate({
      posts: payload,
    })
  }

  /**
   * Rollback to a specific history entry (by index in the history array).
   */
  const rollbackTo = (index: number) => {
    const entry = history[index]
    if (!entry) return
    // Enter rollback mode: show historical posts, buffer prompt but do not trigger fetch yet
    setOverriddenPosts(entry.posts)
    setOverriddenExtractedLinks(entry.extractedLinks)
    setRolledBackPrompt(entry.prompt)
    toast.info('Rolled back', { position: 'top-right', duration: 800 })
  }

  /**
   * Retry generation. If we are in rollback mode with a buffered prompt,
   * apply that prompt (which triggers fetch via queryKey change) and exit rollback.
   * Otherwise, just refetch with the current active prompt.
   */
  const handleRetry = () => {
    if (rolledBackPrompt) {
      setUserPrompt(rolledBackPrompt)
      setRolledBackPrompt(null)
      setOverriddenPosts(null)
      setOverriddenExtractedLinks(null)
      return
    }
    refetch()
  }

  // ---- Variables ----
  const isGeneratedDataFetching = isLoading || isFetching
  const isLoadingPublish = publishDraft.isPending || scheduleDraft.isPending
  const loading =
    isGeneratedDataFetching ||
    saveDraftMutation.isPending ||
    publishDraft.isPending

  const activeChannels = userChannel

  return {
    // state
    activeTab,
    setActiveTab,
    isShareModalOpen,
    setIsShareModalOpen,
    history,
    rollbackTo,
    clearRollback: () => {
      setOverriddenPosts(null)
      setOverriddenExtractedLinks(null)
      setRolledBackPrompt(null)
    },
    isRolledBack: overriddenPosts !== null,

    // data
    posts: overriddenPosts ?? posts,
    extractedLinks: overriddenExtractedLinks ?? extractedLinks,
    error,
    isGeneratedDataFetching,
    isLoadingPublish,
    loading,
    activeChannels,
    user,

    // actions
    refetch,
    handleRetry,
    onSubmit,
    handleEdit,

    // navigation guard controls
    setAllowLeave,
    navBlocker,

    // setters bridging FloatingPromptInput
    setUserPrompt,
    setUserSearch,
    setUserChannel,
  }
}
