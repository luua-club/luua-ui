import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createLazyRoute,
  useBlocker,
  useNavigate,
  useSearch,
} from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { draftsApi } from '@/core/api/drafts.api'
import PopoverPrompt from '@/core/components/popover-prompt'
import LinkedInPostCard from '@/core/components/post-card/linkedin-post-card'
import TwitterPostCard from '@/core/components/post-card/twitter-post-card'
import {
  POST_WORD_COUNT,
  QUERY_KEYS,
  SOCIAL_PLATFORM,
} from '@/core/config/constant'
import {
  linkedinPrompts,
  standardPrompts,
  twitterPrompts,
  youtubePrompts,
} from '@/core/config/example-prompts.config'
import { queryClient } from '@/core/config/global.config'
import { useUserState } from '@/core/hooks/user-state.hook'
import { WithOptional } from '@/core/models/common.model'
import { DraftItem, IDraftRequest, PostItem } from '@/core/models/draft.model'
import { MediaObject } from '@/core/models/post.model'
import { channelType } from '@/core/models/social.model'
import ConfirmDialog from '@/shared/components/confirm-dialog'
import PromptChip from '@/shared/components/prompt-chip'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { WordRotate } from '@/shared/ui/word-rotate'
import { cn } from '@/shared/utils'

import DraftFooterActions from '../components/draft-footer-actions'
import { useGeneratePosts } from '../hooks/generate-post-ai'

type postDraftsType = Partial<Record<channelType, WithOptional<PostItem, 'id'>>>

const SOCIAL_TABS: channelType[] = [...SOCIAL_PLATFORM.map(s => s.name)]

