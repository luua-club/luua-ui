import { useQueryClient } from '@tanstack/react-query'
import { createLazyRoute, useNavigate } from '@tanstack/react-router'
import { RotateCcw } from 'lucide-react'
import { useEffect } from 'react'

import Post, { PostSkeleton } from '@/core/components/Post'
import { FloatingPromptInput } from '@/core/components/PromptInput'
import { useGeneratePosts } from '@/core/hooks/generate-post.hook'
import { useAppSelector } from '@/core/hooks/global-state.hook'
import ExternalResourceChip from '@/shared/components/external-resource-chip'
import { Button } from '@/shared/ui/button'

import QuickShareHeader from '../components/QuickShareHeader'

const QuickShare = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const preUserPrompt = useAppSelector(state => state.promptState.prompt)
  const {
    posts,
    extractedLinks,
    isLoading,
    isFetching,
    setUserPrompt,
    key,
    activePrompt,
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

  return (
    <>
      <div className="m-auto flex max-w-4xl flex-col p-5">
        {/* Header */}
        <QuickShareHeader isLoading={isDataFetching} />

        {/* Posts */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {isDataFetching ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : (
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

        {/** User added prompt */}
        <div className="mb-72 flex flex-col">
          <p className="mt-4 rounded-md border-1 border-dashed p-2 text-sm text-gray-600">
            <span className="font-semibold text-black">
              {isDataFetching ? 'Generating' : 'Results'} for -{' '}
            </span>
            {activePrompt}
          </p>
          <Button
            variant={'ghost'}
            className="mt-2 self-end !py-0 font-normal text-gray-500"
            onClick={() => refetch()}
            disabled={isDataFetching}
          >
            <RotateCcw className="size-3" />
            Retry
          </Button>
        </div>
      </div>

      {/* Floating Prompt Input */}
      <FloatingPromptInput onChange={setUserPrompt} loading={isDataFetching}>
        {extractedLinks.length > 0 && !isDataFetching && (
          <div className="scrollbar-thin mb-4 flex items-center gap-2 pb-2">
            {extractedLinks.map(link_data => (
              <ExternalResourceChip
                key={link_data.url}
                url={link_data.url}
                title={link_data.title}
              />
            ))}
          </div>
        )}
      </FloatingPromptInput>
    </>
  )
}

export const Route = createLazyRoute('/quick-share')({
  component: QuickShare,
})

export default QuickShare
