import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLazyRoute, useNavigate } from '@tanstack/react-router'
import { RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { draftsApi } from '@/core/api/drafts.api'
import { PostSkeleton } from '@/core/components/Post'
import LinkedInPost from '@/core/components/post-preview/LinkedInPost'
import TwitterPost from '@/core/components/post-preview/TwitterPost'
import { FloatingPromptInput } from '@/core/components/PromptInput'
import {
  ShareModalOpenState,
  SharePostModal,
} from '@/core/components/SharePostModal'
import { QUERY_KEYS } from '@/core/config/constant'
import { useGeneratePosts } from '@/core/hooks/generate-post.hook'
import { useAppSelector } from '@/core/hooks/global-state.hook'
import { usePublishDraft } from '@/core/hooks/publish-draft.hook'
import { useScheduleDraft } from '@/core/hooks/schedule-draft.hook'
import { useUserState } from '@/core/hooks/user-state.hook'
import { IDraftRequest } from '@/core/models/draft.model'
import ExternalResourceChip from '@/shared/components/external-resource-chip'
import { Button } from '@/shared/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

import GeneratedPostControls from '../components/GeneratedPostControls'

const QuickShare = () => {
  const [activeTab, setActiveTab] = useState<string>('created-post')
  const [isShareModalOpen, setIsShareModalOpen] = useState<ShareModalOpenState>(
    {
      open: false,
      schedule: false,
    }
  )

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutation: publishDraft } = usePublishDraft()
  const { mutation: scheduleDraft } = useScheduleDraft()
  const user = useUserState()

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

  const preUserPrompt = useAppSelector(state => state.promptState.prompt)
  const {
    posts,
    extractedLinks,
    isLoading,
    isFetching,
    error,
    setUserPrompt,
    key,
    refetch,
  } = useGeneratePosts(preUserPrompt || '')

  const isDataFetching = isLoading || isFetching
  const isLoadingPublish = publishDraft.isPending || scheduleDraft.isPending

  useEffect(() => {
    // Redirect to dashboard if no prompt is available
    if (!preUserPrompt) {
      navigate({ to: '/dashboard' })
    }
  }, [preUserPrompt, navigate])

  useEffect(() => {
    return () => {
      // Cancel any ongoing generate-ai-post queries
      queryClient.cancelQueries({ queryKey: [key] })
    }
  }, [queryClient, key])

  /**
   * Ran when genAI API error
   */
  useEffect(() => {
    if (error) {
      toast.error('Something went wrong while generating posts')
    }
  }, [error])

  const onSubmit = (
    postIds: string[],
    schedule: boolean,
    scheduleDate?: string
  ) => {
    const selectedPosts = posts.filter(post => postIds.includes(post.id))
    if (selectedPosts.length === 0) {
      setIsShareModalOpen({ open: false, schedule: false })
      return
    }

    const payload = selectedPosts.map(p => ({
      content: p.content,
      channel: p.channel,
      attached_media: [],
    }))

    if (schedule && scheduleDate) {
      //todo
      scheduleDraft.mutate(
        {
          posts: payload,
          scheduleDate,
        },
        {
          onSuccess: () => {
            setIsShareModalOpen({ open: false, schedule: false })
            toast.success('Draft scheduled successfully')

            // todo navigate to schedule page
            navigate({ to: '/dashboard' })
          },
          onError: () => {
            toast.error('Failed to schedule draft')
          },
        }
      )
      return
    }

    publishDraft.mutate(
      {
        posts: payload,
      },
      {
        onSuccess: () => {
          setIsShareModalOpen({ open: false, schedule: false })
          toast.success('Draft published successfully')
          navigate({ to: '/dashboard' })
        },
        onError: () => {
          toast.error('Failed to publish draft')
        },
      }
    )
  }

  const handleEdit = () => {
    if (!user) {
      return
    }

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

    saveDraftMutation.mutate({
      posts: payload,
    })
  }

  const loading =
    isDataFetching || saveDraftMutation.isPending || publishDraft.isPending

  return (
    <>
      <div className="m-auto flex max-w-4xl flex-col p-5">
        <Tabs
          className="w-full"
          defaultValue="created-post"
          value={activeTab}
          onValueChange={val => setActiveTab(val)}
        >
          <TabsList className="w-full px-2 py-6 lg:w-fit">
            <TabsTrigger
              value="created-post"
              className="px-2 py-4 text-sm lg:px-4 lg:text-base"
            >
              Created Posts
            </TabsTrigger>
            <TabsTrigger
              value="sources"
              className="px-2 py-4 text-sm lg:px-4 lg:text-base"
              disabled={loading}
            >
              Sources
            </TabsTrigger>
          </TabsList>
          <TabsContent value="created-post" className="flex flex-col">
            {/** Generated Post Controls */}
            {(!error || posts.length > 0) && (
              <div className="hidden lg:block">
                <GeneratedPostControls
                  isLoading={loading}
                  onRetry={refetch}
                  onEdit={handleEdit}
                  onPublish={() =>
                    setIsShareModalOpen({ open: true, schedule: false })
                  }
                  onSchedule={() =>
                    setIsShareModalOpen({ open: true, schedule: true })
                  }
                />
              </div>
            )}

            {/** External Resources */}
            {extractedLinks.length > 0 && !loading && (
              <div className="mt-4 hidden w-full gap-2 lg:flex">
                {extractedLinks.slice(0, 5).map(link_data => (
                  <div key={link_data.url} className="flex-1">
                    <ExternalResourceChip
                      url={link_data.url}
                      title={link_data.content}
                    />
                  </div>
                ))}
              </div>
            )}

            {/** Generated Posts */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {isDataFetching ? (
                <>
                  <PostSkeleton />
                  <PostSkeleton />
                </>
              ) : (
                posts.map(post => {
                  if (post.channel === 'LinkedIn') {
                    return (
                      <LinkedInPost
                        key={post.id}
                        initialContent={post.content}
                        loading={isDataFetching}
                        notEditable
                      />
                    )
                  }
                  return (
                    <TwitterPost
                      key={post.id}
                      initialContent={post.content}
                      loading={isDataFetching}
                      notEditable
                    />
                  )
                })
              )}
            </div>

            {error && posts.length === 0 && (
              <div className="flex w-full items-center justify-center rounded-lg border border-dashed p-5">
                <p className="pr-2 text-center text-sm text-gray-500">
                  Something went wrong please
                  <span>
                    <Button
                      variant="outline"
                      onClick={() => refetch()}
                      className="mt-2 ml-2 px-2 py-1 text-sm sm:mt-0"
                    >
                      <RotateCcw className="size-3" />
                      Retry
                    </Button>
                  </span>
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="sources">
            <h2 className="mt-2 text-2xl font-semibold">All sources used</h2>
            {extractedLinks.length > 0 && !isDataFetching ? (
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {extractedLinks.map(link_data => (
                  <div key={link_data.url}>
                    <ExternalResourceChip
                      url={link_data.url}
                      title={link_data.content}
                      showIcon
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 flex w-full items-center justify-center rounded-lg border border-dashed p-5">
                <p className="text-sm text-gray-500">No sources used</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Prompt Input */}
      <FloatingPromptInput
        onChange={prompt => {
          setUserPrompt(prompt)
          setActiveTab('created-post')
        }}
        loading={loading}
        expandable
      >
        {(!error || posts.length > 0) && (
          <div className="block lg:hidden">
            <GeneratedPostControls
              isLoading={loading}
              onlyControls
              onEdit={handleEdit}
              onRetry={refetch}
              onPublish={() =>
                setIsShareModalOpen({ open: true, schedule: false })
              }
              onSchedule={() =>
                setIsShareModalOpen({ open: true, schedule: true })
              }
            />
          </div>
        )}
      </FloatingPromptInput>

      {/* Share Post Modal */}
      <SharePostModal
        isOpen={isShareModalOpen}
        posts={posts}
        isLoading={isLoadingPublish}
        onOpenChange={setIsShareModalOpen}
        onSubmit={onSubmit}
      />
    </>
  )
}

export const Route = createLazyRoute('/quick-share')({
  component: QuickShare,
})

export default QuickShare
