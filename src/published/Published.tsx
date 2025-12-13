import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLazyRoute } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'
import { format } from 'date-fns'
import {
  CircleCheck,
  CircleX,
  ClipboardCheck,
  ExternalLink,
  FolderOpen,
  PlusCircle,
  RotateCcw,
} from 'lucide-react'
import { toast } from 'sonner'

import { postsApi } from '@/core/api/posts.api'
import Post from '@/core/components/Post'
import { QUERY_KEYS } from '@/core/config/constant'
import PostListViewLayout from '@/core/layouts/PostListViewLayout'
import { postStatusType } from '@/core/models/post.model'
import { channelType } from '@/core/models/social.model'
import ErrorBanner from '@/shared/components/error-banner'
import PaginationList from '@/shared/components/pagination-list'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils'

import usePublishList from './hooks/publish-list.hook'

const Published = () => {
  const router = useRouter()
  const {
    dateRange,
    setDateRange,
    isPending,
    sort,
    setSort,
    posts,
    isError,
    total,
    limit,
    offset,
    setOffset,
    formatSelectedRange,
  } = usePublishList()
  const queryClient = useQueryClient()

  const retryPostMutation = useMutation({
    mutationFn: (id: string) => {
      return postsApi.retryPost(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.publishList],
      })
      toast.success('Post retried successfully')
    },
    onError: () => {
      toast.error('Failed to retry post')
    },
  })

  const getPostStatus = (status: postStatusType | undefined) => {
    switch (status) {
      case 'Failed':
        return (
          <>
            <CircleX className="size-3" />
            Publishing Failed
          </>
        )
      case 'Published':
        return (
          <>
            <CircleCheck className="size-3" />
            Published
          </>
        )
      case 'Queued':
        return (
          <>
            <ClipboardCheck className="size-3" />
            Refresh in a bit, don&apos;t worry.
          </>
        )
      default:
        return 'Scheduled'
    }
  }

  const handlePostClick = (channel: channelType, id?: string) => {
    if (!id) return

    switch (channel) {
      case 'Twitter':
        window.open(`https://x.com/i/status/${id}`, '_blank')
        break

      case 'LinkedIn':
        window.open(`https://www.linkedin.com/feed/update/${id}`, '_blank')
        break

      default:
        break
    }
  }

  return (
    <PostListViewLayout
      title={
        <span className="flex items-center gap-2">
          <FolderOpen className="size-5" /> Published Posts
        </span>
      }
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      isPending={isPending}
      sort={sort}
      dateRangeLabel={formatSelectedRange()}
      onSortChange={setSort}
    >
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className={`relative flex flex-col gap-2`}>
            <div>
              <Post {...post} maintainFormatting />

              {post.status === 'Failed' && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2.5 -right-2.5 size-6 rounded-sm text-xs"
                  onClick={e => {
                    e.stopPropagation()
                    retryPostMutation.mutate(post.id)
                  }}
                  disabled={retryPostMutation.isPending}
                >
                  <RotateCcw
                    className={cn(
                      'size-3',
                      retryPostMutation.isPending && 'animate-spin'
                    )}
                  />
                </Button>
              )}
            </div>

            <div className="mx-1 -mt-1 flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-xs font-medium">
                <span
                  className={cn(
                    'flex items-center justify-center gap-2 font-semibold text-zinc-600 dark:text-zinc-300',
                    post.status === 'Failed' &&
                      'text-red-600 dark:text-red-400',
                    post.status === 'Queued' &&
                      'text-yellow-600 dark:text-yellow-400',
                    post.status === 'Published' &&
                      'text-green-600 dark:text-green-400'
                  )}
                >
                  {getPostStatus(post.status)}
                </span>
                {post.external_id && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 rounded-sm p-1 px-2 text-xs"
                    onClick={() =>
                      handlePostClick(post.channel, post.external_id)
                    }
                  >
                    view post <ExternalLink className="size-3" />
                  </Button>
                )}
              </p>

              <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                {post.published_at &&
                  format(
                    new Date(post.published_at as string),
                    'MMM d, h:mm a'
                  )}
              </p>
            </div>
          </div>
        ))}

        {total > limit && (
          <div className="mt-8 mb-8">
            <PaginationList
              limit={limit}
              offset={offset}
              total={total}
              onOffsetChange={setOffset}
            />
          </div>
        )}
        {isError && <ErrorBanner className="mt-0" />}

        {posts.length === 0 && !isError && (
          <div className="flex h-48 w-full flex-col items-center justify-center gap-4">
            <p className="text-lg font-semibold">No published posts found</p>

            <Button
              variant="default"
              onClick={() => {
                router.navigate({ to: '/creation/create' })
              }}
              className="text-xs"
            >
              Create Now
              <PlusCircle className="size-3" />
            </Button>
          </div>
        )}
      </div>
    </PostListViewLayout>
  )
}

export const Route = createLazyRoute('/published')({
  component: Published,
})

export default Published
