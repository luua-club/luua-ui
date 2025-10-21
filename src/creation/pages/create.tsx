import { useQueryClient } from '@tanstack/react-query'
import {
  createLazyRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { HistoryIcon, Loader, PenLine } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { FloatingPromptInput } from '@/core/components/PromptInput'
import { SharePostModal } from '@/core/components/SharePostModal'
import { EDIT_PROMPT_TEXT, QUERY_KEYS, SUGGESTED_PROMPT_TEXT } from '@/core/config/constant'
import { useGeneratePosts } from '@/core/hooks/generate-post.hook'
import { useAppDispatch, useAppSelector } from '@/core/hooks/global-state.hook'
import { useUserState } from '@/core/hooks/user-state.hook'
import { IPost } from '@/core/models/post.model'
import { channelType } from '@/core/models/social.model'
import { clearPrompt } from '@/core/store/prompt-slice'
import { isSocialConnected } from '@/core/utils/social.utils'
import { ConfirmDialog } from '@/shared/components/confirm-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { WordRotate } from '@/shared/ui/word-rotate'
import { cn } from '@/shared/utils'

import CreatedPosts from '../components/CreatedPosts'
import DraftActions from '../components/DraftActions'
import PastResponse from '../components/PastResponse'
import { useCreateDraft } from '../hooks/create-draft.hook'

enum TabValue {
  CREATED_POST = 'created-post',
  PAST_RESPONSES = 'past-responses',
}
const SOCIAL_TABS: channelType[] = ['LinkedIn', 'Twitter']

function Create() {
  // ---- States ----
  const [activeTab, setActiveTab] = useState<TabValue>(TabValue.CREATED_POST)
  const [activeSocialTab, setActiveSocialTab] = useState<channelType>(
    SOCIAL_TABS[0]
  )

  // ---- Hooks Helper Functions ----
  /**
   * Returns the current state
   *
   * @returns The current state
   */
  const getCurrentState = () => {
    if (!postDrafts.LinkedIn?.content && !postDrafts.Twitter?.content) {
      return null
    }

    return {
      linkedin: postDrafts.LinkedIn?.content ?? null,
      twitter: postDrafts.Twitter?.content ?? null,
    }
  }

  // --- Ref ---
  const latestGeneratedPostsRef = useRef<
    Pick<IPost, 'id' | 'channel' | 'content'>[]
  >([])

  // ---- Hooks & Selectors ----
  const dispatch = useAppDispatch()
  const location = useLocation()
  const queryClient = useQueryClient()
  const preUserPromptState = useAppSelector(state => state.promptState)
  const user = useUserState()
  const navigate = useNavigate()
  const {
    // State
    postDrafts,
    isShareModalOpen,
    setIsShareModalOpen,
    navBlocker,

    // Variables
    draftEnabled,

    // Refs
    allowLeaveRef,

    // Query/Mutation
    draftQuery,
    saveDraftMutation,

    // Handlers
    handleContentChange,
    handleSaveDraft,
    handleSubmitDraft,
    isDraftActionsDisabled,

    // Utilities
    getSharePosts,
  } = useCreateDraft({ latestGeneratedPosts: latestGeneratedPostsRef.current })

  const {
    // State
    posts: generatedPostContent,
    extractedLinks,
    history,

    // Loading
    isLoading: isGenerationLoading,
    isFetching: isGenerationFetching,

    // Setters
    setUserPrompt: setGenerationUserPrompt,
    setUserSearch: setGenerationUserSearch,
    setUserChannel: setGenerationUserChannel,
  } = useGeneratePosts(
    preUserPromptState.prompt ?? '',
    preUserPromptState.search,
    preUserPromptState.channel,
    getCurrentState()
  )

  // ---- Variables ----
  const isGenerationDataFetching = isGenerationLoading || isGenerationFetching
  const isProPlan = user?.plan === 'Pro'

  // ---- Effects ----
  /**
   * Clear prompt state on component unmount to prevent unwanted API calls
   * when navigating back to this page
   */
  useEffect(() => {
    return () => {
      dispatch(clearPrompt())
    }
  }, [dispatch])

  /**
   * Invalidate draft query on component unmount to ensure fresh data on next mount
   */
  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.draft] })
    }
  }, [queryClient])

  /**
   * Set active social tab based on pre-user prompt state, i.e dashboard
   */
  useEffect(() => {
    if (preUserPromptState.channel) {
      setActiveSocialTab(preUserPromptState.channel)
    }
  }, [preUserPromptState.channel])

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
  }, [
    location.search,
    location.pathname,
    setGenerationUserPrompt,
    setGenerationUserSearch,
  ])

  /**
   * Ran when genAI creates Posts
   */
  useEffect(() => {
    if (generatedPostContent.length === 0) {
      return
    }

    generatedPostContent.forEach(post => {
      handleContentChange(post.content, post.channel)
    })

    latestGeneratedPostsRef.current = generatedPostContent
  }, [generatedPostContent, handleContentChange])

  // ---- Main Functions ----
  /**
   * Returns the draft action component
   *
   * @returns The draft action component
   */
  const getDraftActions = () => {
    if (activeTab === TabValue.PAST_RESPONSES) {
      return null
    }

    return (
      <DraftActions
        user={user}
        handlePublishDraft={() => {
          setIsShareModalOpen({ open: true, schedule: false })
        }}
        handleScheduleDraft={() => {
          setIsShareModalOpen({ open: true, schedule: true })
        }}
        handleSaveDraft={handleSaveDraft}
        isSocialCallLoading={
          saveDraftMutation.isPending || isGenerationDataFetching
        }
        handleConnectSocials={() => {
          const callback = () =>
            navigate({
              to: '/settings',
              search: { tabs: 'socials' },
            })

          allowLeaveRef.current = true

          if (
            !postDrafts['LinkedIn']?.content &&
            !postDrafts['Twitter']?.content
          ) {
            setTimeout(() => callback(), 0)
            return
          }

          setTimeout(() => handleSaveDraft(callback), 0)
        }}
        isLoading={
          saveDraftMutation.isPending ||
          isGenerationDataFetching ||
          isDraftActionsDisabled()
        }
        extractedLinks={extractedLinks}
      />
    )
  }

  return (
    <>
      {/* Leave Confirmation Modal */}
      <ConfirmDialog
        open={navBlocker.status === 'blocked'}
        onOpenChange={open => {
          if (!open && navBlocker.status === 'blocked') {
            if (navBlocker.reset) navBlocker.reset()
          }
        }}
        title="Leave this page?"
        description="If you leave now, your current data on this page will be lost."
        confirmLabel="Leave page"
        cancelLabel="Stay"
        onConfirm={() => navBlocker.proceed && navBlocker.proceed()}
      />

      <div className="relative m-auto max-w-7xl p-2">
        {/** Actions on top right - Schedule/publish/save */}
        <div className="hidden gap-2 py-1 lg:absolute lg:top-2 lg:right-2 lg:flex">
          {getDraftActions()}
        </div>

        <Tabs
          className="w-full"
          value={activeTab}
          onValueChange={val => setActiveTab(val as TabValue)}
        >
          {/** Tabs List */}
          <CreateTabList loading={isGenerationDataFetching} />

          {/** Tabs Content - LinkedIn/Twitter Editor */}
          <TabsContent value={TabValue.CREATED_POST}>
            <CreatedPosts
              allSocialTabs={SOCIAL_TABS}
              activeTab={activeSocialTab}
              setActiveTab={setActiveSocialTab}
              post={{
                handleContentChange,
                postDrafts,
                loading:
                  (draftEnabled && draftQuery.isPending) ||
                  isGenerationDataFetching,
              }}
            />

            {/** Loading text */}
            <div
              className={cn(
                'mx-auto mt-2 flex w-full max-w-2xl items-center justify-end gap-1',
                !isGenerationDataFetching && 'hidden'
              )}
            >
              <WordRotate
                words={[
                  'Cooking something up...',
                  'Just a sec...',
                  'Sprinkling some AI magic...',
                  'Still Brewing the answer...',
                ]}
                duration={3000}
                className="text-sm font-medium text-gray-600 select-none dark:text-gray-300"
              />
              <Loader className="size-3 animate-spin" />
            </div>
          </TabsContent>

          {/** Tabs Content - Past Responses */}
          <TabsContent value={TabValue.PAST_RESPONSES}>
            <PastResponse history={history} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Share Post Modal */}
      <SharePostModal
        isOpen={isShareModalOpen}
        posts={getSharePosts()}
        isLoading={isDraftActionsDisabled()}
        onOpenChange={open => {
          setIsShareModalOpen(open)
        }}
        onSubmit={handleSubmitDraft}
      />

      {/** Floating Prompt Input */}
      {user &&
        activeTab === TabValue.CREATED_POST &&
        (!isProPlan && activeSocialTab === 'Twitter'
          ? isSocialConnected('Twitter', user)
          : true) && (
          <FloatingPromptInput
            activeChannel={activeSocialTab}
            onChange={(
              content: string,
              search: boolean,
              channel: string | null
            ) => {
              setGenerationUserPrompt(content)
              setGenerationUserSearch(search)
              setGenerationUserChannel(channel as channelType)

              if (channel) {
                setActiveSocialTab(channel as channelType)
              }
            }}
            loading={isGenerationDataFetching || saveDraftMutation.isPending}
            hidePromptInfo
            submitButtonText={getCurrentState() ? 'Update Post' : 'Create Post'}
            placeholder={getCurrentState() ? EDIT_PROMPT_TEXT : SUGGESTED_PROMPT_TEXT}
          >
            <div className="mb-2 flex justify-center gap-2 lg:hidden">
              {getDraftActions()}
            </div>
          </FloatingPromptInput>
        )}
    </>
  )
}

/**
 * Create tab list component
 */
interface CreateTabListProps {
  loading: boolean
}
const CreateTabList = ({ loading }: CreateTabListProps) => {
  return (
    <TabsList className="w-full px-2 py-6 lg:w-fit">
      {/** Created Posts Tab */}
      <TabsTrigger value={TabValue.CREATED_POST} className="px-2 py-4 text-xs">
        <PenLine className="size-3" /> Created Posts
      </TabsTrigger>

      {/** Past Responses Tab */}
      <TabsTrigger
        value={TabValue.PAST_RESPONSES}
        className="px-2 py-4 text-xs"
        disabled={loading}
      >
        <HistoryIcon className="size-3" /> Post Iterations
      </TabsTrigger>
    </TabsList>
  )
}

export const Route = createLazyRoute('/creation/create')({
  component: Create,
})

export default Create
