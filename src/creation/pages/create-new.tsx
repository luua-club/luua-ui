import { useMutation, useQuery } from '@tanstack/react-query'
import { createLazyRoute, useNavigate } from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { draftsApi } from '@/core/api/drafts.api'
import PopoverPrompt from '@/core/components/popover-prompt'
import LinkedInPostCard from '@/core/components/post-card/linkedin-post-card'
import TwitterPostCard from '@/core/components/post-card/twitter-post-card'
import { QUERY_KEYS, SOCIAL_PLATFORM } from '@/core/config/constant'
import { queryClient } from '@/core/config/global.config'
import { WithOptional } from '@/core/models/common.model'
import { DraftItem, IDraftRequest, PostItem } from '@/core/models/draft.model'
import { channelType } from '@/core/models/social.model'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { WordRotate } from '@/shared/ui/word-rotate'
import { cn } from '@/shared/utils'

import DraftFooterActions from '../components/draft-footer-actions'
import { PostDraftsType } from '../hooks/create-draft.hook'
import { useGeneratePosts } from '../hooks/generate-post-ai'

type postDraftsType = Partial<Record<channelType, WithOptional<PostItem, 'id'>>>

const SOCIAL_TABS: channelType[] = [...SOCIAL_PLATFORM.map(s => s.name)]

function Create() {
  const [activeTab, setActiveTab] = useState<channelType>(SOCIAL_TABS[0])
  const [postDrafts, setPostDrafts] = useState<postDraftsType>(
    {} as postDraftsType
  )

  const getCurrentState = () => {
    if (!postDrafts.LinkedIn?.content && !postDrafts.Twitter?.content) {
      return null
    }

    return {
      linkedin: postDrafts.LinkedIn?.content ?? null,
      twitter: postDrafts.Twitter?.content ?? null,
    }
  }

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

  const draftId = new URLSearchParams(location.search).get('draftId')
  const draftEnabled = Boolean(draftId)

  const navigate = useNavigate()
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
      // Rehydrate local state with response data
      const postDraft = {} as PostDraftsType
      response.data.draft.posts.forEach((p: PostItem) => {
        postDraft[p.channel] = p
      })
      setPostDrafts(postDraft)

      // Update query cache with the new draft data
      queryClient.setQueryData(
        [QUERY_KEYS.draft, response.data.draft.id],
        response.data.draft
      )

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.drafts] })

      if (variables && variables.callback) {
        variables.callback(response.data.draft.id)
        return
      }

      toast.success('Draft saved successfully')
      navigate({
        to: '/creation/create',
        search: { draftId: response.data.draft.id },
      })
    },
    onError: () => {
      toast.error('Failed to save draft')
    },
  })

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

  useEffect(() => {
    if (draftQuery.isError) {
      const err = draftQuery.error

      if (isAxiosError(err) && err.response?.status !== 404) {
        toast.error('Something went wrong')
      }

      navigate({ to: '/creation/create' })
    }
  }, [draftQuery.isError, draftQuery.error, navigate])

  const {
    // State
    posts: generatedPostContent,

    // Loading
    isGenerationDataFetching,

    // Setters
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
   * Handle `source` query param to trigger generation and then remove it
   */
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const source = params.get('source')
    if (!source) return

    setGenerationUserPrompt(source)
    setGenerationUserSearch(false)

    params.delete('source')
    const newSearch = params.toString()
    if (newSearch) {
      window.history.replaceState(null, '', `${location.pathname}?${newSearch}`)
    } else {
      window.history.replaceState(null, '', location.pathname)
    }
  }, [setGenerationUserPrompt, setGenerationUserSearch])

  const handleSaveDraft = (callback?: (id: string) => void) => {
    const postPayload = getDraftRequestPayload()
    if (postPayload.posts.length === 0) return

    // Call api
    saveDraftMutation.mutate({ request: postPayload, callback })
  }

  const handleReviewAndShare = () => {
    handleSaveDraft(id => {
      navigate({ to: `/review/${id}` })
    })
  }

  const handleScheduleClick = () => {
    handleSaveDraft(id => {
      navigate({ to: `/review/${id}?schedule="true"` })
    })
  }

  return (
    <>
      <div className="mx-auto mt-4 max-w-2xl px-4 pb-20">
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

          {SOCIAL_TABS.map(tab => {
            return (
              <TabsContent key={tab} value={tab} className="mt-2">
                {tab === 'LinkedIn' ? (
                  <LinkedInPostCard
                    loading={
                      (draftEnabled && draftQuery.isPending) ||
                      isGenerationDataFetching
                    }
                    isActionLoading={saveDraftMutation.isPending}
                    initialContent={postDrafts?.LinkedIn?.content}
                    onContentChange={val =>
                      handleContentChange(val, 'LinkedIn')
                    }
                  />
                ) : (
                  <TwitterPostCard
                    loading={
                      (draftEnabled && draftQuery.isPending) ||
                      isGenerationDataFetching
                    }
                    isActionLoading={saveDraftMutation.isPending}
                    initialContent={postDrafts?.Twitter?.content}
                    onContentChange={val => handleContentChange(val, 'Twitter')}
                  />
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
      <DraftFooterActions
        loading={isGenerationDataFetching || !getCurrentState()}
        onSaveDraft={handleSaveDraft}
        disabled={saveDraftMutation.isPending}
        onReviewAndShare={handleReviewAndShare}
        onScheduleClick={handleScheduleClick}
      />
    </>
  )
}
export const Route = createLazyRoute('/creation/create')({
  component: Create,
})

export default Create
