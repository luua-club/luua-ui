import { useQueryClient } from '@tanstack/react-query'
import { createLazyRoute, useNavigate } from '@tanstack/react-router'
import { RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

import Post, { PostSkeleton } from '@/core/components/Post'
import { FloatingPromptInput } from '@/core/components/PromptInput'
import { SharePostModal } from '@/core/components/SharePostModal'
import { useGeneratePosts } from '@/core/hooks/generate-post.hook'
import { useAppSelector } from '@/core/hooks/global-state.hook'
import ExternalResourceChip from '@/shared/components/external-resource-chip'
import { Button } from '@/shared/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

import GeneratedPostControls from '../components/GeneratedPostControls'

const QuickShare = () => {
  const [activeTab, setActiveTab] = useState<string>('created-post')
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const navigate = useNavigate()
  const queryClient = useQueryClient()

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

  const onSubmit = (postIds: string[]) => {
    //TODO: Implement publish logic
    console.log(posts.filter(post => postIds.includes(post.id)))
    setIsShareModalOpen(false)
  }

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
              disabled={isDataFetching}
            >
              Sources
            </TabsTrigger>
          </TabsList>
          <TabsContent value="created-post" className="flex flex-col">
            {/** Generated Post Controls */}
            {!error && (
              <div className="hidden md:block">
                <GeneratedPostControls
                  isLoading={isDataFetching}
                  onRetry={refetch}
                  onPublish={() => setIsShareModalOpen(true)}
                />
              </div>
            )}

            {/** External Resources */}
            {extractedLinks.length > 0 && !isDataFetching && (
              <div className="mt-4 hidden w-full gap-2 lg:flex">
                {extractedLinks.slice(0, 5).map(link_data => (
                  <div key={link_data.url} className="flex-1">
                    <ExternalResourceChip
                      url={link_data.url}
                      title={link_data.title}
                    />
                  </div>
                ))}
              </div>
            )}

            {/** Generated Posts */}
            <div className="mt-4 grid grid-cols-1 gap-6 pb-48 lg:grid-cols-2">
              {isDataFetching ? (
                <>
                  <PostSkeleton />
                  <PostSkeleton />
                </>
              ) : (
                //TODO: Replace with post preview
                posts.map(post => (
                  <Post
                    id={post.id}
                    key={post.id}
                    channel={post.channel}
                    content={post.content}
                  />
                ))
              )}
            </div>

            {error && (
              <div className="mt-4 mb-48 flex w-full items-center justify-center rounded-lg border border-dashed p-5">
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
              <div className="mt-4 grid grid-cols-1 gap-4 pb-48 lg:grid-cols-3">
                {extractedLinks.map(link_data => (
                  <div key={link_data.url}>
                    <ExternalResourceChip
                      url={link_data.url}
                      title={link_data.title}
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
        loading={isDataFetching}
      >
        {!error && (
          <div className="block md:hidden">
            <GeneratedPostControls
              isLoading={isDataFetching}
              onlyControls
              onRetry={refetch}
              onPublish={() => setIsShareModalOpen(true)}
            />
          </div>
        )}
      </FloatingPromptInput>

      {/* Share Post Modal */}
      <SharePostModal
        isOpen={isShareModalOpen}
        posts={posts}
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
