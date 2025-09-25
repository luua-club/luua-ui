import { createLazyRoute } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'
import { format } from 'date-fns'
import {
  CircleCheck,
  CircleX,
  ClipboardCheck,
  PlusCircle,
  RotateCcw,
  TriangleAlert,
} from 'lucide-react'

import Post from '@/core/components/Post'
import PostListViewLayout from '@/core/layouts/PostListViewLayout'
import { postStatusType } from '@/core/models/post.model'
import PaginationList from '@/shared/components/pagination-list'
import { Button } from '@/shared/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { cn } from '@/shared/utils'

import usePublishList from '../hooks/publish-list.hook'

const Published = () => {
  const router = useRouter()
  const {
    dateRange,
    setDateRange,
    isPending,
    sort,
    setSort,
    posts,
    total,
    limit,
    offset,
    setOffset,
    formatSelectedRange,
  } = usePublishList()

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
            Queued
          </>
        )
      default:
        return 'Scheduled'
    }
  }

  return (
    <PostListViewLayout
      title="Published Posts"
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
              <Post {...post} />
              {post.status === 'Failed' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'bg-card absolute -top-2.5 -right-2.5 rounded-full border-1 border-dashed p-1 text-yellow-600 dark:text-yellow-400'
                      )}
                    >
                      <TriangleAlert className="size-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">Publishing failed</TooltipContent>
                </Tooltip>
              )}
            </div>

            <div className="mx-1 -mt-1 flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-xs font-medium">
                <span
                  className={cn(
                    'flex items-center gap-1 text-zinc-600 dark:text-zinc-300',
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

                {post.status === 'Failed' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-fit !rounded-sm !px-1 !py-0.5 text-xs"
                  >
                    <RotateCcw className="size-3" />
                    Retry
                  </Button>
                )}
              </p>

              <p className="text-xs text-zinc-600 dark:text-zinc-300">
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

        {posts.length === 0 && (
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
