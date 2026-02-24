import { createLazyRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { format } from 'date-fns'
import {
  CircleX,
  ExternalLink,
  FileText,
  MoreHorizontal,
  RefreshCw,
  Trash,
} from 'lucide-react'
import { toast } from 'sonner'

import Post, { PostSkeleton } from '@/core/components/Post'
import { type postStatusType } from '@/core/models/post.model'
import ConfirmDialog from '@/shared/components/confirm-dialog'
import DateRangePicker from '@/shared/components/date-range-picker'
import ErrorBanner from '@/shared/components/error-banner'
import PaginationList from '@/shared/components/pagination-list'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { cn } from '@/shared/utils'

import { StatusFilterBase } from '../components/header/status-filter'
import { type PostListStatus, usePostList } from '../hooks/use-post-list.hook'
import { type ICalendarEvent } from '../models/calendar.model'
import { getPublishedUrl } from '../utils/helpers'

function getStatusBadgeClass(status: postStatusType) {
  switch (status) {
    case 'Scheduled':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
    case 'Published':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
    case 'Failed':
      return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
    case 'Queued':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

function getPostDate(post: ICalendarEvent): string | null {
  if (post.status === 'Published') return post.published_at
  if (post.status === 'Scheduled' || post.status === 'Queued')
    return post.scheduled_at
  return post.updated_at
}

function getEmptyMessage(status: PostListStatus) {
  switch (status) {
    case 'Queued':
      return {
        title: 'No queued posts',
        sub: 'Posts waiting to be published will appear here.',
      }
    case 'Scheduled':
      return {
        title: 'No scheduled posts',
        sub: 'Posts you schedule will appear here.',
      }
    case 'Published':
      return {
        title: 'No published posts',
        sub: 'Your published posts will appear here.',
      }
    case 'Failed':
      return { title: 'No failed posts', sub: 'Failed posts will appear here.' }
    default:
      return { title: 'No posts yet', sub: 'Your posts will appear here.' }
  }
}

function CardSkeleton() {
  return (
    <div className="bg-card rounded-lg border">
      <div className="flex items-center justify-between px-3 py-2.5 sm:px-4">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-4 w-28 rounded" />
      </div>
      <Separator />
      <PostSkeleton tileView noBorder />
    </div>
  )
}

function PostListView() {
  const search = useSearch({ from: '/posts-view/list' })
  const navigate = useNavigate()

  const {
    dateRange,
    setDateRange,
    status,
    setStatus,
    sort,
    setSort,
    posts,
    isLoading,
    isFetching,
    isError,
    total,
    limit,
    offset,
    setOffset,
    confirmOpen,
    openDelete,
    closeDelete,
    confirmDelete,
    deletingIds,
    isDeleting,
    retryPost,
  } = usePostList(
    (search.status as PostListStatus) ?? 'all',
    search.from,
    search.to,
    search.sort,
    search.offset
  )

  type ListSearch = {
    status?: postStatusType
    from?: string
    to?: string
    sort?: 'asc' | 'desc'
    offset?: number
  }

  type SyncUpdates = {
    status?: PostListStatus
    from?: string
    to?: string
    sort?: 'asc' | 'desc'
    offset?: number
  }

  const syncUrl = (updates: SyncUpdates) => {
    const next: ListSearch = { ...search }
    if ('from' in updates) next.from = updates.from
    if ('to' in updates) next.to = updates.to
    if ('sort' in updates) next.sort = updates.sort
    if ('offset' in updates) next.offset = updates.offset
    if (!next.offset) delete next.offset
    if (updates.status && updates.status !== 'all') {
      next.status = updates.status
    } else if ('status' in updates) {
      delete next.status
    }
    navigate({ to: '/posts-view/list', search: next, replace: true })
  }

  const handleStatusChange = (newStatus: postStatusType | 'all') => {
    setStatus(newStatus)
    syncUrl({ status: newStatus, offset: undefined })
  }

  const handleDateRangeChange = (range: typeof dateRange) => {
    setDateRange(range)
    const from = range?.from?.toISOString()
    const to = (range?.to ?? range?.from)?.toISOString()
    syncUrl({ from, to, offset: undefined })
  }

  const handleSortChange = (newSort: 'asc' | 'desc') => {
    setSort(newSort)
    syncUrl({ sort: newSort, offset: undefined })
  }

  const handleOffsetChange = (newOffset: number) => {
    setOffset(newOffset)
    syncUrl({ offset: newOffset })
  }

  if (isError) return <ErrorBanner />

  const emptyMsg = getEmptyMessage(status)
  // Full skeleton only when there's no data; dim existing cards on background refetch.
  const showSkeletons = isLoading
  const isBgFetching = isFetching && !isLoading

  return (
    <>
      {/* Filter bar */}
      <div className="bg-secondary dark:bg-secondary/70 border-t border-b py-3">
        <div className="mx-auto w-full max-w-5xl px-3 sm:px-4 md:px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Date range */}
            <div className="flex items-center gap-1">
              <DateRangePicker
                value={dateRange}
                onValueChange={handleDateRangeChange}
                className="w-full md:w-auto"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => handleDateRangeChange(undefined)}
                  >
                    <CircleX className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Clear dates</TooltipContent>
              </Tooltip>
            </div>

            {/* Status filter — same component as calendar header */}
            <StatusFilterBase
              value={status}
              onChange={handleStatusChange}
              align="start"
            />

            {/* Sort */}
            <div className="ml-auto flex items-center gap-2 whitespace-nowrap">
              <p className="shrink-0 text-sm font-medium">Sort by</p>
              <Select
                value={sort}
                onValueChange={(v: 'asc' | 'desc') => handleSortChange(v)}
              >
                <SelectTrigger className="bg-card w-[130px] font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Latest</SelectItem>
                  <SelectItem value="asc">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="mx-auto mt-4 mb-8 w-full max-w-5xl px-3 sm:px-4 md:px-6">
        {/* Shimmer — shown on every fetch */}
        {showSkeletons && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!showSkeletons && posts.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="bg-muted rounded-xl p-4">
              <FileText className="text-muted-foreground size-6" />
            </div>
            <p className="text-sm font-medium">{emptyMsg.title}</p>
            <p className="text-muted-foreground text-xs">{emptyMsg.sub}</p>
          </div>
        )}

        {/* Post cards — 2-column grid on md+ */}
        {!showSkeletons && posts.length > 0 && (
          <div
            className={cn(
              'grid grid-cols-1 gap-4 md:grid-cols-2',
              isBgFetching &&
                'pointer-events-none opacity-50 transition-opacity'
            )}
          >
            {posts.map(post => {
              const postDate = getPostDate(post)
              const externalUrl = getPublishedUrl(
                post.channel.toLowerCase(),
                post.external_id
              )
              const isDisabled = deletingIds.has(post.id)

              return (
                <div
                  key={post.id}
                  className={cn(
                    'bg-card flex flex-col rounded-lg border',
                    isDisabled && 'pointer-events-none opacity-40'
                  )}
                >
                  {/* Card header: status badge + date + actions */}
                  <div className="flex items-center justify-between px-3 py-2.5 sm:px-4">
                    <Badge
                      className={cn(
                        'rounded-full text-xs',
                        getStatusBadgeClass(post.status)
                      )}
                    >
                      {post.status}
                    </Badge>

                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      {postDate && (
                        <span title={new Date(postDate).toString()}>
                          {format(new Date(postDate), 'MMM d, h:mm a')}
                        </span>
                      )}

                      {(post.status === 'Scheduled' ||
                        post.status === 'Published' ||
                        post.status === 'Failed') && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-foreground size-7"
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {post.status === 'Published' && externalUrl && (
                              <DropdownMenuItem asChild>
                                <a
                                  href={externalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2"
                                >
                                  <ExternalLink className="size-4" />
                                  View Post
                                </a>
                              </DropdownMenuItem>
                            )}
                            {post.status === 'Failed' && (
                              <DropdownMenuItem
                                onClick={() => {
                                  retryPost(post.id)
                                  toast.success('Retrying post...')
                                }}
                              >
                                <RefreshCw className="size-4" />
                                Retry
                              </DropdownMenuItem>
                            )}
                            {post.status === 'Scheduled' && (
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => openDelete(post.id)}
                                className="bg-destructive/10 focus:bg-destructive/20 dark:focus:bg-destructive/25 mt-1 rounded-md"
                              >
                                <Trash className="size-4" />
                                Unschedule
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Full post preview */}
                  <Post
                    id={post.id}
                    channel={post.channel}
                    content={post.content}
                    maintainFormatting
                    noBorder
                  />
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {!showSkeletons && posts.length > 0 && total > limit && (
          <div className="mt-8 mb-8">
            <PaginationList
              limit={limit}
              offset={offset}
              total={total}
              onOffsetChange={handleOffsetChange}
            />
          </div>
        )}

        {/* Confirm unschedule dialog */}
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={open => (open ? undefined : closeDelete())}
          title="Unschedule post?"
          description="This action cannot be undone. The post will be removed from the schedule."
          confirmLabel="Unschedule"
          confirmDisabled={isDeleting}
          onConfirm={() => {
            confirmDelete()
            closeDelete()
          }}
        />
      </div>
    </>
  )
}

export const Route = createLazyRoute('/posts-view/list')({
  component: PostListView,
})

export default PostListView
