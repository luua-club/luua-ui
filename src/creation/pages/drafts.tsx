import { createLazyRoute } from '@tanstack/react-router'
import { format } from 'date-fns'
import { PencilRuler, Trash } from 'lucide-react'

import Post, { PostSkeleton } from '@/core/components/Post'
import { SOCIAL_PLATFORM } from '@/core/config/constant'
import { DraftItem } from '@/core/models/draft.model'
import { channelType } from '@/core/models/social.model'
import ConfirmDialog from '@/shared/components/confirm-dialog'
import { Button } from '@/shared/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

import PaginationList from '../../shared/components/pagination-list'
import DraftListControls from '../components/DraftListControls'
import { useDraftList } from '../hooks/draft-list.hook'

const Drafts = () => {
  const {
    dateRange,
    setDateRange,
    sort,
    setSort,
    drafts,
    isLoading,
    isError,
    limit,
    offset,
    setOffset,
    total,
    confirmOpen,
    openDelete,
    closeDelete,
    confirmDelete,
    deletingIds,
    isDeleting,
  } = useDraftList()

  const handleDeleteDraft = (draftId: string) => openDelete(draftId)

  if (isError) {
    return (
      <div className="bg-sidebar m-auto mt-8 flex h-24 max-w-4xl items-center justify-center rounded-lg border-1 p-5">
        <p className="text-sm font-semibold">
          Something Went Wrong, Please retry after some time
        </p>
      </div>
    )
  }

  return (
    <div className="m-auto flex max-w-4xl flex-col p-5">
      <h1 className="text-xl font-semibold">Your Saved Drafts</h1>

      <div className="mt-8">
        <DraftListControls
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          sort={sort}
          onSortChange={setSort}
        />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {isLoading && (
          <div className="bg-sidebar rounded-lg border-1 p-4">
            <PostSkeleton />
            <PostSkeleton />
          </div>
        )}
        {!isLoading && (
          <>
            {drafts.length === 0 && (
              <div className="bg-sidebar flex h-24 items-center justify-center rounded-lg border-1">
                <p className="text-sm font-semibold">No drafts found</p>
              </div>
            )}
            {drafts.map((draft, idx) => {
              return (
                <div
                  className={`bg-sidebar rounded-lg border-1 p-4 pt-2 ${deletingIds.has(draft.id) ? 'pointer-events-none opacity-50' : ''}`}
                  key={draft.id}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p
                      title={new Date(draft.updated_at).toString()}
                      className="text-xs font-semibold sm:text-sm"
                    >
                      {format(
                        new Date(draft.updated_at),
                        'EEE, MMM d, hh:mm a'
                      )}
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="!p-1.5 text-xs sm:!p-2 sm:text-sm"
                      >
                        <PencilRuler className="size-3 sm:size-4" />
                        Edit
                      </Button>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="!px-2.5 !py-1.5 sm:!px-2 sm:!py-2"
                            onClick={() => handleDeleteDraft(draft.id)}
                          >
                            <Trash className="size-3 sm:size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span>Delete</span>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {getPost(`${draft.id}-${idx}`, 'LinkedIn', draft)}
                    {getPost(`${draft.id}-${idx + 1}`, 'Twitter', draft)}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>

      {!isLoading && drafts.length > 0 && total > limit && (
        <div className="mt-8 mb-8">
          <PaginationList
            limit={limit}
            offset={offset}
            total={total}
            onOffsetChange={setOffset}
          />
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={open => (open ? undefined : closeDelete())}
        title="Delete draft?"
        description="This action cannot be undone. This will permanently delete the selected draft."
        confirmLabel="Delete"
        confirmDisabled={isDeleting}
        onConfirm={() => {
          confirmDelete()
          closeDelete()
        }}
      />
    </div>
  )
}

const getPost = (id: string, channel: channelType, draftItem: DraftItem) => {
  const item = draftItem.posts.find(post => post.channel === channel)
  const PlatformIcon = SOCIAL_PLATFORM.find(s => s.name === channel)?.logo

  if (!item) {
    return (
      <div className="flex items-center justify-center rounded-lg border-1 bg-white p-4">
        <p className="flex items-center gap-4 rounded-full border-1 border-dashed p-4 text-sm font-semibold">
          {PlatformIcon ? <PlatformIcon size={24} /> : <span>{channel}</span>}
          Not Posted
        </p>
      </div>
    )
  }

  return (
    <Post
      id={`${id}`}
      channel={item.channel}
      content={item.content}
      attached_media={item.attached_media}
      tileView
    />
  )
}

export const Route = createLazyRoute('/creation/drafts')({
  component: Drafts,
})

export default Drafts
