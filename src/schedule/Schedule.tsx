import { createLazyRoute, useRouter } from '@tanstack/react-router'
import { format } from 'date-fns'
import { PlusCircle, RotateCcw, Trash2, TriangleAlert } from 'lucide-react'

import Post, { PostSkeleton } from '@/core/components/Post'
import PostListViewLayout from '@/core/layouts/PostListViewLayout'
import ConfirmDialog from '@/shared/components/confirm-dialog'
import PaginationList from '@/shared/components/pagination-list'
import { Button } from '@/shared/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { cn } from '@/shared/utils'

import useScheduleList from './hooks/schedule-list.hook'

const Schedule = () => {
  const router = useRouter()
  const {
    posts,
    isPending,
    selectedRange,
    setSelectedRange,
    groupedBySlot,
    orderedSlots,
    formatSlotRange,
    formatSelectedRange,
    limit,
    offset,
    total,
    setOffset,
    // delete controls
    confirmOpen,
    openDelete,
    closeDelete,
    confirmDelete,
    deletingIds,
    isDeleting,
  } = useScheduleList()

  return (
    <PostListViewLayout
      title="Scheduled Posts"
      dateRange={selectedRange}
      onDateRangeChange={setSelectedRange}
      hideSort
      dateRangeLabel={formatSelectedRange()}
      isPending={isPending}
    >
      {isPending ? (
        <PostSkeleton tileView />
      ) : (
        <>
          {orderedSlots.map(slot =>
            groupedBySlot[slot].length > 0 ? (
              <div
                key={slot}
                className="bg-card space-y-4 rounded-lg border-1 border-dashed p-2"
              >
                {/** Time Slot - eg: 1PM - 2PM */}
                <h3 className="text-xl font-bold text-zinc-600 dark:text-zinc-300">
                  {formatSlotRange(slot)}
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {groupedBySlot[slot].map(post => (
                    <div
                      key={post.id}
                      className={`flex flex-col gap-2 ${deletingIds.has(post.id) ? 'pointer-events-none opacity-50' : ''}`}
                    >
                      <div className="relative">
                        {/** Post View */}
                        <Post {...post} />

                        {/** Warning Symbol */}
                        {post.status === 'Failed' && (
                          <div
                            className={cn(
                              'bg-card absolute -top-2 -right-2 rounded-full border-1 border-dashed p-1 text-yellow-600 dark:text-yellow-400'
                            )}
                          >
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <TriangleAlert className="size-3" />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p>Failed to post</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 px-2 pb-2 text-xs text-zinc-600 dark:text-zinc-300">
                        {format(
                          new Date(post.scheduled_at as string),
                          'MMM d, h:mm a'
                        )}

                        <div className="flex items-center gap-2">
                          {post.status === 'Failed' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-6 text-xs"
                              onClick={e => {
                                e.stopPropagation()
                              }}
                            >
                              Failed please retry
                              <RotateCcw className="size-3" />
                            </Button>
                          )}

                          <Button
                            variant="destructive"
                            className="size-6"
                            onClick={e => {
                              e.stopPropagation()
                              openDelete(post.id)
                            }}
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )}

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
              <p className="text-lg font-semibold">No scheduled posts found</p>

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
        </>
      )}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={open => (open ? undefined : closeDelete())}
        title="Delete scheduled post?"
        description="This action cannot be undone. This will permanently delete the selected scheduled post."
        confirmLabel="Delete"
        confirmDisabled={isDeleting}
        onConfirm={() => {
          confirmDelete()
          closeDelete()
        }}
      />
    </PostListViewLayout>
  )
}

export const Route = createLazyRoute('/schedule')({
  component: Schedule,
})

export default Schedule