function Create() {
  const user = useUserState()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<channelType>(SOCIAL_TABS[0])
  const [postDrafts, setPostDrafts] = useState<postDraftsType>(
    {} as postDraftsType
  )
  const bypassGuardRef = useRef(false)

  const search = useSearch({ from: '/creation/create' })
  const draftId = search.draftId
  const draftEnabled = Boolean(draftId)

  const hasAnyContent = useMemo(() => {
    const hasLinkedInContent =
      !!postDrafts.LinkedIn?.content?.trim() ||
      (postDrafts.LinkedIn?.attached_media?.length ?? 0) > 0

    const hasTwitterContent =
      !!postDrafts.Twitter?.content?.trim() ||
      (postDrafts.Twitter?.attached_media?.length ?? 0) > 0

    return hasLinkedInContent || hasTwitterContent
  }, [postDrafts])

  const isUnsavedDraftDirty = !draftId && hasAnyContent

  const withBypassedGuard = (fn: () => void) => {
    bypassGuardRef.current = true
    fn()
    setTimeout(() => {
      bypassGuardRef.current = false
    }, 0)
  }

  const blocker = useBlocker({
    withResolver: true,
    enableBeforeUnload: () => isUnsavedDraftDirty,
    shouldBlockFn: ({ current, next }) => {
      if (bypassGuardRef.current || !isUnsavedDraftDirty) return false

      const currentSearch = current.search as { draftId?: string }
      const nextSearch = next.search as { draftId?: string }
      const isCurrentUnsavedRoute =
        current.pathname === '/creation/create' && !currentSearch.draftId

      if (!isCurrentUnsavedRoute) {
        return false
      }

      const isSameUnsavedRoute =
        next.pathname === '/creation/create' && !nextSearch.draftId

      return !isSameUnsavedRoute
    },
  })

  const getCurrentState = () => {
    const hasLinkedInContent =
      postDrafts.LinkedIn?.content ||
      (postDrafts.LinkedIn?.attached_media?.length ?? 0) > 0
    const hasTwitterContent =
      postDrafts.Twitter?.content ||
      (postDrafts.Twitter?.attached_media?.length ?? 0) > 0

    if (!hasLinkedInContent && !hasTwitterContent) {
      return null
    }

    return {
      linkedin: postDrafts.LinkedIn?.content ?? null,
      twitter: postDrafts.Twitter?.content ?? null,
    }
  }

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

  const saveDraftMutation = useMutation({
    mutationFn: (payload: {
      request: IDraftRequest
      callback?: (id: string) => void
    }) => draftsApi.postDraft(payload.request),
    onSuccess: (response, variables) => {
      const newDraftId = response.data.draft.id

      const postDraft = {} as postDraftsType
      response.data.draft.posts.forEach((p: PostItem) => {
        postDraft[p.channel] = p
      })
      setPostDrafts(postDraft)

      queryClient.setQueryData(
        [QUERY_KEYS.draft, newDraftId],
        response.data.draft
      )
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.drafts] })

      if (variables?.callback && typeof variables.callback === 'function') {
        withBypassedGuard(() => variables.callback?.(newDraftId))
      } else {
        toast.success('Draft saved successfully')
        withBypassedGuard(() => {
          navigate({
            to: '/creation/create',
            search: { draftId: newDraftId },
            replace: true,
          })
        })
      }
    },
    onError: () => {
      toast.error('Failed to save draft')
    },
  })

  useEffect(() => {
    if (draftId) return
    setPostDrafts({} as postDraftsType)
  }, [draftId])

  useEffect(() => {
    if (!draftQuery.data) {
      return
    }

    const nextDrafts = {} as postDraftsType
    draftQuery.data.posts.forEach((p: PostItem) => {
      nextDrafts[p.channel] = p
    })

    setPostDrafts(nextDrafts)
  }, [draftQuery.data, draftId])

  useEffect(() => {
    if (!draftQuery.isError) return

    const err = draftQuery.error
    if (isAxiosError(err) && err.response?.status !== 404) {
      toast.error('Something went wrong')
    }

    setPostDrafts({} as postDraftsType)
    withBypassedGuard(() => {
      navigate({
        to: '/creation/create',
        replace: true,
      })
    })
  }, [draftQuery.isError, draftQuery.error, navigate])

  const handleContentChange = useCallback((val: string, name: channelType) => {
    setPostDrafts(prev => {
      return {
        ...prev,
        [name]: {
          ...(prev[name] ?? { channel: name }),
          content: val,
        },
      }
    })
  }, [])

  const handleImagesChange = useCallback(
    (images: MediaObject[], name: channelType) => {
      setPostDrafts(prev => {
        return {
          ...prev,
          [name]: {
            ...(prev[name] ?? { channel: name }),
            attached_media: images,
          },
        }
      })
    },
    []
  )

  const {
    posts: generatedPostContent,
    isGenerationDataFetching,
    setUserPrompt: setGenerationUserPrompt,
    setUserSearch: setGenerationUserSearch,
    setUserChannel: setGenerationUserChannel,
  } = useGeneratePosts('', undefined, undefined, getCurrentState())

  useEffect(() => {
    if (generatedPostContent.length === 0) {
      return
    }

    generatedPostContent.forEach(post => {
      handleContentChange(post.content, post.channel)
    })
  }, [generatedPostContent, handleContentChange])

  const getDraftRequestPayload = (): IDraftRequest => {
    const draftPayload: IDraftRequest = {
      posts: [],
    }

    if (draftId) {
      draftPayload.id = draftId
      if (draftQuery.data?.name) {
        draftPayload.name = draftQuery.data.name
      }
    }

    const linkedinObj = postDrafts.LinkedIn
    const twitterObj = postDrafts.Twitter

    const hasLinkedInContent =
      linkedinObj?.content || (linkedinObj?.attached_media?.length ?? 0) > 0
    const hasTwitterContent =
      twitterObj?.content || (twitterObj?.attached_media?.length ?? 0) > 0

    if (hasLinkedInContent) {
      draftPayload.posts.push({
        ...linkedinObj,
        channel: 'LinkedIn',
        content: linkedinObj?.content ?? '',
        attached_media: linkedinObj?.attached_media?.map(m => ({ url: m.url })),
      })
    }

    if (hasTwitterContent && user?.plan !== 'Free') {
      draftPayload.posts.push({
        ...twitterObj,
        channel: 'Twitter',
        content: twitterObj?.content ?? '',
        attached_media: twitterObj?.attached_media?.map(m => ({ url: m.url })),
      })
    }

    return draftPayload
  }

  useEffect(() => {
    const source = search.source
    if (!source) return

    setGenerationUserPrompt(source)
    setGenerationUserSearch(false)

    withBypassedGuard(() => {
      navigate({
        to: '/creation/create',
        search: draftId ? { draftId } : {},
        replace: true,
      })
    })
  }, [
    search.source,
    draftId,
    setGenerationUserPrompt,
    setGenerationUserSearch,
    navigate,
  ])

  const handleSaveDraft = (callback?: (id: string) => void) => {
    const postPayload = getDraftRequestPayload()
    if (postPayload.posts.length === 0) return

    saveDraftMutation.mutate({ request: postPayload, callback })
  }

  const handleReviewAndShare = () => {
    handleSaveDraft(id => {
      navigate({ to: '/review/$draftId', params: { draftId: id } })
    })
  }

  const handleScheduleClick = () => {
    handleSaveDraft(id => {
      navigate({
        to: '/review/$draftId',
        params: { draftId: id },
        search: { schedule: 'true' },
      })
    })
  }

  const handleSuggestionsClick = (value: string) => {
    setGenerationUserPrompt(value)
    setGenerationUserSearch(false)
    setGenerationUserChannel(activeTab)
  }

  const isCharacterLimitExceeded = () => {
    const linkedinContent = postDrafts.LinkedIn?.content || ''
    const twitterContent = postDrafts.Twitter?.content || ''

    const linkedinExceeded = linkedinContent.length > POST_WORD_COUNT.LinkedIn
    const twitterExceeded = twitterContent.length > POST_WORD_COUNT.Twitter

    const hasLinkedInContent =
      linkedinContent || (postDrafts.LinkedIn?.attached_media?.length ?? 0) > 0
    const hasTwitterContent =
      twitterContent || (postDrafts.Twitter?.attached_media?.length ?? 0) > 0

    if (hasLinkedInContent && linkedinExceeded) return true
    if (hasTwitterContent && twitterExceeded && user?.plan !== 'Free')
      return true

    return false
  }

  const isSuggestionsVisible = () => {
    if (
      (draftEnabled && draftQuery.isPending) ||
      isGenerationDataFetching ||
      saveDraftMutation.isPending ||
      !user
    ) {
      return false
    }

    if (activeTab === 'LinkedIn') {
      return !(
        postDrafts.LinkedIn?.content ||
        (postDrafts.LinkedIn?.attached_media?.length ?? 0) > 0
      )
    }

    if (activeTab === 'Twitter') {
      return !(
        postDrafts.Twitter?.content ||
        (postDrafts.Twitter?.attached_media?.length ?? 0) > 0
      )
    }

    return false
  }

  const handleBlockedSave = () => {
    if (blocker.status !== 'blocked') return

    handleSaveDraft(() => {
      withBypassedGuard(() => blocker.proceed?.())
    })
  }

  return (
    <>
      <div className="mx-auto mt-8 max-w-2xl px-4 pb-20">
        <Tabs
          className="relative"
          value={activeTab}
          onValueChange={value => setActiveTab(value as channelType)}
        >
          <div className="absolute top-1 right-0 flex items-center gap-2 md:top-2">
            <div
              className={cn('hidden', isGenerationDataFetching && 'md:block')}
            >
              <WordRotate
                words={[
                  'Cooking something up...',
                  'Just a sec...',
                  'Sprinkling some AI magic...',
                  'Still Brewing the answer...',
                ]}
                duration={3000}
                className="text-sm select-none"
              />
            </div>

            <PopoverPrompt
              disabled={saveDraftMutation.isPending}
              loading={isGenerationDataFetching}
              isUserAgainGenerating={!getCurrentState()}
              onSubmit={(value, isSearchEnabled) => {
                setGenerationUserPrompt(value)
                setGenerationUserSearch(isSearchEnabled)
                setGenerationUserChannel(activeTab)
              }}
            />
          </div>

          <TabsList className="w-fit px-1 py-5">
            {SOCIAL_TABS.map(tab => {
              const Logo = SOCIAL_PLATFORM.find(s => s.name === tab)?.logo
              return (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="px-2 py-3.5 text-xs"
                >
                  {Logo && <Logo />} {tab}
                </TabsTrigger>
              )
            })}
          </TabsList>

          <TabsContent
            value="LinkedIn"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <LinkedInPostCard
              key={`linkedin-${draftId || 'untitled'}`}
              loading={
                (draftEnabled && draftQuery.isPending) ||
                isGenerationDataFetching
              }
              isActionLoading={saveDraftMutation.isPending}
              initialContent={postDrafts?.LinkedIn?.content}
              initialImages={postDrafts?.LinkedIn?.attached_media}
              onContentChange={val => handleContentChange(val, 'LinkedIn')}
              onImagesChange={images => handleImagesChange(images, 'LinkedIn')}
            />
          </TabsContent>
          <TabsContent
            value="Twitter"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <TwitterPostCard
              key={`twitter-${draftId || 'untitled'}`}
              loading={
                (draftEnabled && draftQuery.isPending) ||
                isGenerationDataFetching
              }
              isActionLoading={saveDraftMutation.isPending}
              initialContent={postDrafts?.Twitter?.content}
              initialImages={postDrafts?.Twitter?.attached_media}
              onContentChange={val => handleContentChange(val, 'Twitter')}
              onImagesChange={images => handleImagesChange(images, 'Twitter')}
            />
          </TabsContent>
        </Tabs>

        <AnimatePresence>
          {isSuggestionsVisible() && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="flex flex-col gap-4 pt-6"
            >
              <p className="text-sm font-medium">
                Out of ideas? Steal one of ours 😎
              </p>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <PromptChip
                  data={standardPrompts}
                  onChipClick={handleSuggestionsClick}
                />
                <PromptChip
                  data={youtubePrompts}
                  onChipClick={handleSuggestionsClick}
                />
                <PromptChip
                  data={linkedinPrompts}
                  onChipClick={handleSuggestionsClick}
                />
                <PromptChip
                  data={twitterPrompts}
                  onChipClick={handleSuggestionsClick}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DraftFooterActions
        loading={isGenerationDataFetching || !getCurrentState()}
        onSaveDraft={() => handleSaveDraft()}
        disabled={saveDraftMutation.isPending || isCharacterLimitExceeded()}
        onReviewAndShare={handleReviewAndShare}
        onScheduleClick={handleScheduleClick}
      />

      <ConfirmDialog
        open={blocker.status === 'blocked'}
        onOpenChange={open => {
          if (!open && blocker.status === 'blocked') {
            blocker.reset?.()
          }
        }}
        title="Save draft before leaving"
        description="You have unsaved content. Save this draft to continue."
        confirmLabel="Save Draft"
        cancelLabel="Stay"
        confirmDisabled={saveDraftMutation.isPending}
        onConfirm={handleBlockedSave}
      />
    </>
  )
}

export const Route = createLazyRoute('/creation/create')({
  component: Create,
})

export default Create
